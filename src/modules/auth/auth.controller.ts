import {
  Body,
  Controller,
  Get,
  Headers,
  Inject,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { type IAuthService } from 'src/modules/auth/interfaces/authService.interface';
import { User } from '../users/entities/user.entity';
import { ClientUserDto } from '../users/dto/users.dto';
import { UserInterceptor } from '../users/interceptor/user.interceptor';

@Controller('auth')
@UseInterceptors(UserInterceptor)
export class AuthController {
  constructor(
    @Inject('AuthService')
    private readonly authService: IAuthService,
  ) {}

  @Post()
  async authoriseUser(@Body() user: User): Promise<ClientUserDto> {
    const usr = await this.authService.validateUser(
      user.username,
      user.username,
      user.password,
    );
    const authorization = this.authService.generateToken(usr);
    return { authorization, ...usr };
  }

  @Get('validate-token')
  validateToken(@Headers('authorization') token: string): ClientUserDto {
    token = token.split(' ')[1];
    return this.authService.validateToken(token);
  }
}
