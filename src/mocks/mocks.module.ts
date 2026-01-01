import { forwardRef, Module } from '@nestjs/common';
import { UserMockRepository } from './mockRepos/users.mockRepo';
import { OrderMockRepository } from './mockRepos/orders.mockRepo';
import { foodItemMockRepository } from './mockRepos/foodItem.mockRepo';
import { UsersModule } from './../modules/users/users.module';
import { RolesGuard } from 'src/gurds/roles.guard';

@Module({
  imports: [forwardRef(() => UsersModule)],
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
    RolesGuard,
  ],
  exports: [
    'UserRepository',
    'OrderRepository',
    'FoodItemRepository',
    RolesGuard,
  ],
})
export class MockModule {}
