import { Order } from 'src/modules/orders/entities/order.entity';
import { BaseMockRepository } from './baseMockRepo';
import { type IRepository } from 'src/interface/repository.interface';
import { FoodItem } from 'src/modules/food-items/entities/food-item.entity';
import { Inject } from '@nestjs/common';
import { mockOrders } from '../mockDatas/orders.stub';
import { UUID } from 'crypto';

export class OrderMockRepository extends BaseMockRepository<Order> {
  constructor(
    @Inject('FoodItemRepository')
    private readonly foodItemRepository: IRepository<FoodItem>,
  ) {
    super(Promise.resolve(mockOrders));
  }
  async create(entity: Order): Promise<Order | null> {
    entity.foodItem = (await this.foodItemRepository.findOneBy({
      id: entity.foodItemId,
    })) as FoodItem;
    return super.create({ ...entity, time: new Date() });
  }
  async update(entity: Partial<Order> & { id: UUID }): Promise<Order | null> {
    return super.update({ ...entity, time: new Date() });
  }
}
