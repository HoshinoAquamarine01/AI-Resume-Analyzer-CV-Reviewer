import { Request, Response, NextFunction } from "express";
import { formatResponse } from "../utils/formatResponse";

function badRequest(res: Response, message: string) {
  return res.status(400).json(formatResponse(null, message, "error"));
}

export const validateCreatePaymentIntent = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { amount, currency, paymentMethodId, metadata } = req.body as Record<
    string,
    any
  >;

  if (amount === undefined || typeof amount !== "number" || amount <= 0) {
    return badRequest(res, "amount must be a positive number");
  }

  if (
    !currency ||
    typeof currency !== "string" ||
    currency.trim().length !== 3
  ) {
    return badRequest(res, "currency must be a 3-letter code (e.g., USD)");
  }

  if (paymentMethodId !== undefined && typeof paymentMethodId !== "string") {
    return badRequest(res, "paymentMethodId must be a string");
  }

  if (metadata !== undefined && typeof metadata !== "object") {
    return badRequest(res, "metadata must be an object");
  }

  req.body.currency = currency.trim().toUpperCase();
  next();
};

export const validateWebhook = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {

  if (!req.body || Object.keys(req.body).length === 0) {
    return badRequest(res, "Webhook payload is required");
  }
  next();
};

export const validateCreateSubscription = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { planId, customerId, paymentMethodId } = req.body as Record<
    string,
    any
  >;
  if (!planId || typeof planId !== "string")
    return badRequest(res, "planId is required");
  if (!customerId || typeof customerId !== "string")
    return badRequest(res, "customerId is required");
  if (paymentMethodId !== undefined && typeof paymentMethodId !== "string")
    return badRequest(res, "paymentMethodId must be a string");
  next();
};

export default {
  validateCreatePaymentIntent,
  validateWebhook,
  validateCreateSubscription,
};
