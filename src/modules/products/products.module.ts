import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MockModule } from 'src/mocks/mocks.module';
import { AuthModule } from '../auth/auth.module';
import { OrdersModule } from '../orders/orders.module';
import { AWSModule } from '../aws/aws.module';
import { ShopsModule } from '../shops/shops.module';

@Module({
  imports: [MockModule, AuthModule, OrdersModule, AWSModule, ShopsModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
