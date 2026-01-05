import { forwardRef, Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { MockModule } from 'src/mocks/mocks.module';
import { UsersService } from './users.service';
import { AuthModule } from '../auth/auth.module';
import { AdminsController } from './admins.controller';

@Module({
  imports: [MockModule, forwardRef(() => AuthModule)],
  controllers: [CustomersController, AdminsController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
