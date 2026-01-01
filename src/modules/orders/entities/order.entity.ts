import { FoodItem } from 'src/modules/food-items/entities/food-item.entity';

export class Order {
  id: string;
  username: string;
  time: Date;
  //many(Order) to one(FoodItem)
  foodItem: FoodItem;
  foodItemId: string;
  quantity: number;
}
