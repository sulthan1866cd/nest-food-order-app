import { Body, Controller, Get, Headers, Inject, Post } from '@nestjs/common';
import { type IAuthService } from 'src/interface/authService.interface';
import { User } from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AuthService')
    private readonly authService: IAuthService,
  ) {}

  @Post()
  async authoriseUser(@Body() user: User) {
    const usr = await this.authService.validateUser(
      user.username,
      user.username,
      user.password,
    );
    const authorization = this.authService.generateToken(usr);
    return { authorization, ...usr };
  }

  @Get('validate-token')
  validateToken(@Headers('authorization') token: string) {
    token = token.split(' ')[1];
    return this.authService.validateToken(token);
  }
}
