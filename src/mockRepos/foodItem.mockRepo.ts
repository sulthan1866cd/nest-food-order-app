import { FoodItem } from 'src/modules/food-items/entities/food-item.entity';
import { BaseMockRepository } from './baseMockRepo';

export class foodItemMockRepository extends BaseMockRepository<FoodItem> {
  constructor() {
    super(
      Promise.resolve([
        { id: 1, name: 'Idli', price: 20 },
        { id: 2, name: 'Dosa', price: 60 },
        { id: 3, name: 'Poori', price: 50 },
        { id: 4, name: 'Veg Meals', price: 120 },
        { id: 5, name: 'Parotta', price: 80 },
      ]),
    );
  }
}
