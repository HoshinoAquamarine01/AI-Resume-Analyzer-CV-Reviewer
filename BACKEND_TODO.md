# Backend Code Logic Tasks - AI Resume Analyzer

Tài liệu này tập trung **duy nhất vào các phần SỬA LOGIC CODE, VIẾT THÊM FUNCTION/SERVICE & XỬ LÝ DỮ LIỆU** trong Backend (NestJS). Các bước cấu hình biến môi trường (`.env`) hay lấy API Key đã được tách riêng.

---

## 🎯 Danh sách Logic Code cần sửa/viết mới (Sắp xếp theo ưu tiên)

### 🔴 MỨC ĐỘ P0: Logic cốt lõi (Bắt buộc để ứng dụng chạy đúng nghiệp vụ)

#### 1. 📄 Logic Trích xuất văn bản từ File Upload (`PDF/DOCX Parser`)
* **Tệp liên quan:** [`resume.service.ts`](file:///d:/AI%20resume%20analyze/backend/src/modules/resume/resume.service.ts), [`resume.controller.ts`](file:///d:/AI%20resume%20analyze/backend/src/modules/resume/resume.controller.ts)
* **Vấn đề hiện tại:** Trường `extractedText` đang gán cứng chuỗi `"Sample extracted text from resume."`.
* **Logic cần sửa/viết mới:**
  * Thêm logic đọc file từ đường dẫn lưu trữ `uploads/resumes/` sau khi Multer upload.
  * Tích hợp `pdf-parse` cho file PDF và `mammoth` cho file DOCX để trích xuất văn bản thực tế.
  * Cập nhật văn bản trích xuất vào MongoDB để truyền vào làm ngữ cảnh cho AI.

#### 2. 🧩 Logic Parse kết quả Câu hỏi phỏng vấn AI (`Interview Session AI Matching`)
* **Tệp liên quan:** [`interview.service.ts`](file:///d:/AI%20resume%20analyze/backend/src/modules/interview/interview.service.ts)
* **Vấn đề hiện tại:** `aiService.generateInterviewQuestions` trả về Object `{ questions: [...], generalTips: [...] }`, nhưng trong `interview.service.ts` đang kiểm tra `Array.isArray(result)` dẫn đến rơi vào câu hỏi mặc định (fallback).
* **Logic cần sửa:**
  * Sửa lại logic đọc dữ liệu từ Object kết quả của `aiService`.
  * Trích xuất mảng `questions` (lấy nội dung câu hỏi) và `generalTips` để lưu đúng cấu trúc vào `InterviewSession`.

---

### 🟠 MỨC ĐỘ P1: Logic nghiệp vụ & Xuất dữ liệu

#### 3. 🖨️ Logic Tạo & Xuất File PDF / DOCX chuyên nghiệp (`Document Generator`)
* **Tệp liên quan:** [`resume.service.ts`](file:///d:/AI%20resume%20analyze/backend/src/modules/resume/resume.service.ts), [`cover-letter.service.ts`](file:///d:/AI%20resume%20analyze/backend/src/modules/cover-letter/cover-letter.service.ts)
* **Vấn đề hiện tại:** Các hàm `generatePdf` và `generateDocx` mới chỉ gọi `Buffer.from(content)` (trả về Buffer văn bản thô, không có layout).
* **Logic cần sửa/viết mới:**
  * Viết helper generator (dùng `pdfkit` / `puppeteer` cho PDF và `docx` cho Word).
  * Định dạng bố cục trang (Header, tiêu đề, khoảng cách, font chữ, bullet points) trước khi render thành Buffer để người dùng tải xuống CV / Cover Letter chuẩn giao diện.

#### 4. 📧 Logic Xử lý Transport Gửi Email (`Email Service Handler`)
* **Tệp liên quan:** [`email.service.ts`](file:///d:/AI%20resume%20analyze/backend/src/services/email.service.ts)
* **Vấn đề hiện tại:** Hàm `sendEmail` chỉ `console.log`.
* **Logic cần sửa:**
  * Viết logic tạo Transport (sử dụng `nodemailer` hoặc `resend`).
  * Xử lý định dạng template email HTML (Xác thực tài khoản, Quên mật khẩu, Email nhắc nhở tự động từ Cron Job).

---

### 🟡 MỨC ĐỘ P2: Logic Nhật ký & Hạ tầng

#### 5. 📜 Logic Ghi vết & Truy vấn Nhật ký hoạt động (`User Activity Tracker`)
* **Tệp liên quan:** [`user.service.ts`](file:///d:/AI%20resume%20analyze/backend/src/modules/user/user.service.ts), tạo mới [`ActivityLog.ts`](file:///d:/AI%20resume%20analyze/backend/src/models/ActivityLog.ts)
* **Vấn đề hiện tại:** `getActivityLog` đang trả về `{ activity: [] }` giả lập.
* **Logic cần sửa/viết mới:**
  * Tạo Schema MongoDB `ActivityLog` (`userId`, `action`, `details`, `ipAddress`, `createdAt`).
  * Viết Interceptor hoặc Service method tự động tạo bản ghi nhật ký khi người dùng Đăng nhập, Upload CV, Chạy AI phân tích, Luyện phỏng vấn.
  * Viết logic phân trang cho hàm `getActivityLog`.

#### 6. 🧹 Logic Xóa dọn dẹp dữ liệu liên quan khi xóa tài khoản (`Cascade Delete User Account`)
* **Tệp liên quan:** [`user.service.ts`](file:///d:/AI%20resume%20analyze/backend/src/modules/user/user.service.ts)
* **Vấn đề hiện tại:** Hàm `deleteAccount` chỉ xóa record `User` trong DB, để lại các file CV và dữ liệu mồ côi.
* **Logic cần sửa:**
  * Xóa các tài liệu liên quan trong DB: `Resume`, `CoverLetter`, `InterviewSession`, `ResumeAnalysis`.
  * Xóa các file vật lý đã upload tương ứng của người dùng trong thư mục `uploads/resumes/`.

#### 7. ⚡ Logic Redis Wrapper & Fallback (`Redis Driver Wrapper`)
* **Tệp liên quan:** [`db.ts`](file:///d:/AI%20resume%20analyze/backend/src/config/db.ts)
* **Vấn đề hiện tại:** `MockRedis` dùng `Map` trong RAM Node.js.
* **Logic cần sửa:** Chuyển sang dùng `ioredis` với logic Catch Exception an toàn (nếu mất kết nối Redis thì ứng dụng vẫn tự fallback ghi log thay vì gây crash toàn hệ thống).

---

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
