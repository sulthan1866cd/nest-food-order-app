import { UUID } from 'crypto';
import { Role } from 'src/guards/role.enum';

export class User {
  id: UUID;
  username: string;
  password: string;
  fullName: string;
  email: string;
  role: Role;
}
