import { OmitType, PartialType } from '@nestjs/mapped-types';
import { FoodItem } from '../entities/food-item.entity';

export class CreateFoodItemDto extends OmitType(FoodItem, ['id', 'image']) {}

export class UpdateFoodItemDto extends PartialType(
  OmitType(FoodItem, ['id', 'image']),
) {}
