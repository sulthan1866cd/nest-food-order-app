import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FoodItemsService } from './food-items.service';
import { FoodItem } from './entities/food-item.entity';
import { Roles } from 'src/gurds/roles.decorator';
import { Role } from 'src/gurds/role.enum';
import { AuthGaurd } from 'src/gurds/auth.guard';
import { RolesGuard } from 'src/gurds/roles.guard';
import { FoodItemValidator } from './pipe/foodItemValidator.pipe';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('food-items')
export class FoodItemsController {
  constructor(private readonly foodItemsService: FoodItemsService) {}

  @Post()
  @Roles(Role.CHEF)
  @UseGuards(AuthGaurd, RolesGuard)
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body(FoodItemValidator) foodItem: FoodItem,
    @UploadedFile() imageFile: Express.Multer.File,
  ): Promise<FoodItem> {
    const createdFoodItem = await this.foodItemsService.create(
      foodItem,
      imageFile,
    );
    if (!createdFoodItem) {
      throw new ConflictException(`foodItem: ${foodItem.name} already exists`);
    }
    return createdFoodItem;
  }

  @Get()
  findAll(
    @Query('search-query') searchQuery?: string,
    @Query('min') min?: string,
    @Query('max') max?: string,
  ): Promise<FoodItem[]> {
    return this.foodItemsService.findAllBy({
      searchQuery,
      min,
      max,
    });
  }

  @Get('orders/:username')
  findAllByOrdersUsername(
    @Param('username') username: string,
  ): Promise<FoodItem[]> {
    return this.foodItemsService.findAllByOrdersUserame(username);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<FoodItem> {
    const foodItem = await this.foodItemsService.findOne(id);
    if (!foodItem) {
      throw new NotFoundException(`foodItem: ${id} does not exist`);
    }
    return foodItem;
  }

  @Put(':id')
  @Roles(Role.CHEF)
  @UseGuards(AuthGaurd, RolesGuard)
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Body(FoodItemValidator) foodItem: FoodItem,
    @UploadedFile() imageFile?: Express.Multer.File,
  ): Promise<FoodItem> {
    const updatedFoodItem = await this.foodItemsService.update(
      id,
      foodItem,
      imageFile,
    );
    if (!updatedFoodItem) {
      throw new NotFoundException(`foodItem: ${id} does not exist`);
    }
    return updatedFoodItem;
  }

  @Delete(':id')
  @Roles(Role.CHEF)
  @UseGuards(AuthGaurd, RolesGuard)
  async remove(@Param('id') id: string): Promise<void> {
    const isDeleted = await this.foodItemsService.remove(id);
    if (!isDeleted)
      throw new NotFoundException(`foodItem: ${id} does not exist`);
  }
}
