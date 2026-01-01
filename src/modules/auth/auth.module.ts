import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { MockModule } from 'src/mocks/mocks.module';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthMockService } from 'src/mocks/mockService/auth.mockService';
import { ConfigService } from '@nestjs/config';

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
    AuthService,
    AuthMockService,
    {
      provide: 'AuthService',
      inject: [ConfigService, AuthService, AuthMockService],
      useFactory: (
        config: ConfigService,
        auth: AuthService,
        mockAuth: AuthMockService,
      ) => {
        return config.get<string>('AUTH_PROFILE') === 'mock' ? mockAuth : auth;
      },
    },
  ],
  controllers: [AuthController],
  exports: ['AuthService'],
})
export class AuthModule {}
