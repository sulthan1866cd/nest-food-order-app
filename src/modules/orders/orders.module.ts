import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MockModule } from 'src/mockRepos/mocks.module';

@Module({
  imports: [MockModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
