import { Role } from 'src/gurds/role.enum';
import { Validator } from 'src/pipes/validation.pipe';
import { CreateUserDto, UpdateUserDto } from '../dto/users.dto.';
import { UpdateValidator } from 'src/pipes/updateValitation.pipe';

export class CreateUserValidator extends Validator<CreateUserDto> {
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

export class UpdateUserValidator extends UpdateValidator<UpdateUserDto> {
  constructor() {
    super({ email: '', password: '', fullName: '', role: Role.CUSTOMER });
  }
}
