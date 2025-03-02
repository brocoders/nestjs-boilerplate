import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ErrorTypeMessage } from '../types/message.type';

@Injectable()
export class ErrorMessageInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((response: any) => {
        // Check if the response is an error response
        if (
          response?.statusCode &&
          !response?.message &&
          ErrorTypeMessage.getMessageByStatus(response.statusCode)
        ) {
          response.message = ErrorTypeMessage.getMessageByStatus(
            response.statusCode,
          );
        }
        return response;
      }),
    );
  }
}
