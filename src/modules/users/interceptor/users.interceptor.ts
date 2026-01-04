import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ClientUserDto } from '../dto/users.dto.';

@Injectable()
export class UserInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map(
        (user: ClientUserDto): ClientUserDto => ({
          //user can also be User with password
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          id: user.id,
          role: user.role,
          authorization: user?.authorization,
        }),
      ),
    );
  }
}
