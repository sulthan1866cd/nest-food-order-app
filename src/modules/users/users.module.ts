import { forwardRef, Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { MockModule } from 'src/mocks/mocks.module';
import { UsersService } from './users.service';
import { AuthModule } from '../auth/auth.module';
import { AdminsController } from './admins.controller';
import { SuperAdminsController } from './superAdmins.controller';
import { ShopsModule } from '../shops/shops.module';

@Module({
  imports: [MockModule, forwardRef(() => AuthModule), ShopsModule],
  controllers: [CustomersController, AdminsController, SuperAdminsController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
