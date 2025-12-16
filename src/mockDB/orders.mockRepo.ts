import { Order } from 'src/modules/orders/entities/order.entity';
import { BaseMockRepository } from './baseMockRepo';

export class OrderMockRepository extends BaseMockRepository<Order> {
  constructor() {
    super(
      Promise.resolve([
        {
          id: 1,
          time: new Date(),
          username: 'ironwolf',
          foodItemId: 2,
          quantity: 3,
        },
        {
          id: 2,
          time: new Date(),
          username: 'ironwolf',
          foodItemId: 1,
          quantity: 1,
        },
        {
          id: 3,
          time: new Date(),
          username: 'skyhawk',
          foodItemId: 3,
          quantity: 2,
        },
        {
          id: 4,
          time: new Date(),
          username: 'bytecrunch',
          foodItemId: 4,
          quantity: 3,
        },
        {
          id: 5,
          time: new Date(),
          username: 'skyhawk',
          foodItemId: 5,
          quantity: 4,
        },
      ]),
    );
  }
}
