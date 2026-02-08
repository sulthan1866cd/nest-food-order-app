import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { Roles } from 'src/guards/roles.decorator';
import { Role } from 'src/guards/role.enum';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import {
  CreateProductValidator,
  UpdateProductValidator,
} from './pipe/productValidator.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { type UUID } from 'crypto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Roles(Role.WORKER, Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body(CreateProductValidator) product: CreateProductDto,
    @UploadedFile() imageFile: Express.Multer.File,
  ): Promise<Product> {
    const createdProduct = await this.productsService.create(
      product,
      imageFile,
    );
    if (!createdProduct) {
      throw new ConflictException(`product: ${product.name} already exists`);
    }
    return createdProduct;
  }

  @Get()
  findAll(
    @Query('search-query') searchQuery?: string,
    @Query('min') min?: string,
    @Query('max') max?: string,
  ): Promise<Product[]> {
    return this.productsService.findAllBy({
      searchQuery,
      min,
      max,
    });
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: UUID): Promise<Product> {
    const product = await this.productsService.findOne(id);
    if (!product) {
      throw new NotFoundException(`product: ${id} does not exist`);
    }
    return product;
  }

  @Get('orders/:username')
  findAllByOrdersUsername(
    @Param('username') username: string,
  ): Promise<Product[]> {
    return this.productsService.findAllByOrdersUserame(username);
  }

  @Get('shops/:shopId')
  findAllByShopId(
    @Param('shopId', ParseUUIDPipe) shopId: UUID,
  ): Promise<Product[]> {
    return this.productsService.findAllByShopId(shopId);
  }

  @Put(':id')
  @Roles(Role.WORKER, Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body(UpdateProductValidator)
    product: UpdateProductDto,
    @UploadedFile() imageFile?: Express.Multer.File,
  ): Promise<Product> {
    const updatedProduct = await this.productsService.update(
      id,
      product,
      imageFile,
    );
    if (!updatedProduct) {
      throw new NotFoundException(`product: ${id} does not exist`);
    }
    return updatedProduct;
  }

  @Delete(':id')
  @Roles(Role.WORKER, Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async remove(@Param('id', ParseUUIDPipe) id: UUID): Promise<void> {
    const isDeleted = await this.productsService.remove(id);
    if (!isDeleted)
      throw new NotFoundException(`product: ${id} does not exist`);
  }
}
