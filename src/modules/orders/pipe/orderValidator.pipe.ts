import { Order } from '../entities/order.entity';
import { Validator } from 'src/pipes/validation.pipe';

export class OrderValidator extends Validator<
  Omit<Order, 'time' | 'foodItem'> & { time: string } // bad code
> {
  constructor() {
    super({
      username: '',
      foodItemId: '',
      quantity: 0,
      time: '',
    });
  }
}
