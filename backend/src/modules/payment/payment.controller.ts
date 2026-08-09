import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { UserDec } from "../../common/decorators/user.decorator";
import { formatResponse } from "../../utils/formatResponse";
import { CreatePaymentUrlDto, PaymentWebhookDto } from "./dto/payment.dto";
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
