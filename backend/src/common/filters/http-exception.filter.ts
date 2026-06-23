import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from "@nestjs/common";
import { Response } from "express";
import { formatResponse } from "../../utils/formatResponse";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message = exception.message;
    if (typeof exceptionResponse === "object" && exceptionResponse !== null) {
      message = (exceptionResponse as any).message || message;
      if (Array.isArray(message)) {
        message = message.join(", ");
      }
    }

    response
      .status(status)
      .json(formatResponse(null, message, "error"));
  }
}
