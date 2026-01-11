import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { MockModule } from 'src/mocks/mocks.module';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { ConfigService } from '@nestjs/config';
import { HashService } from './hash.service';

@Module({
  imports: [
    MockModule,
    forwardRef(() => UsersModule),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
      }),
    }),
  ],
  providers: [
    {
      provide: 'AuthService',
      useClass: AuthService,
    },
    HashService,
  ],
  controllers: [AuthController],
  exports: ['AuthService', HashService],
})
export class AuthModule {}
