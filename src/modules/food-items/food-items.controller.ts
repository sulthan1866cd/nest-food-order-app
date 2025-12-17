import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { FoodItemsService } from './food-items.service';
import { FoodItem } from './entities/food-item.entity';

@Controller('food-items')
export class FoodItemsController {
  constructor(private readonly foodItemsService: FoodItemsService) {}

  @Post()
  create(@Body() foodItem: FoodItem) {
    return this.foodItemsService.create(foodItem);
  }

  @Get()
  findAll(
    @Query('search-query') searchQuery?: string,
    @Query('min') min?: string,
    @Query('max') max?: string,
  ) {
    return this.foodItemsService.findAllBy({
      searchQuery,
      min,
      max,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.foodItemsService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() foodItem: FoodItem) {
    return this.foodItemsService.update(+id, foodItem);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.foodItemsService.remove(+id);
  }
}
