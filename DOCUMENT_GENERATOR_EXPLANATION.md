# Tài liệu Giải thích Chi tiết: Helper Generator Xuất File PDF & Word (DOCX)

Tài liệu này giải thích chi tiết các thay đổi code, cấu trúc helper và tích hợp logic đã thực hiện cho nhiệm vụ **Tạo & Xuất File PDF / DOCX chuyên nghiệp (`Document Generator`)** trong Backend (NestJS).

---

## 1. 📦 Installed Dependencies

Dependencies added to `backend/package.json`:
- **`pdfkit` & `@types/pdfkit`**: Node.js library for drawing PDF page layouts in memory, producing Buffer payloads directly without requiring a headless browser (lightweight, fast, and resource-friendly).
- **`docx`**: Open-source library to construct and package Microsoft Word (`.docx`) documents using standard objects (`Document`, `Paragraph`, `TextRun`, `HeadingLevel`, `Packer`).

---

## 2. 🛠️ Module Helper Mới: `DocumentGeneratorHelper`
**Đường dẫn file:** [`backend/src/common/helpers/document-generator.helper.ts`](file:///d:/AI%20resume%20analyze/backend/src/common/helpers/document-generator.helper.ts)

Helper class chứa 3 phương thức tĩnh (static methods) cốt lõi:

### 📄 `parseTextToDocumentData(rawText: string, fallbackTitle?: string): DocumentData`
- **Mục đích**: Tự động chuyển đổi chuỗi văn bản thô hoặc định dạng Markdown (do AI sinh ra hoặc từ file trích xuất) thành cấu trúc dữ liệu `DocumentData` chuẩn bao gồm `title`, `subtitle`, `summary`, và danh sách các section (`DocumentSection[]`).
- **Xử lý thông minh**:
  - Nhận diện dòng đầu tiên làm **Tiêu đề chính / Họ tên**.
  - Nhận diện các dòng chứa Email, SĐT, Link LinkedIn làm **Thông tin liên hệ (Subtitle)**.
  - Nhận diện tiêu đề các mục qua ký tự `#`, `##` hoặc định dạng dạng `KHOẢNG CÁCH:`.
  - Nhận diện gạch đầu dòng (`- `, `* `, `• `, `1. `) và gom nhóm thành danh sách `bullets[]`.

### 🔴 `generatePdfBuffer(input: DocumentData | string): Promise<Buffer>`
- **Mục đích**: Tạo Buffer file PDF có bố cục giao diện cao cấp bằng `PDFKit`.
- **Chi tiết Định dạng Bố cục**:
  - **Trang & Lề**: Kích thước A4, lề trang (margins) 40pt (~1.4cm).
  - **Phối màu**:
    - Header & Tiêu đề mục: Xanh Navy đậm (`#1E3A8A`).
    - Đường kẻ phân cách: Xanh Royal Blue (`#3B82F6`) kẻ ngang chiều rộng trang.
    - Văn bản chính: Xám than đen (`#1F2937`).
    - Thông tin phụ & Footer: Xám Slate (`#4B5563`).
  - **Căn chỉnh Font chữ**: Font `Helvetica-Bold` cho tiêu đề (20pt) và mục chính (12pt UPPERCASE); `Helvetica` cho văn bản thường (9.5pt); `Helvetica-Oblique` cho mô tả tóm tắt.
  - **Bullet Points**: Thụt lề tự động (indent 10pt), chèn dấu chấm tròn `• ` với khoảng cách dòng hợp lý.
  - **Tự động ngắt trang**: Kiểm tra tọa độ `doc.y > 750` để chủ động sang trang mới (`doc.addPage()`), tránh đè chữ.
  - **Footer Đánh số trang**: Tự động duyệt qua toàn bộ các trang đã buffer và vẽ đường kẻ footer cùng dòng chữ `AI Resume Analyzer - Page X of Y` ở đáy trang.

### 🔵 `generateDocxBuffer(input: DocumentData | string): Promise<Buffer>`
- **Mục đích**: Tạo Buffer file `.docx` tương thích hoàn toàn với Microsoft Word & Google Docs.
- **Chi tiết Định dạng Bố cục**:
  - **Lề trang**: Standard 1 inch (1440 dxa).
  - **Tiêu đề**: `HeadingLevel.HEADING_1` cho Tên/Tiêu đề chính; `HeadingLevel.HEADING_2` cho Tiêu đề mục kết hợp đường viền bên dưới (`BorderStyle.SINGLE` màu `#3B82F6`).
  - **Bullet Points**: Sử dụng thuộc tính `bullet: { level: 0 }` chuẩn định dạng danh sách của Word.
  - **Packer**: Đóng gói tài liệu thành `Buffer` bằng `await Packer.toBuffer(doc)`.

---

## 3. 🔄 Tích hợp vào Resume & Cover Letter Services

### 📄 `ResumeService`
**Đường dẫn file:** [`backend/src/modules/resume/resume.service.ts`](file:///d:/AI%20resume%20analyze/backend/src/modules/resume/resume.service.ts)
- Bổ sung hàm private `buildResumeDocumentData(input: any, defaultTitle: string)`:
  - Nếu đầu vào là Object `Resume`, tự động trích xuất các mảng trường thông tin `skills`, `experience`, `education`, `projects`, `certifications`, `languages` và chuyển thành các mục có bullet points chuyên nghiệp.
  - Nếu đầu vào là chuỗi `extractedText`, gọi `DocumentGeneratorHelper.parseTextToDocumentData`.
- Cập nhật 3 hàm public:
  - `generatePdf(input?: any, title?: string): Promise<Buffer>`
  - `generatePDF(input?: any, title?: string): Promise<Buffer>` (Alias)
  - `generateDocx(input?: any, title?: string): Promise<Buffer>`

### ✉️ `CoverLetterService`
**Đường dẫn file:** [`backend/src/modules/cover-letter/cover-letter.service.ts`](file:///d:/AI%20resume%20analyze/backend/src/modules/cover-letter/cover-letter.service.ts)
- Bổ sung hàm private `buildCoverLetterDocumentData(input: any, defaultTitle: string)`:
  - Tự động lấy `jobTitle` và `companyName` làm tiêu đề/phụ đề thư xin việc (`Cover Letter - Frontend Developer`, `Application for Google`).
- Cập nhật 2 hàm public:
  - `generatePdf(input: any, title?: string): Promise<Buffer>`
  - `generateDocx(input: any, title?: string): Promise<Buffer>`

---

## 4. 🌐 Cập nhật Controllers & Output Headers

### 📄 `ResumeController`
**Đường dẫn file:** [`backend/src/modules/resume/resume.controller.ts`](file:///d:/AI%20resume%20analyze/backend/src/modules/resume/resume.controller.ts)
- **`GET /api/resume/:resumeId/download`**:
  - Truyền toàn bộ object `Resume` cho `generatePdf`.
  - Thiết lập Header:
    - `Content-Type: application/pdf`
    - `Content-Disposition: attachment; filename="<Title>.pdf"`
- **`GET /api/resume/:resumeId/export?format=pdf|docx|json`**:
  - Hỗ trợ xuất định dạng mong muốn (`pdf` hoặc `docx`), tự động đặt `Content-Type` chuẩn MIME type tương ứng của Word và PDF.

### ✉️ `CoverLetterController`
**Đường dẫn file:** [`backend/src/modules/cover-letter/cover-letter.controller.ts`](file:///d:/AI%20resume%20analyze/backend/src/modules/cover-letter/cover-letter.controller.ts)
- **`GET /api/cover-letter/:coverLetterId/download`**: Trả về file PDF của Cover Letter.
- **`GET /api/cover-letter/:coverLetterId/export?format=pdf|docx`**: Cho phép người dùng chọn tải xuống bản PDF hoặc Word (`.docx`).

---

## 5. 🧪 Kiểm thử & Xác minh (Verification)

1. **Kiểm thử Sinh Buffer Thực tế**:
   - Đã chạy thử nghiệm sinh file qua script node:
     - **PDF Buffer**: Dung lượng `2,268 bytes`, mã hóa đầu file chuẩn `%PDF`.
     - **DOCX Buffer**: Dung lượng `8,698 bytes`, mã hóa đầu file chuẩn ZIP `504b` (`PK`).
2. **Kiểm thử Biên dịch NestJS (Build)**:
   - Đã chạy `npm run build` thành công **100% không có lỗi TypeScript**.

---
*Tài liệu này được tạo tự động bởi Antigravity AI Assistant.*
