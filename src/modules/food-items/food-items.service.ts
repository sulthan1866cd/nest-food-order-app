import { Inject, Injectable } from '@nestjs/common';
import { FoodItem } from './entities/food-item.entity';
import { type IRepository } from 'src/interface/repository.interface';
import { OrdersService } from '../orders/orders.service';
import { type IS3ClientService } from 'src/interface/s3ClientService.interface';
import { CreateFoodItemDto, UpdateFoodItemDto } from './dto/food-item.dto';

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
    private readonly ordersService: OrdersService,
    @Inject('S3ClientService')
    private readonly s3ClientService: IS3ClientService,
  ) {}

  async create(
    foodItem: CreateFoodItemDto,
    imageFile: Express.Multer.File,
  ): Promise<FoodItem | null> {
    if (await this.isExists(foodItem.name)) return null;
    const createdFoodItem = (await this.foodItemRepo.create(
      foodItem,
    )) as FoodItem;
    const url = await this.s3ClientService.upload(
      createdFoodItem.id,
      imageFile.buffer,
    );
    return this.foodItemRepo.update({ id: createdFoodItem.id, image: url });
  }

  async findAllBy({
    searchQuery,
    min,
    max,
  }: FindAllByParams): Promise<FoodItem[]> {
    return (await this.findAll()).filter(
      (foodItem) =>
        (searchQuery
          ? this.filterByNameOrPriceQuery(foodItem, searchQuery)
          : true) &&
        (min && max ? this.filterAllByPriceRange(foodItem, +min, +max) : true),
    );
  }

  async findAllByOrdersUserame(username: string): Promise<FoodItem[]> {
    const orders = await this.ordersService.findByUsername(username);
    return orders.map((order) => order.foodItem);
  }

  findOne(id: string): Promise<FoodItem | null> {
    return this.foodItemRepo.findOneBy({ id });
  }

  async update(
    id: string,
    foodItem: UpdateFoodItemDto,
    imageFile?: Express.Multer.File,
  ): Promise<FoodItem | null> {
    if (!(await this.isExists(id))) return null;
    const url = imageFile
      ? await this.s3ClientService.upload(id, imageFile.buffer)
      : undefined;
    return this.foodItemRepo.update({ ...foodItem, id, image: url });
  }

  async remove(id: string): Promise<boolean> {
    if (!(await this.isExists(id))) return false;
    await this.s3ClientService.delete(id);
    await this.foodItemRepo.deleteBy({ id });
    return true;
  }

  private async isExists(checkFoodItem: string): Promise<boolean> {
    return (await this.findAll()).some(
      (foodItem) =>
        foodItem.id === checkFoodItem || foodItem.name === checkFoodItem,
    );
  }

  private findAll(): Promise<FoodItem[]> {
    return this.foodItemRepo.findBy();
  }

  private filterByNameOrPriceQuery(
    foodItem: FoodItem,
    searchQuery: string,
  ): boolean {
    return (
      foodItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      foodItem.price.toString().includes(searchQuery)
    );
  }

  private filterAllByPriceRange(
    foodItem: FoodItem,
    min: number,
    max: number,
  ): boolean {
    return min <= foodItem.price && max >= foodItem.price;
  }
}
