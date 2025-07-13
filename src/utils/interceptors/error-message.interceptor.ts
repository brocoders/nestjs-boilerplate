import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TypeMessage } from '../types/message.type';

@Injectable()
export class ErrorMessageInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((response: any) => {
        // Check if the response is an error response
        if (
          response?.statusCode &&
          !response?.message &&
          TypeMessage.getMessageByStatus(response.statusCode)
        ) {
          response.message = TypeMessage.getMessageByStatus(
            response.statusCode,
          );
        }
        return response;
      }),
    );
  }
}
