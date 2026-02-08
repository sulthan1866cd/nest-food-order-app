import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { ClientUserDto } from 'src/modules/users/dto/users.dto';
import { Role } from './role.enum';

@Injectable()
export class MallIdIntegrityGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const user: ClientUserDto = req.user;
    if (user.role === Role.SUPER_ADMIN) return true;

    const mallId =
      req.body?.mallId ||
      req.params?.mallId ||
      req.body?.shop?.mallId;
    if (!mallId || typeof mallId !== 'string')
      throw new BadRequestException('mallId must be a string');
    if (user.mallId !== mallId)
      throw new BadRequestException("mallId does not match user's mallId");
    return true;
  }
}
