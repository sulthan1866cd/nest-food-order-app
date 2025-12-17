import { Inject, Injectable } from '@nestjs/common';
import { FoodItem } from './entities/food-item.entity';
import { type IRepository } from 'src/interface/repository.interface';

interface FindAllByParams {
  searchQuery?: string;
  min?: string;
  max?: string;
}

@Injectable()
export class FoodItemsService {
  constructor(
    @Inject('FoodItemRepository')
    private readonly foodItemRepo: IRepository<FoodItem>,
  ) {}

  create(foodItem: FoodItem) {
    return this.foodItemRepo.create(foodItem);
  }

  async findAllBy({ searchQuery, min, max }: FindAllByParams) {
    return (await this.findAll()).filter(
      (foodItem) =>
        (searchQuery
          ? this.filterByNameOrPriceQuery(foodItem, searchQuery)
          : true) &&
        (min && max ? this.filterAllByPriceRange(foodItem, +min, +max) : true),
    );
  }

  findOne(id: number) {
    return this.foodItemRepo.findOneBy({ id });
  }

  async update(id: number, foodItem: FoodItem) {
    if (!(await this.isExists(id))) return null;
    return this.foodItemRepo.update({ ...foodItem, id });
  }

  async remove(id: number) {
    if (!(await this.isExists(id))) return false;
    await this.foodItemRepo.deleteBy({ id });
    return true;
  }

  private async isExists(id: number) {
    return !!(await this.findAll()).find((foodItem) => foodItem.id === id);
  }

  private findAll() {
    return this.foodItemRepo.findBy();
  }

  private filterByNameOrPriceQuery(foodItem: FoodItem, searchQuery: string) {
    return (
      foodItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      foodItem.price.toString().includes(searchQuery)
    );
  }

  private filterAllByPriceRange(foodItem: FoodItem, min: number, max: number) {
    return min <= foodItem.price && max >= foodItem.price;
  }
}
