import { CanActivate, ExecutionContext } from '@nestjs/common';

export class AuthGaurd implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req: { headers: { authorization: string } } = context
      .switchToHttp()
      .getRequest();
    return req.headers.authorization === 'authKey';
  }
}
