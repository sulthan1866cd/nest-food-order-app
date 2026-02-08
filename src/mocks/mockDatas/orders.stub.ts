import { randomInt, randomUUID } from 'crypto';
import { Order, OrderStatus } from 'src/modules/orders/entities/order.entity';
import { mockUsers } from './users.stub';
import { mockProducts } from './products.stub';

export const mockOrders: Order[] = Array.from(
  { length: mockUsers.length },
  (_, i) => {
    const user = mockUsers[i];
    return Array.from({ length: randomInt(1, mockProducts.length) }, (_, j) => {
      const product = mockProducts[j];
      return {
        id: randomUUID(),
        username: user.username,
        productId: product.id,
        quantity: randomInt(1, 10),
        time: new Date(),
        product,
        status: OrderStatus.PENDING,
      };
    });
  },
).flat();

export const getMockOrder = (): Order =>
  mockOrders[randomInt(mockOrders.length - 1)];
