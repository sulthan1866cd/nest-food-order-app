import { User } from 'src/modules/users/entities/user.entity';

export interface IAuthService {
  generateToken(user: User): string;
  validateToken(token: string): User;
  validateUser(
    username: string,
    enmai: string,
    password: string,
  ): Promise<User>;
}
