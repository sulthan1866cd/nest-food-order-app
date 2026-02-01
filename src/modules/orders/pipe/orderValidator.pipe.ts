import { ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { CreateOrderDto, UpdateOrderStatusDto } from '../dto/orders.dto';
import { Validator } from 'src/pipes/validation.pipe';
import { UpdateValidator } from 'src/pipes/updateValitation.pipe';
import { OrderStatus } from '../entities/order.entity';

export class CreateOrderValidator extends Validator<CreateOrderDto> {
  constructor() {
    super({
      username: '',
      foodItemId: '1-1-1-1-1',
      quantity: 0,
    });
  }
  transform(value: CreateOrderDto, metadata: ArgumentMetadata): CreateOrderDto {
    if (!value)
      throw new BadRequestException({
        error: 'No body found',
        expected: this.refStructure,
      });
    this.validateAndSetPositiveNumber(value, 'quantity');
    return super.transform(value, metadata);
  }
}

export class UpdateOrderValidator extends UpdateValidator<UpdateOrderStatusDto> {
  constructor() {
    super({ status: OrderStatus.PENDING });
  }
}
