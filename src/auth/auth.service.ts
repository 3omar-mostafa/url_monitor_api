import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '../jwt/jwt.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/models/User';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private notificationService: NotificationService,
  ) {}

  async signup(user: User) {
    const existingUser = await this.usersService.findOne(user.email);
    if (existingUser) {
      throw new BadRequestException(`User '${user.email}' already exists`);
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);

    let newUser = new User(user.firstName, user.lastName, user.email, hashedPassword);
    newUser = await this.usersService.create(newUser);

    this.notificationService.sendEmailVerification(newUser, this.generateVerificationUrl(newUser));

    return newUser;
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

    if (!user.isVerified) {
      throw new UnauthorizedException(`Please verify your email address`);
    }

    return {
      token: await this.jwtService.generateJwtToken(user),
    };
  }

  private async generateVerificationUrl(user: User): Promise<string> {
    const token = await this.jwtService.generateJwtToken(user);
    const url = new URL(process.env.HOST_DOMAIN);
    url.pathname = '/auth/verify';
    url.port = process.env.PORT;
    url.searchParams.append('token', token);
    return url.toString();
  }

  async verify(token: string) {
    const jwtPayload = this.jwtService.verify(token);
    if (!jwtPayload) {
      throw new UnauthorizedException();
    }

    const user = await this.usersService.findById(jwtPayload.sub);

    if (user.isVerified) {
      throw new BadRequestException(`Email ${jwtPayload.email} is already verified, you can login now`);
    }

    user.isVerified = true;
    await user.save();

    return {
      status: 'success',
      message: `Email ${jwtPayload.email} is verified, you can login now`,
    };
  }
}
