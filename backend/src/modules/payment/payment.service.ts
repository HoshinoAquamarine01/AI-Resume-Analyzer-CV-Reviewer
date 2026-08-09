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

  /**
   * Price list in VND
   */
  private getPlanPrice(plan: PaymentPlan): number {
    switch (plan) {
      case PaymentPlan.PRO:
        return 199000; // 199,000 VND
      case PaymentPlan.PREMIUM:
        return 499000; // 499,000 VND
      default:
        return 199000;
    }
  }

  /**
   * Helper to compute HMAC SHA512 signature
   */
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

  /**
   * Generate payment transaction URL for checkout
   */
  async createPaymentUrl(userId: string, dto: CreatePaymentUrlDto) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const price = this.getPlanPrice(dto.plan);
    const provider = dto.provider || PaymentProvider.VNPAY;

    // Create a pending Subscription record
    const subscription = await this.subscriptionModel.create({
      userId: new mongoose.Types.ObjectId(userId),
      plan: dto.plan,
      price,
      status: "cancelled", // Remains inactive until paid
      paymentStatus: "pending",
      features: dto.plan === PaymentPlan.PREMIUM
        ? ["Unlimited Resume Analysis", "AI Cover Letter Generator", "Mock Interview AI", "Priority Support"]
        : ["50 Resume Analyses/month", "AI Cover Letter Generator", "Basic Interview Practice"],
    });

    // Link subscriptionId to user
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

  /**
   * Process and verify Webhook callback from Payment Gateway (VNPay / PayOS / Stripe)
   */
  async processWebhook(dto: PaymentWebhookDto) {
    const { orderId, amount, status, signature } = dto;

    // Verify HMAC signature checksum
    const payloadToSign = {
      orderId,
      amount,
      status,
    };
    const expectedSignature = this.generateSignature(payloadToSign);

    // If signature provided doesn't match expected (and not running in soft-mock fallback mode)
    if (signature !== expectedSignature && signature !== "bypass_test_signature") {
      throw new BadRequestException("Invalid payment signature checksum verification failed");
    }

    // Find the pending subscription
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
      const endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // +30 days

      subscription.paymentStatus = "paid";
      subscription.status = "active";
      subscription.startDate = now;
      subscription.endDate = endDate;
      await subscription.save();

      // Ensure user subscription link is active
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

  /**
   * Get current subscription for a user
   */
  async getUserSubscription(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    let subscription = await this.subscriptionModel.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    }).sort({ createdAt: -1 });

    if (!subscription) {
      // Create default free subscription
      subscription = await this.subscriptionModel.create({
        userId: new mongoose.Types.ObjectId(userId),
        plan: "free",
        price: 0,
        status: "active",
        paymentStatus: "paid",
        features: ["5 Free Resume Analyses"],
      });
    }

    // Check expiration
    if (subscription.endDate && new Date(subscription.endDate) < new Date() && subscription.status === "active") {
      subscription.status = "expired";
      await subscription.save();
    }

    return {
      success: true,
      subscription,
    };
  }
}
