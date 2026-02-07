import {
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { type IAuthService } from 'src/modules/auth/interfaces/authService.interface';
import { ClientUserDto } from 'src/modules/users/dto/users.dto';

export class AuthGuard implements CanActivate {
  constructor(
    @Inject('AuthService')
    private readonly authService: IAuthService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<{
      headers: { authorization: string };
      user: ClientUserDto;
    }>();
    const authorization = req.headers.authorization;
    if (!authorization) throw new UnauthorizedException();
    const token = authorization.split(' ')[1];
    const user = this.authService.validateToken(token);
    req.user = user;
    return true;
  }
}
