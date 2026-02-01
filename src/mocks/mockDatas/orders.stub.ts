import { randomInt, randomUUID } from 'crypto';
import { Order, OrderStatus } from 'src/modules/orders/entities/order.entity';
import { mockUsers } from './users.stub';
import { mockFoodItems } from './foodItems.stub';

export const mockOrders: Order[] = Array.from(
  { length: mockUsers.length },
  (_, i) => {
    const user = mockUsers[i];
    return Array.from(
      { length: randomInt(1, mockFoodItems.length) },
      (_, j) => {
        const foodItem = mockFoodItems[j];
        return {
          id: randomUUID(),
          username: user.username,
          foodItemId: foodItem.id,
          quantity: randomInt(1, 10),
          time: new Date(),
          foodItem: foodItem,
          status: OrderStatus.PENDING,
        };
      },
    );
  },
).flat();

export const getMockOrder = (): Order =>
  mockOrders[randomInt(mockOrders.length - 1)];
