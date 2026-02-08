import { UUID } from 'crypto';
import { Shop } from 'src/modules/shops/entities/shop.entity';

export class Product {
  id: UUID;
  name: string;
  price: number;
  image: string;
  shopId: UUID;
  shop: Shop;
}
