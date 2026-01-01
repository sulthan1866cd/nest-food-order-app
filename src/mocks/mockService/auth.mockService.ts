import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Role } from 'src/gurds/role.enum';
import { IAuthService } from 'src/interface/authService.interface';
import { User } from 'src/modules/users/entities/user.entity';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class AuthMockService implements IAuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {}

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

  generateToken(user: User): string {
    if (user) return 'authKey';
    return 'authKey';
  }

  validateToken(token: string): User {
    if (token !== 'authKey') throw new UnauthorizedException();
    return { role: Role.ADMIN } as User;
  }
}
