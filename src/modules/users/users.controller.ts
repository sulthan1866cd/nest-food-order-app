import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpException,
  HttpStatus,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UserValidator } from './pipe/userValidator.pipe';
import { AuthGaurd } from '../../gurds/auth.guard';

@UseGuards(AuthGaurd)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UsePipes(UserValidator)
  @Post()
  async create(@Body() user: User) {
    const addedUser = await this.usersService.create(user);
    if (!addedUser) {
      throw new HttpException(
        `user: ${user.username} already exists`,
        HttpStatus.CONFLICT,
      );
    }
    return addedUser;
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':username')
  async findOne(@Param('username') username: string) {
    const user = await this.usersService.findOne(username);
    if (!user) {
      throw new HttpException(
        `user: ${username} does not exist`,
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  @UsePipes(UserValidator)
  @Put(':username')
  async update(@Param('username') username: string, @Body() user: User) {
    const updatedUser = await this.usersService.update(username, user);
    if (!updatedUser) {
      throw new HttpException(
        `user: ${username} does not exist`,
        HttpStatus.NOT_FOUND,
      );
    }
    return updatedUser;
  }

  @Delete(':username')
  async remove(@Param('username') username: string) {
    const isDeleted = await this.usersService.remove(username);
    if (!isDeleted)
      throw new HttpException(
        `user: ${username} does not exist`,
        HttpStatus.NOT_FOUND,
      );
  }
}
