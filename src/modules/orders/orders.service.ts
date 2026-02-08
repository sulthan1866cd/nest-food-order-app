import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Order, OrderStatus } from './entities/order.entity';
import { type IRepository } from 'src/interface/repository.interface';
import { UsersService } from '../users/users.service';
import { CreateOrderDto } from './dto/orders.dto';
import { UUID } from 'crypto';

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
      productId: order.productId,
    });
    if (previousOrder && previousOrder.status === OrderStatus.PENDING)
      return this.orderRepo.update({
        ...previousOrder,
        quantity: previousOrder.quantity + order.quantity,
      });

    return this.orderRepo.create({ ...order, status: OrderStatus.PENDING });
  }

  findAll(): Promise<Order[]> {
    return this.orderRepo.findBy();
  }

  async findAllByShopId(shopId: UUID): Promise<Order[]> {
    const allOrders = await this.orderRepo.findBy();
    return allOrders.filter((order) => order.product.shopId === shopId);
  }

  findByUsername(username: string): Promise<Order[]> {
    return this.orderRepo.findBy({ username });
  }

  async updateStatus(id: UUID, status: OrderStatus): Promise<Order | null> {
    const order = await this.orderRepo.findOneBy({ id });
    if (!order) return null;
    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException(
        'Cannot revert completed or cancelled order',
      );
    }

    return this.orderRepo.update({ status, id });
  }

  async remove(id: UUID): Promise<boolean> {
    if (!(await this.isExists(id))) return false;
    await this.orderRepo.deleteBy({ id });
    return true;
  }

  isExists(id: UUID): Promise<boolean> {
    return this.orderRepo.isExists({ id });
  }
}
