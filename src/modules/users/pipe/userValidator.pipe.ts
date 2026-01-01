import { Role } from 'src/gurds/role.enum';
import { User } from '../entities/user.entity';
import { Validator } from 'src/pipes/validation.pipe';

export class UserValidator extends Validator<User> {
  constructor() {
    super({
      username: '',
      password: '',
      email: '',
      fullName: '',
      role: Role.CUSTOMER,
    });
  }
}
