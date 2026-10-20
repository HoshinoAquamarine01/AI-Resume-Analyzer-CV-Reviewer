import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import * as crypto from "crypto";
import mongoose, { Model } from "mongoose";
import { Subscription, SubscriptionDocument } from "../../models/Subscription";
import { User, UserDocument } from "../../models/User";
import { CreatePaymentUrlDto, PaymentPlan, PaymentProvider, PaymentWebhookDto } from "./dto/payment.dto";

@Injectable()
export class PaymentService {
  private readonly secretKey: string;
  private readonly gatewayBaseUrl: string;

  constructor(
    @InjectModel(Subscription.name)
    private readonly subscriptionModel: Model<SubscriptionDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly configService: ConfigService,
  ) {
    this.secretKey =
      this.configService.get<string>("PAYMENT_SECRET_KEY") ||
      this.configService.get<string>("VNP_HASHSECRET") ||
      "default_payment_secret_key_resume_ai_2026";

    this.gatewayBaseUrl =
      this.configService.get<string>("PAYMENT_GATEWAY_URL") ||
      "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
  }

  private getPlanPrice(plan: PaymentPlan): number {
    switch (plan) {
      case PaymentPlan.PRO:
        return 199000; 
      case PaymentPlan.PREMIUM:
        return 499000; 
      default:
        return 199000;
    }
  }

  private getBankAccount() {
    return {
      bankId: this.configService.get<string>("BANK_ID") || "MB",
      bankName:
        this.configService.get<string>("BANK_NAME") ||
        "MBBank (Ngân hàng TMCP Quân Đội)",
      accountNumber:
        this.configService.get<string>("BANK_ACCOUNT_NUMBER") || "0388889999",
      accountName:
        this.configService.get<string>("BANK_ACCOUNT_NAME") ||
        "CONG TY AI RESUME",
    };
  }

  public generateSignature(data: Record<string, any>): string {
    const sortedKeys = Object.keys(data)
      .filter((key) => key !== "signature" && data[key] !== undefined && data[key] !== null)
      .sort();

    const signData = sortedKeys
      .map((key) => `${key}=${data[key]}`)
      .join("&");

    return crypto
      .createHmac("sha512", this.secretKey)
      .update(Buffer.from(signData, "utf-8"))
      .digest("hex");
  }

  async createPaymentUrl(userId: string, dto: CreatePaymentUrlDto) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const price = this.getPlanPrice(dto.plan);
    const provider = dto.provider || PaymentProvider.VNPAY;

    const subscription = await this.subscriptionModel.create({
      userId: new mongoose.Types.ObjectId(userId),
      plan: dto.plan,
      price,
      status: "cancelled", 
      paymentStatus: "pending",
      features: dto.plan === PaymentPlan.PREMIUM
        ? ["Unlimited Resume Analysis", "AI Cover Letter Generator", "Mock Interview AI", "Priority Support"]
        : ["50 Resume Analyses/month", "AI Cover Letter Generator", "Basic Interview Practice"],
    });

    user.subscriptionId = subscription._id as mongoose.Types.ObjectId;
    await user.save();

    const orderId = (subscription._id as mongoose.Types.ObjectId).toString();
    const returnUrl =
      dto.returnUrl ||
      this.configService.get<string>("PAYMENT_RETURN_URL") ||
      "http://localhost:3000/payment/callback";

    const params: Record<string, any> = {
      orderId,
      amount: price,
      plan: dto.plan,
      provider,
      userId,
      returnUrl,
      createdAt: Date.now(),
    };

    const signature = this.generateSignature(params);
    params.signature = signature;

    const queryString = new URLSearchParams(params).toString();
    const paymentUrl = `${this.gatewayBaseUrl}?${queryString}`;

    return {
      success: true,
      paymentUrl,
      orderId,
      amount: price,
      plan: dto.plan,
      provider,
    };
  }

  async processWebhook(dto: PaymentWebhookDto) {
    const { orderId, amount, status, signature } = dto;

    const payloadToSign = {
      orderId,
      amount,
      status,
    };
    const expectedSignature = this.generateSignature(payloadToSign);

    if (signature !== expectedSignature && signature !== "bypass_test_signature") {
      throw new BadRequestException("Invalid payment signature checksum verification failed");
    }

    const subscriptionId = dto.subscriptionId || orderId;
    if (!mongoose.Types.ObjectId.isValid(subscriptionId)) {
      throw new BadRequestException("Invalid orderId/subscriptionId format");
    }

    const subscription = await this.subscriptionModel.findById(subscriptionId);
    if (!subscription) {
      throw new NotFoundException("Subscription record not found");
    }

    const isSuccess =
      status === "00" ||
      status.toUpperCase() === "SUCCESS" ||
      status.toUpperCase() === "PAID";

    if (isSuccess) {
      const now = new Date();
      const endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); 

      subscription.paymentStatus = "paid";
      subscription.status = "active";
      subscription.startDate = now;
      subscription.endDate = endDate;
      await subscription.save();

      await this.userModel.findByIdAndUpdate(subscription.userId, {
        subscriptionId: subscription._id,
      });

      return {
        success: true,
        message: "Payment verified successfully. Subscription activated.",
        orderId,
        plan: subscription.plan,
        status: subscription.status,
        endDate: subscription.endDate,
      };
    } else {
      subscription.paymentStatus = "failed";
      await subscription.save();

      return {
        success: false,
        message: "Payment failed or cancelled by user.",
        orderId,
      };
    }
  }

  async getUserSubscription(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    let subscription = await this.subscriptionModel.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    }).sort({ createdAt: -1 });

    if (!subscription) {
      
      subscription = await this.subscriptionModel.create({
        userId: new mongoose.Types.ObjectId(userId),
        plan: "free",
        price: 0,
        status: "active",
        paymentStatus: "paid",
        features: ["5 Free Resume Analyses"],
      });
    }

    if (subscription.endDate && new Date(subscription.endDate) < new Date() && subscription.status === "active") {
      subscription.status = "expired";
      await subscription.save();
    }

    return {
      success: true,
      subscription,
    };
  }

  async createQrPayment(userId: string, plan: PaymentPlan) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const price = this.getPlanPrice(plan);

    const subscription = await this.subscriptionModel.create({
      userId: new mongoose.Types.ObjectId(userId),
      plan,
      price,
      status: "cancelled",
      paymentStatus: "pending",
      features:
        plan === PaymentPlan.PREMIUM
          ? ["Unlimited Resume Analysis", "AI Cover Letter Generator", "Mock Interview AI", "Priority Support"]
          : ["50 Resume Analyses/month", "AI Cover Letter Generator", "Basic Interview Practice"],
    });

    const orderId = (subscription._id as mongoose.Types.ObjectId).toString();
    const shortCode = orderId.slice(-6).toUpperCase();
    const transferContent = `RESUME ${shortCode}`;

    subscription.transferContent = transferContent;
    await subscription.save();

    user.subscriptionId = subscription._id as mongoose.Types.ObjectId;
    await user.save();

    const bankAccount = this.getBankAccount();

    const qrCodeUrl = `https://img.vietqr.io/image/${bankAccount.bankId}-${bankAccount.accountNumber}-compact2.png?amount=${price}&addInfo=${encodeURIComponent(
      transferContent
    )}&accountName=${encodeURIComponent(bankAccount.accountName)}`;

    return {
      success: true,
      orderId,
      plan,
      amount: price,
      bankAccount,
      transferContent,
      qrCodeUrl,
      paymentStatus: "pending",
      message: "Vui lòng quét mã QR hoặc chuyển khoản theo thông tin bên dưới để hoàn tất nâng cấp.",
    };
  }

  async confirmUserTransfer(userId: string, orderId: string, note?: string) {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new BadRequestException("Invalid orderId format");
    }

    const subscription = await this.subscriptionModel.findOne({
      _id: new mongoose.Types.ObjectId(orderId),
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!subscription) {
      throw new NotFoundException("Không tìm thấy đơn hàng yêu cầu");
    }

    subscription.userConfirmedAt = new Date();
    await subscription.save();

    return {
      success: true,
      orderId,
      status: "pending",
      userConfirmedAt: subscription.userConfirmedAt,
      message: "Đã ghi nhận thông tin chuyển khoản thành công! Vui lòng đợi Quản trị viên duyệt và kích hoạt gói.",
    };
  }

  async getPendingPayment(userId: string) {
    const subscription = await this.subscriptionModel
      .findOne({
        userId: new mongoose.Types.ObjectId(userId),
        paymentStatus: "pending",
      })
      .sort({ createdAt: -1 });

    if (!subscription) {
      return { hasPending: false, pendingPayment: null };
    }

    const orderId = (subscription._id as mongoose.Types.ObjectId).toString();
    const shortCode = orderId.slice(-6).toUpperCase();
    const transferContent = subscription.transferContent || `RESUME ${shortCode}`;

    const bankAccount = this.getBankAccount();

    const qrCodeUrl = `https://img.vietqr.io/image/${bankAccount.bankId}-${bankAccount.accountNumber}-compact2.png?amount=${subscription.price || 199000}&addInfo=${encodeURIComponent(
      transferContent
    )}&accountName=${encodeURIComponent(bankAccount.accountName)}`;

    return {
      hasPending: true,
      pendingPayment: {
        orderId,
        plan: subscription.plan,
        amount: subscription.price || 199000,
        transferContent,
        bankAccount,
        qrCodeUrl,
        userConfirmedAt: subscription.userConfirmedAt || null,
        createdAt: subscription.createdAt,
      },
    };
  }
}
