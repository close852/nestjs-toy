// aws.service.ts
import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { FastifyFile } from "src/types/fastify.file";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

@Injectable()
export class AwsService {
  s3Client: S3Client;
  Bucket: string;
  temp = "temp/";
  constructor(private configService: ConfigService) {
    // AWS S3 클라이언트 초기화. 환경 설정 정보를 사용하여 AWS 리전, Access Key, Secret Key를 설정.
    this.s3Client = new S3Client({
      region: this.configService.get("AWS_DEFAULT_REGION"), // AWS Region
      credentials: {
        accessKeyId: this.configService.get("AWS_ACCESS_KEY_ID"), // Access Key
        secretAccessKey: this.configService.get("AWS_SECRET_ACCESS_KEY"), // Secret Key
      },
    });
    this.Bucket = this.configService.get("AWS_BUCKET");
  }

  putOubject(file: FastifyFile) {
    if (file == undefined) throw new BadRequestException();
    const params = { Bucket: this.Bucket, Key: this.temp + file.filename, Body: file.value };
    return this.s3Client.send(new PutObjectCommand(params));
  }
  putOubjects(files: FastifyFile[]) {
    if (files == undefined || files.length == 0) throw new BadRequestException();
    return Promise.all(
      files
        .map((file) => ({ Bucket: this.Bucket, Key: this.temp + file.filename, Body: file.value }))
        .map((params) => this.s3Client.send(new PutObjectCommand(params)))
    );
  }
  getPresignedURL(Key: string) {
    return getSignedUrl(this.s3Client, new GetObjectCommand({ Bucket: this.Bucket, Key }), { expiresIn: 300 }); //60*5
  }
}
