import React from "react";
import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";
import usePaymentCallback from "../hooks/usePaymentCallback";
import PaymentLoadingCard from "../components/payment/PaymentLoadingCard";
import PaymentSuccessCard from "../components/payment/PaymentSuccessCard";
import PaymentFailedCard from "../components/payment/PaymentFailedCard";

export const PaymentCallbackPage: React.FC = () => {
  const {
    statusState,
    paymentDetails,
    errorMessage,
    countdown,
    handleManualRedirect,
    handleRetry,
  } = usePaymentCallback();

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white overflow-x-hidden">
    
      <Navbar />

     
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        {statusState === "loading" && <PaymentLoadingCard />}

        {statusState === "success" && (
          <PaymentSuccessCard
            details={paymentDetails}
            countdown={countdown}
            onNavigate={handleManualRedirect}
          />
        )}

        {(statusState === "failed" || statusState === "error") && (
          <PaymentFailedCard
            details={paymentDetails}
            errorMessage={errorMessage}
            onRetry={handleRetry}
            onNavigate={handleManualRedirect}
          />
        )}
      </main>

     
      <Footer />
    </div>
  );
};

export default PaymentCallbackPage;
