import { Inject, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { UsersModule } from './modules/users/users.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ProductsModule } from './modules/products/products.module';
import { ConfigModule } from '@nestjs/config';
import { AWSModule } from './modules/aws/aws.module';
import { type IS3ClientService } from './modules/aws/interfaces/s3ClientService.interface';
import { ShopsModule } from './modules/shops/shops.module';
import { MallsModule } from './modules/malls/malls.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    OrdersModule,
    ProductsModule,
    AWSModule,
    ShopsModule,
    MallsModule
  ],
})
export class AppModule implements NestModule {
  constructor(
    @Inject('S3ClientService')
    private readonly s3ClientService: IS3ClientService,
  ) {
    void this.s3ClientService.createBucket();
  }
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
