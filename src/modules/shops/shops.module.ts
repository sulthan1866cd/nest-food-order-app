import { Module } from '@nestjs/common';
import { ShopsService } from './shops.service';
import { ShopsController } from './shops.controller';
import { MockModule } from 'src/mocks/mocks.module';
import { AuthModule } from '../auth/auth.module';
import { MallsModule } from '../malls/malls.module';

@Module({
  imports: [MockModule, AuthModule, MallsModule],
  controllers: [ShopsController],
  providers: [ShopsService],
  exports: [ShopsService],
})
export class ShopsModule {}
