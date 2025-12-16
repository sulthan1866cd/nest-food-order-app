import { Module } from '@nestjs/common';
import { UserMockRepository } from './users.mockRepo';
import { OrderMockRepository } from './orders.mockRepo';
import { foodItemMockRepository } from './foodItem.mockRepo';

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
