import React, { useState } from "react";
import {
  X,
  QrCode,
  Copy,
  Check,
  Clock,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  ArrowRight,
  Download,
  Loader2,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import paymentService from "../../services/paymentService";

export interface QrPaymentData {
  orderId: string;
  plan: "pro" | "premium";
  amount: number;
  bankAccount: {
    bankId: string;
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  transferContent: string;
  qrCodeUrl: string;
}

interface QrPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: QrPaymentData | null;
  onSuccess?: () => void;
}

export const QrPaymentModal: React.FC<QrPaymentModalProps> = ({
  isOpen,
  onClose,
  data,
  onSuccess,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  if (!isOpen || !data) return null;

  const formatVND = (val: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success(`Đã sao chép ${fieldName}!`);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  const handleConfirmTransfer = async () => {
    try {
      setIsSubmitting(true);
      await paymentService.confirmTransfer(data.orderId);
      setIsConfirmed(true);
      toast.success("Đã ghi nhận! Đang chờ Admin xác nhận giao dịch.");
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error("Confirm transfer error:", err);
      toast.error(
        err?.response?.data?.message || "Không thể gửi xác nhận chuyển khoản."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[95vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Quét Mã QR Thanh Toán</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Gói {data.plan.toUpperCase()}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Chuyển khoản liên ngân hàng & Chờ Admin duyệt kích hoạt
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {!isConfirmed ? (
            <>
              {/* Note bar */}
              <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-blue-200">
                    Hướng dẫn thanh toán nhanh:
                  </p>
                  <p className="text-slate-300 leading-relaxed">
                    1. Mở App ngân hàng bất kỳ (Vietcombank, MB, Techcombank...)
                    hoặc ví MoMo để quét mã QR.
                    <br />
                    2. Kiểm tra đúng số tiền và{" "}
                    <span className="text-amber-300 font-bold">
                      giữ nguyên nội dung chuyển khoản
                    </span>
                    .
                    <br />
                    3. Bấm nút{" "}
                    <span className="text-emerald-400 font-bold">
                      "Tôi đã chuyển khoản"
                    </span>{" "}
                    sau khi hoàn tất.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* QR Code Container */}
                <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-3">
                  <div className="relative p-2.5 bg-white rounded-2xl shadow-xl overflow-hidden group">
                    <img
                      src={data.qrCodeUrl}
                      alt="VietQR Chuyển Khoản"
                      className="w-48 h-48 sm:w-52 sm:h-52 object-contain"
                    />
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-200 flex items-center justify-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>VietQR Chuẩn Quốc Gia Napas 24/7</span>
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Tương thích tất cả ứng dụng ngân hàng
                    </p>
                  </div>
                </div>

                {/* Transfer Info */}
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">
                        Ngân hàng thụ hưởng
                      </span>
                      <span className="text-xs font-semibold text-white">
                        {data.bankAccount.bankName}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">
                        Số tài khoản
                      </span>
                      <span className="text-sm font-mono font-bold text-emerald-400 tracking-wider">
                        {data.bankAccount.accountNumber}
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          data.bankAccount.accountNumber,
                          "Số tài khoản"
                        )
                      }
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 border border-slate-700 transition-colors"
                    >
                      {copiedField === "Số tài khoản" ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {copiedField === "Số tài khoản" ? "Đã chép" : "Chép"}
                      </span>
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">
                        Chủ tài khoản
                      </span>
                      <span className="text-xs font-semibold text-white">
                        {data.bankAccount.accountName}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">
                        Số tiền thanh toán
                      </span>
                      <span className="text-base font-extrabold text-blue-400">
                        {formatVND(data.amount)}
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        copyToClipboard(data.amount.toString(), "Số tiền")
                      }
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 border border-slate-700 transition-colors"
                    >
                      {copiedField === "Số tiền" ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {copiedField === "Số tiền" ? "Đã chép" : "Chép"}
                      </span>
                    </button>
                  </div>

                  {/* Transfer Note with emphasis */}
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-amber-400 block">
                        Nội dung chuyển khoản (Bắt buộc)
                      </span>
                      <span className="text-sm font-mono font-extrabold text-amber-300 tracking-wider">
                        {data.transferContent}
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          data.transferContent,
                          "Nội dung chuyển khoản"
                        )
                      }
                      className="px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-semibold flex items-center gap-1 border border-amber-500/40 transition-colors"
                    >
                      {copiedField === "Nội dung chuyển khoản" ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {copiedField === "Nội dung chuyển khoản"
                          ? "Đã chép"
                          : "Chép"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span>Admin duyệt trong 2 - 10 phút sau khi nhận tiền</span>
                </span>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={onClose}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
                  >
                    Đóng
                  </button>

                  <button
                    disabled={isSubmitting}
                    onClick={handleConfirmTransfer}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    <span>Tôi Đã Chuyển Khoản</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Confirmation Awaiting State */
            <div className="py-8 px-4 flex flex-col items-center justify-center text-center space-y-5 animate-fade-in">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center text-amber-400 shadow-xl shadow-amber-500/10">
                  <Clock className="w-10 h-10 animate-pulse" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 font-bold border-2 border-slate-900">
                  <Check className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-2 max-w-md">
                <h3 className="text-xl font-bold text-white">
                  Đã Gửi Yêu Cầu Thanh Toán Thành Công!
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Hệ thống đã ghi nhận giao dịch của bạn. Quản trị viên đang tiến
                  hành đối soát tài khoản và sẽ kích hoạt gói{" "}
                  <span className="font-bold text-blue-400 uppercase">
                    {data.plan}
                  </span>{" "}
                  cho bạn ngay sau khi nhận được tiền (thường từ 2 - 10 phút).
                </p>
              </div>

              {/* Order Info Card */}
              <div className="w-full max-w-md p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-left space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-500">Mã đơn hàng:</span>
                  <span className="font-mono font-semibold text-slate-200">
                    {data.orderId}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-500">Gói nâng cấp:</span>
                  <span className="font-bold text-blue-400 uppercase">
                    {data.plan}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-500">Số tiền:</span>
                  <span className="font-extrabold text-emerald-400">
                    {formatVND(data.amount)}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Trạng thái:</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-amber-400">
                    <Clock className="w-3.5 h-3.5" />
                    Đang chờ Admin duyệt
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2"
                >
                  <span>Hoàn Tất & Về Bảng Điều Khiển</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QrPaymentModal;
