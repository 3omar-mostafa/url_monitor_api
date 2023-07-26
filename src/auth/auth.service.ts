import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/models/User';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(user: User) {
    const existingUser = await this.usersService.findOne(user.email);
    if (existingUser) {
      throw new BadRequestException(`User '${user.email}' already exists`);
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);

    const newUser = new User(
      user.firstName,
      user.lastName,
      user.email,
      hashedPassword,
    );

    return this.usersService.create(newUser);
  }

  async logIn(email: string, password: string) {
    const user = await this.usersService.findOne(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const correctPassword = await bcrypt.compare(password, user.password);
    if (!correctPassword) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.firstName, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
