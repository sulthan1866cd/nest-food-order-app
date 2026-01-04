import { Role } from 'src/gurds/role.enum';
import { Validator } from 'src/pipes/validation.pipe';
import { CreateUserDto } from '../dto/users.dto.';

export class UserValidator extends Validator<CreateUserDto> {
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
