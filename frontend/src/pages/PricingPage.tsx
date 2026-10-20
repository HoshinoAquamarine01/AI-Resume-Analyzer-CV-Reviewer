import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Check,
  Clock,
  ShieldCheck,
  ArrowLeft,
  QrCode,
  AlertCircle,
  Loader2,
  CheckCircle2,
  HelpCircle,
  Zap,
  Star,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";
import paymentService from "../services/paymentService";
import QrPaymentModal, { QrPaymentData } from "../components/payment/QrPaymentModal";

export const PricingPage: React.FC = () => {
  const navigate = useNavigate();

  const [currentPlan, setCurrentPlan] = useState<string>("free");
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>("active");
  const [pendingPayment, setPendingPayment] = useState<any>(null);
  const [loadingPending, setLoadingPending] = useState<boolean>(true);

  const [qrModalData, setQrModalData] = useState<QrPaymentData | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState<boolean>(false);
  const [actionLoadingPlan, setActionLoadingPlan] = useState<string | null>(null);

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  const loadUserData = async () => {
    if (!token) {
      setLoadingPending(false);
      return;
    }

    try {
      setLoadingPending(true);
      const [subRes, pendingRes] = await Promise.allSettled([
        paymentService.getSubscriptionStatus(),
        paymentService.getPendingPayment(),
      ]);

      if (subRes.status === "fulfilled" && subRes.value) {
        const subData = subRes.value.data || subRes.value;
        if (subData) {
          setCurrentPlan(subData.plan || "free");
          setSubscriptionStatus(subData.status || "active");
        }
      }

      if (pendingRes.status === "fulfilled" && pendingRes.value) {
        const pData = pendingRes.value.data || pendingRes.value;
        if (pData?.hasPending && pData.pendingPayment) {
          setPendingPayment(pData.pendingPayment);
        } else {
          setPendingPayment(null);
        }
      }
    } catch (err) {
      console.error("Failed to load user subscription/pending payment:", err);
    } finally {
      setLoadingPending(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const handleSelectPlan = async (plan: "pro" | "premium") => {
    if (!token) {
      toast.error("Vui lòng đăng nhập để nâng cấp gói tài khoản.");
      navigate("/login?redirect=/pricing");
      return;
    }

    if (currentPlan === plan && subscriptionStatus === "active") {
      toast.success(`Bạn hiện đang sử dụng gói ${plan.toUpperCase()}!`);
      return;
    }

    try {
      setActionLoadingPlan(plan);
      const res = await paymentService.createQrPayment(plan);
      const data = res.data || res;

      setQrModalData({
        orderId: data.orderId,
        plan: data.plan,
        amount: data.amount,
        bankAccount: data.bankAccount,
        transferContent: data.transferContent,
        qrCodeUrl: data.qrCodeUrl,
      });
      setIsQrModalOpen(true);
    } catch (err: any) {
      console.error("Create QR payment error:", err);
      toast.error(err?.response?.data?.message || "Không thể tạo mã QR thanh toán.");
    } finally {
      setActionLoadingPlan(null);
    }
  };

  const handleOpenPendingQr = () => {
    if (!pendingPayment) return;
    setQrModalData({
      orderId: pendingPayment.orderId,
      plan: pendingPayment.plan,
      amount: pendingPayment.amount,
      bankAccount: pendingPayment.bankAccount,
      transferContent: pendingPayment.transferContent,
      qrCodeUrl: pendingPayment.qrCodeUrl,
    });
    setIsQrModalOpen(true);
  };

  const faqs = [
    {
      q: "Quy trình thanh toán qua mã QR và kích hoạt gói như thế nào?",
      a: "Sau khi bạn chọn gói Pro hoặc Premium, hệ thống sẽ tự động tạo một mã VietQR chuẩn ngân hàng chứa đầy đủ thông tin: Số tài khoản, số tiền và nội dung chuyển khoản. Bạn mở bất kỳ App ngân hàng hoặc ví MoMo/ZaloPay nào để quét mã và chuyển tiền. Tiếp theo, bạn nhấn nút 'Tôi đã chuyển khoản'. Quản trị viên (Admin) sẽ kiểm tra đối soát và kích hoạt gói cho bạn trong vòng 2 - 10 phút.",
    },
    {
      q: "Nội dung chuyển khoản có bắt buộc phải giữ nguyên không?",
      a: "Có, đây là yếu tố quan trọng nhất! Nội dung chuyển khoản có dạng 'RESUME XXXXXX' (trong đó XXXXXX là mã giao dịch duy nhất của bạn). Nhờ mã này, Quản trị viên sẽ xác nhận chính xác tài khoản của bạn để kích hoạt ngay lập tức.",
    },
    {
      q: "Tôi có thể hủy gói hoặc thay đổi gói sau này không?",
      a: "Hoàn toàn có thể. Khi hết hạn 30 ngày, nếu bạn không gia hạn thì tài khoản sẽ trở về gói Free mặc định mà không hề phát sinh bất kỳ khoản phí phụ thu nào.",
    },
    {
      q: "Nếu sau 15 phút tài khoản vẫn chưa được duyệt kích hoạt thì làm sao?",
      a: "Đừng lo lắng! Tất cả giao dịch chuyển khoản đều được lưu vết minh bạch trong hệ thống. Bạn có thể liên hệ ngay với đội ngũ hỗ trợ qua Zalo/Hotline hoặc trang Contact để được kích hoạt thủ công chỉ trong 1 phút.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 font-sans selection:bg-blue-500 selection:text-white">
      {/* Top back navigation */}
      <div className="max-w-7xl mx-auto mb-8 flex items-center justify-between">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về Bảng Điều Khiển</span>
        </Link>

        {token && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Gói hiện tại:</span>
            <span
              className={`px-2.5 py-0.5 rounded-full font-bold uppercase ${
                currentPlan === "premium"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  : currentPlan === "pro"
                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                  : "bg-slate-800 text-slate-300 border border-slate-700"
              }`}
            >
              {currentPlan}
            </span>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Pending Banner if user has payment awaiting confirmation */}
        {pendingPayment && (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg shadow-amber-500/5 animate-fade-in">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5 sm:mt-0">
                <Clock className="w-5 h-5 animate-pulse" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Bạn có 1 yêu cầu nâng cấp đang chờ Admin xác nhận</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Chờ duyệt
                  </span>
                </h4>
                <p className="text-xs text-slate-300">
                  Gói <span className="font-bold uppercase text-blue-400">{pendingPayment.plan}</span> •{" "}
                  Mã giao dịch: <span className="font-mono text-white font-semibold">{pendingPayment.orderId}</span> •{" "}
                  Nội dung CK: <span className="font-mono text-amber-300 font-bold">{pendingPayment.transferContent}</span>
                </p>
              </div>
            </div>

            <button
              onClick={handleOpenPendingQr}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 transition-all active:scale-95 shrink-0"
            >
              <QrCode className="w-4 h-4" />
              <span>Xem Lại Mã QR Thanh Toán</span>
            </button>
          </div>
        )}

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Thanh Toán An Toàn & Duyệt Nhanh</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Chọn gói nâng cấp phù hợp với{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
              mục tiêu sự nghiệp
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Thanh toán tiện lợi bằng cách quét mã VietQR qua ứng dụng ngân hàng. Admin đối soát và kích hoạt quyền truy cập AI ngay sau khi chuyển khoản.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {/* Free Plan */}
          <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-8 flex flex-col justify-between hover:border-slate-700 transition-all duration-300 shadow-xl">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white">Miễn Phí (Free)</h3>
                <p className="text-xs text-slate-400 mt-1">Dành cho ứng viên mới bắt đầu tối ưu CV cơ bản.</p>
              </div>

              <div className="flex items-baseline">
                <span className="text-4xl font-extrabold text-white">0 đ</span>
                <span className="text-xs text-slate-500 ml-1.5 font-medium">/ tháng</span>
              </div>

              <div className="h-px bg-slate-800 w-full" />

              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>5 lượt phân tích CV miễn phí</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Điểm số tương thích ATS cơ bản</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Truy cập kho mẫu CV tiêu chuẩn</span>
                </li>
                <li className="flex items-center gap-2.5 text-slate-500">
                  <span className="w-4 h-4 flex items-center justify-center font-bold">✕</span>
                  <span>Không giới hạn phân tích AI</span>
                </li>
                <li className="flex items-center gap-2.5 text-slate-500">
                  <span className="w-4 h-4 flex items-center justify-center font-bold">✕</span>
                  <span>Tạo Cover Letter chuyên sâu</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <button
                disabled={currentPlan === "free"}
                className={`w-full py-3 px-4 rounded-xl font-semibold text-xs transition-all ${
                  currentPlan === "free"
                    ? "bg-slate-800 text-slate-400 cursor-default border border-slate-700/50"
                    : "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                }`}
              >
                {currentPlan === "free" ? "Gói Đang Sử Dụng" : "Bắt Đầu Miễn Phí"}
              </button>
            </div>
          </div>

          {/* Pro Plan (Most Popular) */}
          <div className="relative rounded-3xl bg-gradient-to-b from-blue-950/40 via-slate-900 to-slate-900 border-2 border-blue-500 p-8 flex flex-col justify-between shadow-2xl shadow-blue-500/10 md:-translate-y-2 transition-all duration-300">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 fill-white text-white" />
              <span>Phổ Biến Nhất</span>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>Chuyên Nghiệp (Pro)</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                    AI PRO
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">Lựa chọn tối ưu cho người tìm việc đang ứng tuyển tích cực.</p>
              </div>

              <div className="flex items-baseline">
                <span className="text-4xl font-extrabold text-white">199.000 đ</span>
                <span className="text-xs text-slate-400 ml-1.5 font-medium">/ tháng</span>
              </div>

              <div className="h-px bg-slate-800 w-full" />

              <ul className="space-y-3 text-xs text-slate-200">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-semibold text-white">50 lượt phân tích CV / tháng</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Gợi ý viết lại câu thành tích chuẩn STAR</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Trình tạo Thư ứng tuyển (Cover Letter) AI</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Dự đoán câu hỏi phỏng vấn theo vị trí</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Mở khóa toàn bộ 10+ mẫu CV TopCV & Quốc tế</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <button
                disabled={actionLoadingPlan === "pro" || (currentPlan === "pro" && subscriptionStatus === "active")}
                onClick={() => handleSelectPlan("pro")}
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg ${
                  currentPlan === "pro" && subscriptionStatus === "active"
                    ? "bg-slate-800 text-emerald-400 border border-emerald-500/40 cursor-default"
                    : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30 active:scale-95"
                }`}
              >
                {actionLoadingPlan === "pro" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <QrCode className="w-4 h-4" />
                )}
                <span>
                  {currentPlan === "pro" && subscriptionStatus === "active"
                    ? "Gói Đang Sử Dụng (Active)"
                    : pendingPayment && pendingPayment.plan === "pro"
                    ? "Xem QR Đang Chờ Duyệt"
                    : "Nâng Cấp Pro (Quét Mã QR)"}
                </span>
              </button>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-8 flex flex-col justify-between hover:border-slate-700 transition-all duration-300 shadow-xl">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>Cao Cấp (Premium)</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                    VIP
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">Dành cho chuyên gia, quản lý và tổ chức tuyển dụng.</p>
              </div>

              <div className="flex items-baseline">
                <span className="text-4xl font-extrabold text-white">499.000 đ</span>
                <span className="text-xs text-slate-500 ml-1.5 font-medium">/ tháng</span>
              </div>

              <div className="h-px bg-slate-800 w-full" />

              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-semibold text-white">Phân tích CV Không Giới Hạn</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Ưu tiên hàng đợi AI tốc độ cao</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Mô phỏng phỏng vấn thử Mock Interview AI</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Xuất báo cáo PDF chi tiết không kèm logo</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Hỗ trợ ưu tiên 1-1 từ Quản trị viên</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <button
                disabled={actionLoadingPlan === "premium" || (currentPlan === "premium" && subscriptionStatus === "active")}
                onClick={() => handleSelectPlan("premium")}
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                  currentPlan === "premium" && subscriptionStatus === "active"
                    ? "bg-slate-800 text-purple-400 border border-purple-500/40 cursor-default"
                    : "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-purple-500/50 active:scale-95"
                }`}
              >
                {actionLoadingPlan === "premium" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <QrCode className="w-4 h-4" />
                )}
                <span>
                  {currentPlan === "premium" && subscriptionStatus === "active"
                    ? "Gói Đang Sử Dụng (Active)"
                    : pendingPayment && pendingPayment.plan === "premium"
                    ? "Xem QR Đang Chờ Duyệt"
                    : "Nâng Cấp Premium (Quét Mã QR)"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* How QR Payment Works Section */}
        <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 max-w-5xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-bold text-white flex items-center justify-center gap-2">
              <QrCode className="w-5 h-5 text-blue-400" />
              <span>Quy trình thanh toán quét mã QR & duyệt tự động</span>
            </h3>
            <p className="text-xs text-slate-400">Đơn giản, minh bạch và an toàn tuyệt đối qua hệ thống ngân hàng Việt Nam</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h4 className="text-xs font-bold text-white">Quét mã VietQR</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Hệ thống tạo mã VietQR chuẩn ngân hàng với số tiền và nội dung chuyển khoản được định sẵn.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h4 className="text-xs font-bold text-white">Xác nhận chuyển khoản</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Sau khi chuyển tiền thành công trên App ngân hàng, bạn bấm nút "Tôi đã chuyển khoản" để gửi yêu cầu đến Admin.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h4 className="text-xs font-bold text-white">Admin duyệt & Kích hoạt</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Quản trị viên đối soát giao dịch và phê duyệt trong vòng 2 - 10 phút. Toàn bộ tính năng Pro được mở khóa ngay.
              </p>
            </div>
          </div>
        </div>

        {/* FAQs Section */}
        <div className="max-w-4xl mx-auto space-y-6 pt-4">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-white flex items-center justify-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-400" />
              <span>Câu hỏi thường gặp về thanh toán</span>
            </h3>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left text-xs sm:text-sm font-semibold text-white hover:text-blue-400 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <span className={`transition-transform duration-200 text-slate-400 ${isOpen ? "rotate-180" : ""}`}>
                      ▼
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-800/80 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* QR Code Payment Modal */}
      <QrPaymentModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        data={qrModalData}
        onSuccess={() => {
          loadUserData();
        }}
      />
    </div>
  );
};

export default PricingPage;
