import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ClientUserDto } from '../dto/users.dto.';
import { User } from '../entities/user.entity';

@Injectable()
export class UserInterceptor implements NestInterceptor<
  ClientUserDto | User,
  ClientUserDto
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<ClientUserDto | User>,
  ): Observable<ClientUserDto> {
    return next.handle().pipe(
      map((user) => ({
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        id: user.id,
        role: user.role,
        authorization: 'authorization' in user ? user.authorization : undefined,
      })),
    );
  }
}
