import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { ClassTransformOptions } from 'class-transformer/types/interfaces';

@Injectable()
export class ResponseTransformInterceptor implements NestInterceptor {
  constructor(
    private Model: ClassConstructor<any>,
    private options: ClassTransformOptions = {
      excludeExtraneousValues: true,
    },
  ) {}

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    return handler.handle().pipe(
      map((data: any) => {
        if (typeof data?.toJSON === 'function') {
          data = data.toJSON();
        }
        return plainToInstance(this.Model, data, this.options);
      }),
    );
  }
}
