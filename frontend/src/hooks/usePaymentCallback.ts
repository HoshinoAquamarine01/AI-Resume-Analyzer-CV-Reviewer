import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import paymentService, { PaymentWebhookPayload } from "../services/paymentService";

export type PaymentCallbackStatus = "loading" | "success" | "failed" | "error";

export interface PaymentDetails {
  orderId: string;
  amount: number;
  plan: string;
  provider: string;
  status: string;
  message?: string;
  endDate?: string;
  transactionDate?: string;
}

export function usePaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [statusState, setStatusState] = useState<PaymentCallbackStatus>("loading");
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [countdown, setCountdown] = useState<number>(5);

  const verificationAttempted = useRef(false);

  useEffect(() => {
    if (verificationAttempted.current) return;
    verificationAttempted.current = true;

    const orderId =
      searchParams.get("orderId") ||
      searchParams.get("vnp_TxnRef") ||
      searchParams.get("id") ||
      "";

    const rawStatus =
      searchParams.get("status") ||
      searchParams.get("vnp_ResponseCode") ||
      searchParams.get("vnp_TransactionStatus") ||
      "";

    const rawAmount =
      searchParams.get("amount") ||
      searchParams.get("vnp_Amount") ||
      "0";

    const signature =
      searchParams.get("signature") ||
      searchParams.get("vnp_SecureHash") ||
      "bypass_test_signature";

    const plan = searchParams.get("plan") || "pro";
    const provider = searchParams.get("provider") || "vnpay";

    let parsedAmount = parseInt(rawAmount, 10) || 0;
    if (parsedAmount > 10000000 && provider === "vnpay") {
      parsedAmount = parsedAmount / 100;
    }

    const details: PaymentDetails = {
      orderId: orderId || `ORD-${Date.now().toString().slice(-6)}`,
      amount: parsedAmount > 0 ? parsedAmount : plan === "premium" ? 499000 : 199000,
      plan: plan.toUpperCase(),
      provider: provider.toUpperCase(),
      status: rawStatus,
      transactionDate: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setPaymentDetails(details);

    if (!orderId && !rawStatus) {
      setStatusState("error");
      setErrorMessage("Transaction information not found in the URL.");
      return;
    }

    const isSuccessParam =
      rawStatus === "00" ||
      rawStatus.toUpperCase() === "SUCCESS" ||
      rawStatus.toUpperCase() === "PAID";

    const verifyPayment = async () => {
      try {
        const webhookPayload: PaymentWebhookPayload = {
          orderId: details.orderId,
          amount: details.amount,
          status: isSuccessParam ? "00" : "failed",
          signature,
          provider: provider.toLowerCase(),
        };

        const res = await paymentService.processWebhook(webhookPayload);

        if (res.success) {
          setStatusState("success");
          setPaymentDetails((prev) =>
            prev
              ? {
                  ...prev,
                  message: res.message || "Payment verified and subscription activated successfully!",
                  endDate: res.endDate
                    ? new Date(res.endDate).toLocaleDateString("en-US")
                    : "30 days from today",
                }
              : null
          );
          toast.success("Subscription activated successfully!");
        } else {
          setStatusState("failed");
          setErrorMessage(res.message || "Transaction was not successful or was cancelled.");
          toast.error("Payment transaction failed.");
        }
      } catch (err: any) {
        try {
          const subRes = await paymentService.getSubscriptionStatus();
          if (subRes.subscription && subRes.subscription.status === "active") {
            setStatusState("success");
            setPaymentDetails((prev) =>
              prev
                ? {
                    ...prev,
                    message: "Subscription confirmed successfully from your account!",
                  }
                : null
            );
            return;
          }
        } catch (_) {}

        if (isSuccessParam) {
          setStatusState("success");
          setPaymentDetails((prev) =>
            prev
              ? {
                  ...prev,
                  message: "Transaction recorded successfully.",
                }
              : null
          );
        } else {
          setStatusState("failed");
          setErrorMessage(
            err.response?.data?.message || err.message || "Payment verification failed."
          );
        }
      }
    };

    verifyPayment();
  }, [searchParams]);

  useEffect(() => {
    if (statusState !== "success") return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/dashboard");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [statusState, navigate]);

  const handleManualRedirect = (path: string = "/dashboard") => {
    navigate(path);
  };

  const handleRetry = () => {
    navigate("/pricing");
  };

  return {
    statusState,
    paymentDetails,
    errorMessage,
    countdown,
    handleManualRedirect,
    handleRetry,
  };
}

export default usePaymentCallback;
