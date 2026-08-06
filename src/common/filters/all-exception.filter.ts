import {
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  Injectable,
} from "@nestjs/common";
import type { Response } from "express";

/**
 * 모든 예외를 한 곳에서 HTTP 응답으로 변환한다.
 * - HttpException(BadRequestException 등)이면 그 상태코드/메시지 그대로
 * - 그 외 에러면 500
 * 덕분에 컨트롤러/서비스는 그냥 throw만 하면 된다.
 */
@Injectable()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    let status: number;
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      response.status(status).json(exception.getResponse());
    } else if (exception instanceof Error) {
      status = 500;
      response.status(status).json({ message: exception.message });
    } else {
      status = 500;
      response.status(status).json({ message: "Internal server error" });
    }
    if (status >= 500) {
      console.error(exception);
    }
  }
}
