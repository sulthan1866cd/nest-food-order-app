import { Module } from '@nestjs/common';
import { UserMockRepository } from './mockRepos/users.mockRepo';
import { OrderMockRepository } from './mockRepos/orders.mockRepo';
import { ProductMockRepository } from './mockRepos/product.mockRepo';
import { ShopMockRepository } from './mockRepos/shops.mockRepo';
import { MallMockRepository } from './mockRepos/malls.mockRepo';

@Module({
  providers: [
    {
      provide: 'UserRepository',
      useClass: UserMockRepository,
    },
    {
      provide: 'OrderRepository',
      useClass: OrderMockRepository,
    },
    {
      provide: 'ProductRepository',
      useClass: ProductMockRepository,
    },
    {
      provide: 'ShopRepository',
      useClass: ShopMockRepository,
    },
    {
      provide: 'MallRepository',
      useClass: MallMockRepository,
    },
  ],
  exports: [
    'UserRepository',
    'OrderRepository',
    'ProductRepository',
    'ShopRepository',
    'MallRepository',
  ],
})
export class MockModule {}
