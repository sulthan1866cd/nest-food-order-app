import { OmitType, PickType } from '@nestjs/mapped-types';
import { Order } from '../entities/order.entity';

export class CreateOrderDto extends OmitType(Order, [
  'id',
  'foodItem',
  'status',
]) {}

export class UpdateOrderStatusDto extends PickType(Order, ['status']) {}
