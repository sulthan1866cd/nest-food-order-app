import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './role.enum';
import { ClientUserDto } from 'src/modules/users/dto/users.dto';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    const { role } = context
      .switchToHttp()
      .getRequest<{ user: ClientUserDto }>().user;
    if (!requiredRoles || role === Role.ADMIN) return true;
    if (!role) return false;
    return requiredRoles.some((reqRole) => reqRole === role);
  }
}
