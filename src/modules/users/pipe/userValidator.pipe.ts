import { Role } from 'src/gurds/role.enum';
import { Validator } from 'src/pipes/validation.pipe';
import { CreateUserDto, UpdateUserDto } from '../dto/users.dto.';
import { ArgumentMetadata, BadRequestException } from '@nestjs/common';

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

export class UpdateUserValidator extends Validator<UpdateUserDto> {
  constructor() {
    super({});
  }
  transform(
    value: Partial<UpdateUserDto>,
    metadata: ArgumentMetadata,
  ): UpdateUserDto {
    if (metadata.type !== 'body') return value;
    for (const key in value) {
      if (['password', 'email', 'fullName', 'role'].includes(key))
        return super.transform(value, metadata);
    }
    throw new BadRequestException(
      `At least one of the following fields must be provided for update: ${this.getObjectStructure({ password: '', email: '', fullName: '', role: Role.CUSTOMER })}`,
    );
  }
}
