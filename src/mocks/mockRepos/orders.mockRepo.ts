import { Order } from 'src/modules/orders/entities/order.entity';
import { BaseMockRepository } from './baseMockRepo';
import { type IRepository } from 'src/interface/repository.interface';
import { FoodItem } from 'src/modules/food-items/entities/food-item.entity';
import { Inject } from '@nestjs/common';

export class OrderMockRepository extends BaseMockRepository<Order> {
  constructor(
    @Inject('FoodItemRepository')
    private readonly foodItemRepository: IRepository<FoodItem>,
  ) {
    super(
      Promise.resolve([
        // {
        //   id: 1,
        //   time: new Date(),
        //   username: 'ironwolf',
        //   foodItemId: 2,
        //   quantity: 3,
        // },
        // {
        //   id: 2,
        //   time: new Date(),
        //   username: 'ironwolf',
        //   foodItemId: 1,
        //   quantity: 1,
        // },
        // {
        //   id: 3,
        //   time: new Date(),
        //   username: 'skyhawk',
        //   foodItemId: 3,
        //   quantity: 2,
        // },
        // {
        //   id: 4,
        //   time: new Date(),
        //   username: 'bytecrunch',
        //   foodItemId: 4,
        //   quantity: 3,
        // },
        // {
        //   id: 5,
        //   time: new Date(),
        //   username: 'skyhawk',
        //   foodItemId: 5,
        //   quantity: 4,
        // },
      ]),
    );
  }
  async create(entity: Order): Promise<Order | null> {
    entity.foodItem = (await this.foodItemRepository.findOneBy({
      id: entity.foodItemId,
    })) as FoodItem;
    return super.create(entity);
  }
}
