import { Module } from '@nestjs/common';
import { S3ClientService } from './s3Client.service';
import { S3ClientMockService } from 'src/mocks/mockService/s3Client.mockService';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    S3ClientService,
    S3ClientMockService,
    {
      provide: 'S3ClientService',
      inject: [ConfigService, S3ClientService, S3ClientMockService],
      useFactory: (
        config: ConfigService,
        s3ClientService: S3ClientService,
        s3ClientMockService: S3ClientMockService,
      ) => {
        return config.get<string>('S3_SERVICE_PROFILE') === 'mock'
          ? s3ClientMockService
          : s3ClientService;
      },
    },
  ],
  exports: ['S3ClientService'],
})
export class AWSModule {}
