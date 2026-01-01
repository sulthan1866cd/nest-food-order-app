import {
  CreateBucketCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  ListBucketsCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3ClientSerivce {
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
  ) {
    try {
      const buckets = (await this.s3Client.send(new ListBucketsCommand()))
        .Buckets;
      if (!buckets?.some((bucket) => bucket.Name === Bucket))
        return this.s3Client.send(new CreateBucketCommand({ Bucket }));
    } catch {
      //hard debug bad code
      throw new InternalServerErrorException();
    }
  }

  async upload(
    Key: string,
    file: Buffer,
    Bucket: string = this.config.getOrThrow<string>(
      'AWS_S3_DEFAULT_BUCKET_NAME',
    ),
  ) {
    try {
      await this.s3Client.send(
        new PutObjectCommand({ Bucket, Key, Body: file }),
      );
      return getSignedUrl(this.s3Client, new GetObjectCommand({ Bucket, Key }));
    } catch {
      //hard debug bad code
      throw new InternalServerErrorException();
    }
  }

  delete(
    Key: string,
    Bucket: string = this.config.getOrThrow<string>(
      'AWS_S3_DEFAULT_BUCKET_NAME',
    ),
  ) {
    try {
      return this.s3Client.send(new DeleteObjectCommand({ Bucket, Key }));
    } catch {
      //hard debug bad code
      throw new InternalServerErrorException();
    }
  }
}
