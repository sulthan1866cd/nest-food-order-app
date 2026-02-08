import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Product } from './entities/product.entity';
import { type IRepository } from 'src/interface/repository.interface';
import { OrdersService } from '../orders/orders.service';
import { type IS3ClientService } from 'src/modules/aws/interfaces/s3ClientService.interface';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { UUID } from 'crypto';
import { ShopsService } from '../shops/shops.service';

interface FindAllByParams {
  searchQuery?: string;
  min?: string;
  max?: string;
}

@Injectable()
export class ProductsService {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepo: IRepository<Product>,
    private readonly ordersService: OrdersService,
    @Inject('S3ClientService')
    private readonly s3ClientService: IS3ClientService,
    private readonly shopService: ShopsService,
  ) {}

  async create(
    product: CreateProductDto,
    imageFile: Express.Multer.File,
  ): Promise<Product | null> {
    if (await this.isExists(product.name)) return null;
    if (!(await this.shopService.isExists({ id: product.shopId })))
      throw new NotFoundException(`Shop: ${product.shopId} does not exist`);
    const createdProduct = (await this.productRepo.create(product)) as Product;
    const url = await this.s3ClientService.upload(
      createdProduct.id,
      imageFile.buffer,
    );
    return this.productRepo.update({ id: createdProduct.id, image: url });
  }

  async findAllBy({
    searchQuery,
    min,
    max,
  }: FindAllByParams): Promise<Product[]> {
    return (await this.findAll()).filter(
      (product) =>
        (searchQuery
          ? this.filterByNameOrPriceQuery(product, searchQuery)
          : true) &&
        (min && max ? this.filterAllByPriceRange(product, +min, +max) : true),
    );
  }

  async findAllByOrdersUserame(username: string): Promise<Product[]> {
    const orders = await this.ordersService.findByUsername(username);
    return orders.map((order) => order.product);
  }

  findAllByShopId(shopId: UUID): Promise<Product[]> {
    return this.productRepo.findBy({ shopId });
  }

  findOne(id: UUID): Promise<Product | null> {
    return this.productRepo.findOneBy({ id });
  }

  async update(
    id: UUID,
    product: UpdateProductDto,
    imageFile?: Express.Multer.File,
  ): Promise<Product | null> {
    if (!(await this.isExists(id))) return null;
    const existingProductWithName = await this.productRepo.findOneBy({
      name: product.name,
    });
    if (existingProductWithName && existingProductWithName.id !== id)
      throw new ConflictException(`Food item: ${product.name} already exists`);
    const url = imageFile
      ? await this.s3ClientService.upload(id, imageFile.buffer)
      : undefined;
    return this.productRepo.update({ ...product, id, image: url });
  }

  async remove(id: UUID): Promise<boolean> {
    if (!(await this.isExists(id))) return false;
    await this.s3ClientService.delete(id);
    await this.productRepo.deleteBy({ id });
    return true;
  }

  private isExists(checkProduct: string): Promise<boolean> {
    return this.productRepo.isExists(
      { name: checkProduct, id: checkProduct as UUID },
      true,
    );
  }

  private findAll(): Promise<Product[]> {
    return this.productRepo.findBy();
  }

  private filterByNameOrPriceQuery(
    product: Product,
    searchQuery: string,
  ): boolean {
    return (
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.price.toString().includes(searchQuery)
    );
  }

  private filterAllByPriceRange(
    product: Product,
    min: number,
    max: number,
  ): boolean {
    return min <= product.price && max >= product.price;
  }
}
