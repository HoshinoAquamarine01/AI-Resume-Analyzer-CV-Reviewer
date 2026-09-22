# ResumeIQ-AI

ResumeIQ-AI là một ứng dụng phân tích CV/resume dùng AI, tập trung vào việc chấm điểm hồ sơ, gợi ý tối ưu ATS, tạo cover letter và hỗ trợ luyện phỏng vấn. Repository này đang được tổ chức theo mô hình monorepo gồm `backend/` và `frontend/`.

## Tính năng chính

- Tải lên và xử lý resume từ file PDF.
- Phân tích resume bằng AI và trả về nhận xét/tối ưu hóa.
- Hỗ trợ tối ưu ATS và so khớp với job description.
- Tạo cover letter theo ngữ cảnh công việc.
- Sinh câu hỏi phỏng vấn và hỗ trợ luyện tập.
- Xác thực người dùng, phân quyền, quản trị và theo dõi hoạt động.
- Hỗ trợ lưu trữ file upload, báo cáo và các tác vụ nền.

## Công nghệ

- Backend: Node.js, Express, TypeScript, MongoDB, Mongoose.
- Bảo mật: `helmet`, `cors`, `jsonwebtoken`, `bcrypt`.
- Upload và xử lý file: `multer`, `pdf-parse`.
- Tích hợp AI và các dịch vụ bên ngoài thông qua lớp service riêng.

## Cấu trúc dự án

```text
backend/
	src/
		config/        # Kết nối DB, AI, Cloudinary, JWT
		controllers/   # Xử lý request/response
		jobs/          # Các tác vụ nền
		middlewares/   # Auth, validation, rate limit, security
		models/        # Schema MongoDB
		prompts/       # Prompt cho AI
		routes/        # Khai báo API routes
		services/      # Logic nghiệp vụ
		utils/         # Hàm tiện ích
		validators/    # Validate input
frontend/
	components/
	src/
shared/
	constants/
	types/
```

## Yêu cầu môi trường

- Node.js 18+.
- MongoDB connection string.
- Các biến môi trường cần thiết cho AI, JWT, Cloudinary và frontend URL nếu dự án của bạn đang dùng các tích hợp này.

## Cài đặt

Từ thư mục gốc:

```bash
npm install
```

Nếu bạn chạy riêng backend:

```bash
cd backend
npm install
```

## Biến môi trường

Tạo file `.env` ở thư mục gốc với các biến tối thiểu sau:

```env
PORT=5000
MONGO_URL=your_mongodb_connection_string
FRONTEND_URL=http://localhost:5173
```

Tùy vào phần AI, upload và auth trong backend, bạn có thể cần thêm các biến khác như API key, JWT secret hoặc thông tin Cloudinary.

## Chạy ứng dụng

Backend ở chế độ dev:

```bash
cd backend
npm run dev
```

Build backend:

```bash
cd backend
npm run build
```

Chạy bản build:

```bash
cd backend
npm start
```

## Scripts

### Root

- `npm run dev`: thông báo rằng backend và frontend nên chạy riêng.

### Backend

- `npm run dev`: chạy server với `nodemon` + `ts-node`.
- `npm run build`: biên dịch TypeScript.
- `npm start`: chạy file build trong `dist/`.

## Ghi chú

- Server backend khởi động sau khi kết nối MongoDB thành công.
- CORS đang cho phép origin từ `FRONTEND_URL` hoặc mặc định là `http://localhost:5173`.
- Route index hiện đang là placeholder, nên nếu bạn muốn public API đầy đủ thì nên kiểm tra thêm các file `routes/` và `controllers/`.


