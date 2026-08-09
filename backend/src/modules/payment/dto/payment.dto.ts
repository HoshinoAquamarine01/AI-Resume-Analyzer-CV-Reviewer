import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export enum PaymentPlan {
  PRO = "pro",
  PREMIUM = "premium",
}

export enum PaymentProvider {
  VNPAY = "vnpay",
  PAYOS = "payos",
  STRIPE = "stripe",
}

export class CreatePaymentUrlDto {
  @IsEnum(PaymentPlan, { message: "plan must be either 'pro' or 'premium'" })
  @IsNotEmpty({ message: "plan is required" })
  plan: PaymentPlan;

  @IsOptional()
  @IsEnum(PaymentProvider, { message: "provider must be 'vnpay', 'payos', or 'stripe'" })
  provider?: PaymentProvider = PaymentProvider.VNPAY;

  @IsOptional()
  @IsString({ message: "returnUrl must be a string" })
  returnUrl?: string;
}

export class PaymentWebhookDto {
  @IsString({ message: "orderId is required" })
  @IsNotEmpty({ message: "orderId is required" })
  orderId: string;

  @IsNotEmpty({ message: "amount is required" })
  amount: number | string;

  @IsString({ message: "status is required" })
  @IsNotEmpty({ message: "status is required" })
  status: string;

  @IsString({ message: "signature is required" })
  @IsNotEmpty({ message: "signature is required" })
  signature: string;

  @IsOptional()
  @IsString()
  provider?: string;

  @IsOptional()
  @IsString()
  subscriptionId?: string;
}
