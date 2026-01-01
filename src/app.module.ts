import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { UsersModule } from './modules/users/users.module';
import { OrdersModule } from './modules/orders/orders.module';
import { FoodItemsModule } from './modules/food-items/food-items.module';
import { ConfigModule } from '@nestjs/config';
import { S3ClientSerivce } from './modules/aws/s3Client.service';
import { AWSModule } from './modules/aws/aws.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    OrdersModule,
    FoodItemsModule,
    AWSModule,
  ],
})
export class AppModule implements NestModule {
  constructor(s3Service: S3ClientSerivce) {
    s3Service.createBucket();
  }
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
