import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../models/User';

export const GetCurrentUser = createParamDecorator((data, context: ExecutionContext): User => {
  const request = context.switchToHttp().getRequest();
  return request.user;
});
