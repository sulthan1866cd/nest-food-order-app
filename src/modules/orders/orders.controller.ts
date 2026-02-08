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
import { AuthGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/guards/roles.decorator';
import { Role } from 'src/guards/role.enum';
import { RolesGuard } from 'src/guards/roles.guard';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/orders.dto';
import { type UUID } from 'crypto';

@Controller('orders')
@UseGuards(AuthGuard)
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
  @Roles(Role.WORKER, Role.ADMIN)
  @UseGuards(RolesGuard)
  findAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }

  @Get('shops/:shopId')
  @Roles(Role.WORKER, Role.ADMIN)
  @UseGuards(RolesGuard)
  async findAllByShopId(
    @Param('shopId', ParseUUIDPipe) shopId: UUID,
  ): Promise<Order[]> {
    return this.ordersService.findAllByShopId(shopId);
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
