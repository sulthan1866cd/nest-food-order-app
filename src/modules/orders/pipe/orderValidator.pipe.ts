import { CreateOrderDto } from '../dto/orders.dto';
import { Validator } from 'src/pipes/validation.pipe';

export class OrderValidator extends Validator<CreateOrderDto> {
  constructor() {
    super({
      username: '',
      foodItemId: '',
      quantity: 0,
      time: new Date(),
    });
  }
  transform(value: CreateOrderDto): CreateOrderDto {
    value.time = new Date(value.time);
    return super.transform(value);
  }
}
