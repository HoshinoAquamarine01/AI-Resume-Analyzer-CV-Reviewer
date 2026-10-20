import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { UserDec } from "../../common/decorators/user.decorator";
import { formatResponse } from "../../utils/formatResponse";
import { ConfirmTransferDto, CreatePaymentUrlDto, CreateQrPaymentDto, PaymentWebhookDto } from "./dto/payment.dto";
import { PaymentService } from "./payment.service";

@Controller("payment")
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post("create-url")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async createPaymentUrl(@UserDec() user: any, @Body() dto: CreatePaymentUrlDto) {
    const result = await this.paymentService.createPaymentUrl(user._id, dto);
    return formatResponse(result, "Payment URL generated successfully");
  }

  @Post("create-qr")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async createQrPayment(@UserDec() user: any, @Body() dto: CreateQrPaymentDto) {
    const result = await this.paymentService.createQrPayment(user._id, dto.plan);
    return formatResponse(result, "QR code payment generated successfully");
  }

  @Post("confirm-transfer")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async confirmTransfer(@UserDec() user: any, @Body() dto: ConfirmTransferDto) {
    const result = await this.paymentService.confirmUserTransfer(user._id, dto.orderId, dto.note);
    return formatResponse(result, result.message);
  }

  @Get("pending")
  @UseGuards(JwtAuthGuard)
  async getPendingPayment(@UserDec() user: any) {
    const result = await this.paymentService.getPendingPayment(user._id);
    return formatResponse(result, "Pending payment retrieved");
  }

  @Post("webhook")
  @HttpCode(HttpStatus.OK)
  async handleWebhook(@Body() dto: PaymentWebhookDto) {
    const result = await this.paymentService.processWebhook(dto);
    return formatResponse(result, result.message);
  }

  @Get("subscription")
  @UseGuards(JwtAuthGuard)
  async getUserSubscription(@UserDec() user: any) {
    const result = await this.paymentService.getUserSubscription(user._id);
    return formatResponse(result.subscription, "User subscription retrieved successfully");
  }
}
