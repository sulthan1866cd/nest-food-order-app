import { UUID } from 'crypto';
import { Role } from 'src/gurds/role.enum';

export class User {
  id: UUID;
  username: string;
  password: string;
  fullName: string;
  email: string;
  role: Role;
}
