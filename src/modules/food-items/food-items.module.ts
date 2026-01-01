import { Module } from '@nestjs/common';
import { FoodItemsService } from './food-items.service';
import { FoodItemsController } from './food-items.controller';
import { MockModule } from 'src/mocks/mocks.module';
import { AuthModule } from '../auth/auth.module';
import { OrdersModule } from '../orders/orders.module';
import { AWSModule } from '../aws/aws.module';

@Module({
  imports: [MockModule, AuthModule, OrdersModule, AWSModule],
  controllers: [FoodItemsController],
  providers: [FoodItemsService],
})
export class FoodItemsModule {}
