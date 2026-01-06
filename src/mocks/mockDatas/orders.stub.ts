import { randomInt, randomUUID } from 'crypto';
import { Order } from 'src/modules/orders/entities/order.entity';
import { getMockUser } from './users.stub';
import { getMockFoodItem } from './foodItems.stub';

export const mockOrders: Order[] = Array.from({ length: 10 }, () => {
  const foodItem = getMockFoodItem();
  return {
    id: randomUUID(),
    username: getMockUser().username,
    foodItemId: foodItem.id,
    quantity: randomInt(1, 10),
    time: new Date(),
    foodItem: foodItem,
  };
});

export const getMockOrder = (): Order =>
  mockOrders[randomInt(mockOrders.length - 1)];
