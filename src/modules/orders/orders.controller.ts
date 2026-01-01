import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  // Put,
  UsePipes,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { OrderValidator } from './pipe/orderValidator.pipe';
import { AuthGaurd } from 'src/gurds/auth.guard';
import { Roles } from 'src/gurds/roles.decorator';
import { Role } from 'src/gurds/role.enum';
import { RolesGuard } from 'src/gurds/roles.guard';

@Controller('orders')
@UseGuards(AuthGaurd)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UsePipes(OrderValidator)
  async create(@Body() order: Order): Promise<Order> {
    const createdOrder = await this.ordersService.create(order);
    if (!createdOrder)
      throw new NotFoundException(`user ${order.username} not found`);
    return createdOrder;
  }

  @Get()
  @Roles(Role.CHEF)
  @UseGuards(RolesGuard)
  findAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }

  @Get(':username')
  findByUsername(@Param('username') username: string): Promise<Order[]> {
    return this.ordersService.findByUsername(username);
  }

  // @Put(':id')
  // @UsePipes(OrderValidator)
  // async update(@Param('id') id: string, @Body() order: Order) {
  //   const updatedOrder = await this.ordersService.update(id, order);
  //   if (!updatedOrder) {
  //     throw new NotFoundException(`order: ${id} does not exist`);
  //   }
  //   return updatedOrder;
  // }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    const isDeleted = await this.ordersService.remove(id);
    if (!isDeleted) throw new NotFoundException(`order: ${id} does not exist`);
  }
}
