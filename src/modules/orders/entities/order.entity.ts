import { UUID } from 'crypto';
import { FoodItem } from 'src/modules/food-items/entities/food-item.entity';

export class Order {
  id: UUID;
  username: string;
  time: Date;
  //many(Order) to one(FoodItem)
  foodItem: FoodItem;
  foodItemId: UUID;
  quantity: number;
}
