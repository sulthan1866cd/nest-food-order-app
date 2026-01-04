import { randomInt, randomUUID } from 'crypto';
import { Order } from 'src/modules/orders/entities/order.entity';
import { getMockUser } from './users.stub';
import { getMockFoodItem } from './foodItems.stub';

export const mockOrders: Order[] = Array.from({ length: 10 }, () => ({
  id: randomUUID(),
  username: getMockUser().username,
  foodItemId: getMockFoodItem().id,
  quantity: randomInt(10),
  time: new Date(),
  foodItem: getMockFoodItem(),
}));

export const getMockOrder = (): Order =>
  mockOrders[randomInt(mockOrders.length - 1)];
