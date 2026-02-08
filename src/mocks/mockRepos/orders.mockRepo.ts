import { Order } from 'src/modules/orders/entities/order.entity';
import { BaseMockRepository } from './baseMockRepo';
import { type IRepository } from 'src/interface/repository.interface';
import { Product } from 'src/modules/products/entities/product.entity';
import { Inject } from '@nestjs/common';
import { mockOrders } from '../mockDatas/orders.stub';
import { UUID } from 'crypto';

export class OrderMockRepository extends BaseMockRepository<Order> {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: IRepository<Product>,
  ) {
    super(Promise.resolve(mockOrders));
  }
  async create(entity: Order): Promise<Order | null> {
    entity.product = (await this.productRepository.findOneBy({
      id: entity.productId,
    })) as Product;
    return super.create({ ...entity, time: new Date() });
  }
  async update(entity: Partial<Order> & { id: UUID }): Promise<Order | null> {
    return super.update({ ...entity, time: new Date() });
  }
}
