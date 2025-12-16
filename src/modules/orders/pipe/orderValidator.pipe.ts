import { Order } from '../entities/order.entity';
import { Validator } from 'src/pipes/validation.pipe';

export class OrderValidator extends Validator<Order> {
  constructor() {
    super({ username: '', foodItemId: 0, quantity: 0, time: new Date() });
  }
}
