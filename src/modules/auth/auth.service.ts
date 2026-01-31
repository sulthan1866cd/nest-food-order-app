import { IAuthService } from 'src/interface/authService.interface';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { HashService } from './hash.service';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly hashService: HashService,
    @Inject(forwardRef(() => UsersService))
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
    const user = await this.userService.findOneByUsernameOrEmail(
      username,
      email,
    );
    if (!user) throw new NotFoundException(`user: ${username} not found`);
    const isPasswordValid = await this.hashService.compare(
      password,
      user.password,
    );
    if (!isPasswordValid) throw new UnauthorizedException();
    return user;
  }
}
