import { IAuthService } from 'src/interface/authService.interface';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  generateToken(user: User): string {
    return this.jwtService.sign(user);
  }
  validateToken(token: string): User {
    try {
      return this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException('invalid token');
    }
  }
  async validateUser(
    username: string,
    email: string,
    password: string,
  ): Promise<User> {
    const user =
      (await this.userService.findOne(username)) ||
      (await this.userService.findOneByEmail(email));
    if (!user) throw new NotFoundException(`user: ${username} not found`);
    if (user.password !== password) throw new UnauthorizedException();
    return user;
  }
}
