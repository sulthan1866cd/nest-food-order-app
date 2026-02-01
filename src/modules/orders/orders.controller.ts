import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UsePipes,
  NotFoundException,
  UseGuards,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import {
  CreateOrderValidator,
  UpdateOrderValidator,
} from './pipe/orderValidator.pipe';
import { AuthGaurd } from 'src/gurds/auth.guard';
import { Roles } from 'src/gurds/roles.decorator';
import { Role } from 'src/gurds/role.enum';
import { RolesGuard } from 'src/gurds/roles.guard';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/orders.dto';
import { type UUID } from 'crypto';

@Controller('orders')
@UseGuards(AuthGaurd)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UsePipes(CreateOrderValidator)
  async create(@Body() order: CreateOrderDto): Promise<Order> {
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

  @Put(':id/status')
  @UsePipes(UpdateOrderValidator)
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() order: UpdateOrderStatusDto,
  ): Promise<Order> {
    const updatedOrder = await this.ordersService.updateStatus(
      id,
      order.status,
    );
    if (!updatedOrder)
      throw new NotFoundException(`order: ${id} does not exist`);
    return updatedOrder;
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: UUID): Promise<void> {
    const isDeleted = await this.ordersService.remove(id);
    if (!isDeleted) throw new NotFoundException(`order: ${id} does not exist`);
  }
}
