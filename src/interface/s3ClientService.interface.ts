import {
  CreateBucketCommandOutput,
  DeleteObjectCommandOutput,
} from '@aws-sdk/client-s3';

export interface IS3ClientService {
  createBucket: (Bucket?: string) => Promise<CreateBucketCommandOutput | null>;
  upload: (Key: string, file: Buffer, Bucket?: string) => Promise<string>;
  delete: (Key: string, Bucket?: string) => Promise<DeleteObjectCommandOutput>;
}
