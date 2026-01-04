import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UsePipes,
  UseGuards,
  ConflictException,
  NotFoundException,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGaurd } from '../../gurds/auth.guard';
import { UserValidator } from './pipe/userValidator.pipe';
import { ClientUserDto, CreateUserDto, UpdateUserDto } from './dto/users.dto.';
import { UserInterceptor } from './interceptor/users.interceptor';
import { User } from './entities/user.entity';

@Controller('users')
@UseInterceptors(UserInterceptor)
export class CustomersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(UserValidator)
  async create(@Body() user: CreateUserDto): Promise<ClientUserDto> {
    const addedUser = await this.usersService.createCustomer(user);
    if (!addedUser)
      throw new ConflictException(`user: ${user.username} already exists`);

    return addedUser;
  }

  @Get(':username')
  @UseGuards(AuthGaurd)
  async findOne(@Param('username') username: string): Promise<User> {
    const user = await this.usersService.findOneCustomer(username);
    if (!user) throw new NotFoundException(`user: ${username} does not exist`);

    return user;
  }

  @Put(':username')
  // @UsePipes(UserValidator)
  @UseGuards(AuthGaurd)
  async update(
    @Param('username') username: string,
    @Body() user: UpdateUserDto,
  ): Promise<User> {
    const updatedUser = await this.usersService.updateCustomer(username, user);
    if (!updatedUser)
      throw new NotFoundException(`user: ${username} does not exist`);

    return updatedUser;
  }

  // @Delete(':username')
  // @UseGuards(AuthGaurd)
  // async remove(@Param('username') username: string) {
  //   const isDeleted = await this.usersService.remove(username);
  //   if (!isDeleted)
  //     throw new NotFoundException(`user: ${username} does not exist`);
  // }
}
