import { ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { CreateFoodItemDto, UpdateFoodItemDto } from '../dto/food-item.dto';
import { Validator } from 'src/pipes/validation.pipe';
import { UpdateValidator } from 'src/pipes/updateValitation.pipe';

export class CreateFoodItemValidator extends Validator<CreateFoodItemDto> {
  constructor() {
    super({ name: '', price: 0 });
  }
  transform(
    value: Partial<CreateFoodItemDto>,
    metadata: ArgumentMetadata,
  ): CreateFoodItemDto {
    if (!value)
      throw new BadRequestException({
        error: 'No body found',
        expected: this.refStructure,
      });
    this.validateAndSetPositiveNumber(value, 'price');
    return super.transform(value, metadata);
  }
}

export class UpdateFoodItemValidator extends UpdateValidator<UpdateFoodItemDto> {
  constructor() {
    super({ name: '', price: 0 });
  }
  transform(
    value: Partial<UpdateFoodItemDto>,
    metadata: ArgumentMetadata,
  ): UpdateFoodItemDto {
    if (!value)
      throw new BadRequestException({
        error: 'No body found',
        expected: this.refStructure,
      });
    this.validateAndSetPositiveNumber(value, 'price');
    return super.transform(value, metadata);
  }
}
