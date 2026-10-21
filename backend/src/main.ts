import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import helmet from "helmet";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api");

  app.use(helmet({ contentSecurityPolicy: false }));

  const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
  ].filter(Boolean) as string[];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  });

  app.use((req: any, res: any, next: any) => {
    const rawCookies = req.headers.cookie || "";
    const cookies: Record<string, string> = {};
    rawCookies.split(";").forEach((cookie: string) => {
      const parts = cookie.split("=");
      if (parts[0] && parts[1]) {
        cookies[parts[0].trim()] = parts[1].trim();
      }
    });
    req.cookies = cookies;
    next();
  });

  const sanitize = (input: any): any => {
    if (typeof input === "string") {
      return input
        .replace(/[<>"']/g, (match) => {
          const map: Record<string, string> = {
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
          };
          return map[match];
        })
        .trim();
    }
    if (typeof input === "object" && input !== null) {
      Object.keys(input).forEach((key) => {
        input[key] = sanitize(input[key]);
      });
    }
    return input;
  };

  app.use((req: any, res: any, next: any) => {
    if (req.body) req.body = sanitize(req.body);
    if (req.query) req.query = sanitize(req.query);
    next();
  });

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    })
  );

  const config = new DocumentBuilder()
    .setTitle("ResumeIQ-AI API")
    .setDescription("The ResumeIQ-AI application backend API documentation")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const swaggerDoc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, swaggerDoc);
  SwaggerModule.setup("docs", app, swaggerDoc);

  const PORT = process.env.PORT || 5000;
  await app.listen(PORT);
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger documentation is available at http://localhost:${PORT}/docs`);
}
bootstrap();
