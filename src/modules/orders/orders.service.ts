import { Inject, Injectable } from '@nestjs/common';
import { Order } from './entities/order.entity';
import { type IRepository } from 'src/interface/repository.interface';
import { UsersService } from '../users/users.service';
import { CreateOrderDto } from './dto/orders.dto';

@Injectable()
export class OrdersService {
  constructor(
    @Inject('OrderRepository')
    private readonly orderRepo: IRepository<Order>,
    private readonly userService: UsersService,
  ) {}

  async create(order: CreateOrderDto): Promise<Order | null> {
    if (!(await this.userService.isExists(order.username))) return null;
    const previousOrder = await this.orderRepo.findOneBy({
      username: order.username,
      foodItemId: order.foodItemId,
    });
    if (previousOrder)
      return await this.orderRepo.update({
        ...previousOrder,
        quantity: previousOrder.quantity + order.quantity,
      });

    return this.orderRepo.create(order);
  }

  findAll(): Promise<Order[]> {
    return this.orderRepo.findBy();
  }

  findByUsername(username: string): Promise<Order[]> {
    return this.orderRepo.findBy({ username });
  }

  // async update(id: string, order: Order): Promise<Order | null> {
  //   if (!(await this.isExists(id))) return null;
  //   return this.orderRepo.update({ ...order, id });
  // }

  async remove(id: string): Promise<boolean> {
    if (!(await this.isExists(id))) return false;
    await this.orderRepo.deleteBy({ id });
    return true;
  }

  private async isExists(id: string): Promise<boolean> {
    return (await this.findAll()).some((order) => order.id === id);
  }
}
