import {
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { type IAuthService } from 'src/interface/authService.interface';
import { User } from 'src/modules/users/entities/user.entity';

export class AuthGaurd implements CanActivate {
  constructor(
    @Inject('AuthService')
    private readonly authService: IAuthService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context
      .switchToHttp()
      .getRequest<{ headers: { authorization: string }; user: User }>();
    const authorization = req.headers.authorization;
    if (!authorization) throw new UnauthorizedException();
    const authkey = authorization.split(' ')[1];
    const user = this.authService.validateToken(authkey);
    req.user = user;
    return true;
  }
}
