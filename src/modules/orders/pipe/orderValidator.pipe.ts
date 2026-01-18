import { ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { CreateOrderDto } from '../dto/orders.dto';
import { Validator } from 'src/pipes/validation.pipe';

export class OrderValidator extends Validator<CreateOrderDto> {
  constructor() {
    super({
      username: '',
      foodItemId: '1-1-1-1-1',
      quantity: 0,
      time: new Date(),
    });
  }
  transform(value: CreateOrderDto, metadata: ArgumentMetadata): CreateOrderDto {
    if (!value)
      throw new BadRequestException(
        `No body found, expected body of type: ${this.getObjectStructure({
          username: '',
          foodItemId: '1-1-1-1-1',
          quantity: 0,
          time: new Date(),
        })}`,
      );
    value.time = new Date(value.time ?? Date.now());
    return super.transform(value, metadata);
  }
}
