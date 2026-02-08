import { ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from '../dto/product.dto';
import { Validator } from 'src/pipes/validation.pipe';
import { UpdateValidator } from 'src/pipes/updateValitation.pipe';

export class CreateProductValidator extends Validator<CreateProductDto> {
  constructor() {
    super({ name: '', price: 0, shopId: '1-1-1-1-1' });
  }
  transform(
    value: Partial<CreateProductDto>,
    metadata: ArgumentMetadata,
  ): CreateProductDto {
    if (!value)
      throw new BadRequestException({
        error: 'No body found',
        expected: this.refStructure,
      });
    this.validateAndSetPositiveNumber(value, 'price');
    return super.transform(value, metadata);
  }
}

export class UpdateProductValidator extends UpdateValidator<UpdateProductDto> {
  constructor() {
    super({ name: '', price: 0 });
  }
  transform(
    value: Partial<UpdateProductDto>,
    metadata: ArgumentMetadata,
  ): UpdateProductDto {
    if (!value)
      throw new BadRequestException({
        error: 'No body found',
        expected: this.refStructure,
      });
    this.validateAndSetPositiveNumber(value, 'price');
    return super.transform(value, metadata);
  }
}
