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
export class UsersInterceptor implements NestInterceptor<
  User[],
  ClientUserDto[]
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<User[]>,
  ): Observable<ClientUserDto[]> {
    return next.handle().pipe(
      map((users) =>
        users.map((user) => ({
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          id: user.id,
          role: user.role,
        })),
      ),
    );
  }
}
