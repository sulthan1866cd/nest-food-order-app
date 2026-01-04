import { CreateFoodItemDto, UpdateFoodItemDto } from '../dto/food-item.dto';
import { Validator } from 'src/pipes/validation.pipe';

export class CreateFoodItemValidator extends Validator<CreateFoodItemDto> {
  constructor() {
    super({ name: '', price: 0 });
  }
  transform(value: Partial<CreateFoodItemDto>): CreateFoodItemDto {
    value.price = Number(value.price);
    return super.transform(value);
  }
}

export class UpdateFoodItemValidator extends Validator<UpdateFoodItemDto> {
  constructor() {
    super({});
  }
  transform(value: Partial<UpdateFoodItemDto>): UpdateFoodItemDto {
    value.price = Number(value.price);
    return super.transform(value);
  }
}
