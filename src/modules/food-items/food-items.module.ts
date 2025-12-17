import { Module } from '@nestjs/common';
import { FoodItemsService } from './food-items.service';
import { FoodItemsController } from './food-items.controller';
import { MockModule } from 'src/mockRepos/mocks.module';

@Module({
  imports: [MockModule],
  controllers: [FoodItemsController],
  providers: [FoodItemsService],
})
export class FoodItemsModule {}
