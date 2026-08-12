# Backend Code Logic Tasks - AI Resume Analyzer

Tài liệu này tập trung **duy nhất vào các phần SỬA LOGIC CODE, VIẾT THÊM FUNCTION/SERVICE & XỬ LÝ DỮ LIỆU** trong Backend (NestJS). Các bước cấu hình biến môi trường (`.env`) hay lấy API Key đã được tách riêng.

---

## 🎯 Danh sách Logic Code cần sửa/viết mới (Sắp xếp theo ưu tiên)

🔴 MỨC ĐỘ P0: Logic cốt lõi (Cực kỳ quan trọng để app chạy đúng)
📄 Logic đọc file CV thực tế (PDF/DOCX Parser):
Tệp: 

resume.service.ts
Hiện trạng: Đang gán cứng chuỗi giả lập "Sample extracted text from resume.".
Cần làm: Dùng pdf-parse (PDF) và mammoth (DOCX) để bóc tách văn bản thực từ file người dùng upload trong uploads/resumes/.
🧩 Logic xử lý kết quả Phỏng vấn AI (Interview AI Parsing):
Tệp: 

interview.service.ts
Cần làm: Sửa logic nhận Object { questions, generalTips } từ AI thay vì check kiểu Array.isArray làm rơi vào dữ liệu mặc định (fallback).
🟠 MỨC ĐỘ P1: Logic nghiệp vụ & Xuất dữ liệu
🖨️ Logic xuất file PDF / DOCX chuyên nghiệp (Document Generator):
Tệp: 

resume.service.ts
, 

cover-letter.service.ts
Cần làm: Định dạng layout đẹp mắt (tiêu đề, font, căn lề) trước khi xuất Buffer tải về thay vì xuất file text thô.
📧 Logic Gửi Email thực tế (Email Service):
Tệp: 

email.service.ts
Cần làm: Tích hợp nodemailer hoặc resend để gửi email kích hoạt tài khoản, OTP quên mật khẩu.
🟡 MỨC ĐỘ P2: Nhật ký & Hạ tầng
📜 Ghi nhận vết hoạt động (User Activity Tracker):
Tệp: Tạo schema 

ActivityLog.ts
 & sửa 

user.service.ts
Cần làm: Lưu lịch sử Đăng nhập, Upload CV, Phân tích AI và viết API phân trang trả về cho màn hình Activity Log.
🧹 Logic Xóa sạch dữ liệu liên quan (Cascade Delete User Account):
Tệp: 

user.service.ts
Cần làm: Khi người dùng xóa tài khoản, tự động xóa tất cả Resume, CoverLetter, InterviewSession trong DB + xóa file CV vật lý trong ổ đĩa.
⚡ Redis Wrapper & Fallback (Redis Driver):
Tệp: 

db.ts
Cần làm: Kết nối ioredis thật và thêm cơ chế an toàn (nếu mất kết nối Redis app không bị crash).

### 🔵 MỨC ĐỘ P3: Logic Thanh toán & Kiểm thử

#### 8. 💳 Logic Xử lý Thanh toán & Webhook Callback (`Payment & Webhook Controller`)
* **Tệp liên quan:** Tạo mới module `Payment` (`payment.controller.ts`, `payment.service.ts`)
* **Logic cần viết mới:**
  * Logic tạo URL giao dịch thanh toán (cho VNPay / PayOS / Stripe).
  * Endpoint `POST /api/payment/webhook` xử lý chữ ký checksum (signature verification), cập nhật trạng thái gói `Subscription` từ `pending` ➔ `active` và tự động tính lại ngày hết hạn `endDate`.

#### 9. 🧪 Logic Test Cases Tự động (Unit & Integration Tests)
* **Tệp liên quan:** `backend/src/**/*.spec.ts`
* **Logic cần viết:**
  * Viết Unit Tests cho các Service logic chính: `AuthService` (băm password, verify token), `ResumeService` (CRUD, parse text), `AiService` (clean & parse JSON AI).
