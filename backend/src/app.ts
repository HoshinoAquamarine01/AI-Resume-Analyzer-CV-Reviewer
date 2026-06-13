// Express app setup (exported). Server bootstrap lives in src/server.ts
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import router from "./routes";
import { setupSwagger } from "./docs/swagger";

dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));

// Register API routes
app.use("/api", router);

// Register Swagger UI documentation
setupSwagger(app);

export default app;
