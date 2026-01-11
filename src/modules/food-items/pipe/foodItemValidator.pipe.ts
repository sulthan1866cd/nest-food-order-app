import { ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { CreateFoodItemDto, UpdateFoodItemDto } from '../dto/food-item.dto';
import { Validator } from 'src/pipes/validation.pipe';

export class CreateFoodItemValidator extends Validator<CreateFoodItemDto> {
  constructor() {
    super({ name: '', price: 0 });
  }
  transform(
    value: Partial<CreateFoodItemDto>,
    metadata: ArgumentMetadata,
  ): CreateFoodItemDto {
    if (!value)
      throw new BadRequestException(
        `No body found, expected body of type: ${this.getObjectStructure({ name: '', price: 0 })}`,
      );
    value.price = Number(value.price);
    return super.transform(value, metadata);
  }
}

export class UpdateFoodItemValidator extends Validator<UpdateFoodItemDto> {
  constructor() {
    super({});
  }
  transform(
    value: Partial<UpdateFoodItemDto>,
    metadata: ArgumentMetadata,
  ): UpdateFoodItemDto {
    if (metadata.type !== 'body') return value;
    for (const key in value) {
      if (['name', 'price'].includes(key)) {
        value.price = Number(value.price);
        return super.transform(value, metadata);
      }
    }
    throw new BadRequestException(
      `At least one of the following fields must be provided for update: ${this.getObjectStructure({ name: '', price: 0 })}`,
    );
  }
}
