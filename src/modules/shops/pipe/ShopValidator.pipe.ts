import { Validator } from 'src/pipes/validation.pipe';
import { CreateShopDto, UpdateShopDto } from '../dto/shop.dto';
import { UpdateValidator } from 'src/pipes/updateValitation.pipe';

export class CreateShopValidator extends Validator<CreateShopDto> {
  constructor() {
    super({ name: '', location: '', mallId: '1-1-1-1-1' });
  }
}

export class UpdateShopValidator extends UpdateValidator<UpdateShopDto> {
  constructor() {
    super({ name: '', location: '' });
  }
}
