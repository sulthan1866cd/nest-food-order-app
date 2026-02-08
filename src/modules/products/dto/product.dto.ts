import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Product } from '../entities/product.entity';

export class CreateProductDto extends OmitType(Product, [
  'id',
  'image',
  'shop',
]) {}

export class UpdateProductDto extends PartialType(
  OmitType(Product, ['id', 'image', 'shopId']),
) {}
