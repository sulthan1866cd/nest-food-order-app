import {
  CreateBucketCommand,
  CreateBucketCommandOutput,
  DeleteObjectCommand,
  DeleteObjectCommandOutput,
  GetObjectCommand,
  ListBucketsCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IS3ClientService } from 'src/interface/s3ClientService.interface';

@Injectable()
export class S3ClientService implements IS3ClientService {
  private s3Client: S3Client;
  constructor(private readonly config: ConfigService) {
    this.s3Client = new S3Client({
      region: config.getOrThrow<string>('AWS_REGION'),
      endpoint: config.getOrThrow<string>('AWS_S3_ENDPOINT'),
      forcePathStyle: true,
      credentials: {
        accessKeyId: config.getOrThrow<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: config.getOrThrow<string>('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  async createBucket(
    Bucket: string = this.config.getOrThrow<string>(
      'AWS_S3_DEFAULT_BUCKET_NAME',
    ),
  ): Promise<CreateBucketCommandOutput | null> {
    try {
      const buckets = (await this.s3Client.send(new ListBucketsCommand()))
        .Buckets;
      if (!buckets?.some((bucket) => bucket.Name === Bucket))
        return this.s3Client.send(new CreateBucketCommand({ Bucket }));
      return null;
    } catch {
      throw new InternalServerErrorException('Failed to create bucket');
    }
  }

  async upload(
    Key: string,
    file: Buffer,
    Bucket: string = this.config.getOrThrow<string>(
      'AWS_S3_DEFAULT_BUCKET_NAME',
    ),
  ): Promise<string> {
    try {
      await this.s3Client.send(
        new PutObjectCommand({ Bucket, Key, Body: file }),
      );
      return getSignedUrl(this.s3Client, new GetObjectCommand({ Bucket, Key }));
    } catch {
      throw new InternalServerErrorException('Failed to upload file');
    }
  }

  delete(
    Key: string,
    Bucket: string = this.config.getOrThrow<string>(
      'AWS_S3_DEFAULT_BUCKET_NAME',
    ),
  ): Promise<DeleteObjectCommandOutput> {
    try {
      return this.s3Client.send(new DeleteObjectCommand({ Bucket, Key }));
    } catch {
      throw new InternalServerErrorException('Failed to delete file');
    }
  }
}
