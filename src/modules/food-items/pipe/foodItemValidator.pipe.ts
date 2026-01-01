import { FoodItem } from '../entities/food-item.entity';
import { Validator } from 'src/pipes/validation.pipe';

export class FoodItemValidator extends Validator<Omit<FoodItem, 'image'>> {
  constructor() {
    super({ name: '', price: 0 });
  }
  transform(value: Partial<Omit<FoodItem, 'image'>>): Omit<FoodItem, 'image'> {
    value.price = Number(value.price);
    return super.transform(value);
  }
}
