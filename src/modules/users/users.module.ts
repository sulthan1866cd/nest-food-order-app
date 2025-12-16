import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { MockModule } from 'src/mockDB/mocks.module';
import { UsersService } from './users.service';

@Module({
  imports: [MockModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
