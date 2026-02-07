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
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../../guards/auth.guard';
import {
  CreateUserValidator,
  UpdateUserValidator,
} from './pipe/userValidator.pipe';
import { ClientUserDto, CreateUserDto, UpdateUserDto } from './dto/users.dto';
import { UserInterceptor } from './interceptor/user.interceptor';
import { User } from './entities/user.entity';

@Controller('users')
@UseInterceptors(UserInterceptor)
export class CustomersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(CreateUserValidator)
  async create(@Body() user: CreateUserDto): Promise<ClientUserDto> {
    const addedUser = await this.usersService.createCustomer(user);
    if (!addedUser)
      throw new ConflictException(`user: ${user.username} already exists`);

    return addedUser;
  }

  @Get(':username')
  @UseGuards(AuthGuard)
  async findOne(@Param('username') username: string): Promise<User> {
    const user = await this.usersService.findOneCustomer(username);
    if (!user) throw new NotFoundException(`user: ${username} does not exist`);

    return user;
  }

  @Put(':username')
  @UsePipes(UpdateUserValidator)
  @UseGuards(AuthGuard)
  async update(
    @Param('username') username: string,
    @Body() user: UpdateUserDto,
  ): Promise<User> {
    const updatedUser = await this.usersService.updateCustomer(username, user);
    if (!updatedUser)
      throw new NotFoundException(`user: ${username} does not exist`);

    return updatedUser;
  }

  @Delete(':username')
  @UseGuards(AuthGuard)
  async remove(@Param('username') username: string) {
    const isDeleted = await this.usersService.removeCustomer(username);
    if (!isDeleted)
      throw new NotFoundException(`user: ${username} does not exist`);
  }
}
