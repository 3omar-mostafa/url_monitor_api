import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';
import { ReturnUserDto } from '../models/dto/user/returnUserDto';

@Injectable()
export class UserResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    return handler.handle().pipe(
      map((data: any) => {
        return plainToInstance(ReturnUserDto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
