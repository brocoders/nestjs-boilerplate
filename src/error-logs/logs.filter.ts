import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions';
import { LogService } from './logs.service';

@Catch()
export class LogsFilter implements ExceptionFilter {
  constructor(private readonly errorLoggerService: LogService) {}

  async catch(exception: any, host: ArgumentsHost) {
    if (exception) {
      // Exception occurred, log it
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      const request = ctx.getRequest();
      const message = (exception instanceof HttpException ? exception.getResponse() : 'Internal Server Error') as JSON;
      const stack = exception.stack;
      const path = request.url;
      const requestBody = request.body;
      const method = request.method;
      
      // Send the response based on the original exception status
      const status = exception instanceof HttpException ? exception.getStatus() : 500;
    
      this.errorLoggerService.logError(path, message, stack, method, status, requestBody);

      if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
        response.status(status).json({
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
          message: 'Internal Server Error',
        }); 
      } else {
        // For non-500 status codes, maintain the original response status
        response.status(status).json(exception.getResponse());
      }
    } 
  }
}
