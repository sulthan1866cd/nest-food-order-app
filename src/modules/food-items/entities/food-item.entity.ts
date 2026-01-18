import { UUID } from 'crypto';

export class FoodItem {
  id: UUID;
  name: string;
  price: number;
  image: string;
}
