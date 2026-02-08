import { UUID } from 'crypto';
import { Product } from 'src/modules/products/entities/product.entity';

export class Order {
  id: UUID;
  username: string;
  time: Date;
  //many(Order) to one(Product)
  product: Product;
  productId: UUID;
  quantity: number;
  status: OrderStatus;
}

export enum OrderStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}
