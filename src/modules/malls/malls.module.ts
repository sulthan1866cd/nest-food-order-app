import { Module } from '@nestjs/common';
import { MallsService } from './malls.service';
import { MallsController } from './malls.controller';
import { MockModule } from 'src/mocks/mocks.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [MockModule, AuthModule],
  controllers: [MallsController],
  providers: [MallsService],
  exports: [MallsService],
})
export class MallsModule {}
