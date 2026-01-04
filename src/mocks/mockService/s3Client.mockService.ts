/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  CreateBucketCommandOutput,
  DeleteObjectCommandOutput,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { IS3ClientService } from 'src/interface/s3ClientService.interface';
import { getMockFoodItem } from '../mockDatas/foodItems.stub';

@Injectable()
export class S3ClientMockService implements IS3ClientService {
  createBucket(Bucket?: string): Promise<CreateBucketCommandOutput | null> {
    const res: CreateBucketCommandOutput = { $metadata: {} };
    return Promise.resolve(res);
  }
  upload(Key: string, file: Buffer, Bucket?: string): Promise<string> {
    return Promise.resolve(getMockFoodItem().image);
  }
  delete(Key: string, Bucket?: string): Promise<DeleteObjectCommandOutput> {
    const res: DeleteObjectCommandOutput = { $metadata: {} };
    return Promise.resolve(res);
  }
}
