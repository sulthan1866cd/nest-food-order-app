import { Inject, Injectable } from '@nestjs/common';
import { Order } from './entities/order.entity';
import { type IRepository } from 'src/interface/repository.interface';

@Injectable()
export class OrdersService {
  constructor(
    @Inject('OrderRepository')
    private readonly orderRepo: IRepository<Order>,
  ) {}

  create(order: Order): Promise<Order | null> {
    return this.orderRepo.create(order);
  }

  findAll(): Promise<Order[]> {
    return this.orderRepo.findBy();
  }

  findByUsernameAndFoodItemID(
    username: string,
    foodItemId?: number,
  ): Promise<Order[]> {
    return foodItemId
      ? this.orderRepo.findBy({ username, foodItemId })
      : this.orderRepo.findBy({ username });
  }

  async update(id: number, order: Order): Promise<Order | null> {
    if (!(await this.isExists(id))) return null;
    return this.orderRepo.update({ ...order, id });
  }

  async remove(id: number): Promise<boolean> {
    if (!(await this.isExists(id))) return false;
    await this.orderRepo.deleteBy({ id });
    return true;
  }

  async isExists(id: number): Promise<boolean> {
    return !!(await this.findAll()).find((order) => order.id === id);
  }
}
