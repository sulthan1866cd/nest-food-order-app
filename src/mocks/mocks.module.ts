import { Module } from '@nestjs/common';
import { UserMockRepository } from './mockRepos/users.mockRepo';
import { OrderMockRepository } from './mockRepos/orders.mockRepo';
import { foodItemMockRepository } from './mockRepos/foodItem.mockRepo';

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
      provide: 'FoodItemRepository',
      useClass: foodItemMockRepository,
    },
  ],
  exports: ['UserRepository', 'OrderRepository', 'FoodItemRepository'],
})
export class MockModule {}
