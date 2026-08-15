# 📝 CHANGELOG - AI Resume Analyzer & Reviewer

All notable changes, new features, and architecture updates implemented in the Backend service are documented below.

---

## 🚀 [Unreleased / Latest Update] - 2026-08-15

### 🌐 1. WebSockets Gateway & Real-Time AI Streaming (Socket.IO)
- **`EventsGateway` (`backend/src/modules/gateway/events.gateway.ts`)**:
  - Implemented `@WebSocketGateway({ cors: { origin: '*' } })` for real-time bidirectional WebSocket communication.
  - **JWT Authentication**: Automatically extracts JWT token from `auth.token`, `query.token`, or `Authorization: Bearer <token>` handshake header.
  - **Private Room Join**: On successful JWT verification, client automatically joins private room `user_<userId>`.
- **Real-Time AI Mock Interview Streaming (`interview:send-answer`)**:
  - Streams AI feedback & next follow-up interview questions chunk-by-chunk in real time using Gemini API (`generateContentStream`).
  - Socket Events Emitted: `interview:stream-start`, `interview:stream-chunk`, `interview:stream-end`.
- **Real-Time Push Notifications (`notification:cv-analysis-complete`)**:
  - Triggered automatically when `AiService.analyzeResume` finishes analyzing a candidate's CV.
  - Emits real-time notification to the user's socket room with analysis score and metadata.
- **`GatewayModule` (`backend/src/modules/gateway/gateway.module.ts`)**:
  - Encapsulated and wired with `AiModule` via `forwardRef`.

---

### ☁️ 2. Cloud File Storage Service (Cloudinary CDN + Local Disk Fallback)
- **`CloudStorageService` (`backend/src/common/services/cloud-storage.service.ts`)**:
  - Tích hợp Cloud Storage nâng cao bằng **Cloudinary CDN**.
  - **Tự động nhận diện môi trường**: Kiểm tra `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
  - **Cloudinary Mode**: Upload file PDF/DOCX/Ảnh trực tiếp lên Cloudinary CDN (`ai-resume-analyzer/resumes` & `ai-resume-analyzer/avatars`), trả về URL HTTPS bảo mật (sẵn sàng 100% cho Docker/Cloud Deployment).
  - **Local Fallback Mode**: Tự động chuyển sang bộ lưu trữ cục bộ `./uploads/` nếu chưa cấu hình biến môi trường Cloudinary.
- **`StorageModule` (`backend/src/common/services/storage.module.ts`)**: `@Global()` module cung cấp `CloudStorageService` cho toàn ứng dụng.
- **Controller Integration**:
  - **`UserController` (`backend/src/modules/user/user.controller.ts`)**: Cập nhật endpoint `/user/avatar` hỗ trợ upload Cloud.
  - **`ResumeController` (`backend/src/modules/resume/resume.controller.ts`)**: Cập nhật endpoint `/resume` hỗ trợ upload Cloud.

---

### 🛡️ 3. API Rate Limiting & Throttling (`@nestjs/throttler`)
- **Global Throttling (`backend/src/app.module.ts`)**:
  - Cấu hình `ThrottlerModule.forRoot([{ ttl: 60000, limit: 60 }])` (Giới hạn mặc định toàn ứng dụng: 60 requests/phút/IP).
  - Đăng ký `ThrottlerGuard` làm `APP_GUARD` toàn cục.
- **AI Endpoint Protection (`backend/src/modules/ai/ai.controller.ts`)**:
  - Áp dụng decorator `@Throttle({ default: { limit: 10, ttl: 60000 } })`.
  - Giới hạn các endpoint gọi AI Gemini (`/ai/analyze`, `/ai/ats-optimize`, `/ai/job-matches`...) ở mức **10 requests/phút/IP** để phòng chống spam, DDoS và bảo vệ API quota (trả về `HTTP 429 Too Many Requests` khi vượt giới hạn).

---

### 📦 4. Core Dependencies & Build Configurations
- **Dependencies Installed**:
  - `@nestjs/websockets`
  - `@nestjs/platform-socket.io`
  - `socket.io`
  - `cloudinary`
- **Configured `package.json`**:
  - Cấu hình `pnpm.onlyBuiltDependencies` bổ sung `@google/genai` và `protobufjs` giúp `pnpm build` diễn ra trơn tru.

---

## 🛠️ Summary of Changed Files

| Action | File Path | Description |
| :--- | :--- | :--- |
| `[NEW]` | `backend/src/modules/gateway/events.gateway.ts` | Socket.IO WebSockets Gateway with JWT Auth & Streaming |
| `[NEW]` | `backend/src/modules/gateway/gateway.module.ts` | WebSockets Gateway Module |
| `[NEW]` | `backend/src/common/services/cloud-storage.service.ts` | Cloudinary CDN Storage with Local Disk Fallback |
| `[NEW]` | `backend/src/common/services/storage.module.ts` | Global Storage Module |
| `[MODIFY]` | `backend/src/app.module.ts` | Registered GatewayModule, StorageModule & ThrottlerModule |
| `[MODIFY]` | `backend/src/modules/ai/ai.service.ts` | Added `streamInterviewFeedback` & CV analysis push notification |
| `[MODIFY]` | `backend/src/modules/ai/ai.controller.ts` | Applied `@Throttle` rate limiting to AI endpoints |
| `[MODIFY]` | `backend/src/modules/ai/ai.module.ts` | Linked with `GatewayModule` via `forwardRef` |
| `[MODIFY]` | `backend/src/modules/user/user.controller.ts` | Integrated `CloudStorageService` for avatars |
| `[MODIFY]` | `backend/src/modules/resume/resume.controller.ts` | Integrated `CloudStorageService` for CVs |
| `[MODIFY]` | `backend/package.json` | Added dependencies & pnpm built dependencies config |
