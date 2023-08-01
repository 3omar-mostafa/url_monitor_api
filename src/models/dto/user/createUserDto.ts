import { User } from '../../User';
import { PickType } from '@nestjs/mapped-types';

export class CreateUserDto extends PickType(User, ['firstName', 'lastName', 'email', 'password']) {}
