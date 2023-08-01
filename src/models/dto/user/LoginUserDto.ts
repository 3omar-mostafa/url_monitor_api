import { User } from '../../User';
import { PickType } from '@nestjs/mapped-types';

export class LoginUserDto extends PickType(User, ['email', 'password']) {}
