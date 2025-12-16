import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
  HttpException,
  HttpStatus,
  UsePipes,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { OrderValidator } from './pipe/orderValidator.pipe';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UsePipes(OrderValidator)
  create(@Body() order: Order) {
    return this.ordersService.create(order);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':username')
  findByUsername(
    @Param('username') username: string,
    @Query('foodItemId') foodItemID: string,
  ) {
    return this.ordersService.findByUsernameAndFoodItemID(
      username,
      +foodItemID,
    );
  }

  @Put(':id')
  @UsePipes(OrderValidator)
  async update(@Param('id') id: string, @Body() order: Order) {
    const updatedOrder = await this.ordersService.update(+id, order);
    if (!updatedOrder) {
      throw new HttpException(
        `order: ${id} does not exist`,
        HttpStatus.NOT_FOUND,
      );
    }
    return updatedOrder;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const isDeleted = await this.ordersService.remove(+id);
    if (!isDeleted)
      throw new HttpException(
        `order: ${id} does not exist`,
        HttpStatus.NOT_FOUND,
      );
  }
}
