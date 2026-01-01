import { Role } from 'src/gurds/role.enum';

export class User {
  id: string;
  username: string;
  password: string;
  fullName: string;
  email: string;
  role: Role;
}
