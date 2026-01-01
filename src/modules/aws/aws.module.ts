import { Module } from '@nestjs/common';
import { S3ClientSerivce } from './s3Client.service';

@Module({
  providers: [S3ClientSerivce],
  exports: [S3ClientSerivce],
})
export class AWSModule {}
