import { FoodItem } from 'src/modules/food-items/entities/food-item.entity';
import { BaseMockRepository } from './baseMockRepo';
import { mockFoodItems } from '../mockDatas/foodItems.stub';

export class foodItemMockRepository extends BaseMockRepository<FoodItem> {
  constructor() {
    super(Promise.resolve(mockFoodItems));
  }
}
