import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { AppService } from "./app.service";
import { UploadedFile, UploadedFiles } from "./decorators";
import { FastifyFile } from "./types/fastify.file";
import * as fs from "fs";
import { join } from "path";
import { AwsService } from "./aws/aws.service";
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly awsService: AwsService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Post()
  async fileUploadTest(@UploadedFile("profile") profile: FastifyFile, @Body("name") name: string, @UploadedFiles("images") images: FastifyFile[]) {
    //로컬에 저장하기
    const path = join(process.cwd(), "public", "assets", "images", profile.filename);
    fs.writeFileSync(path, profile.value);
    //S3업로드 하기
    console.log("name :", name);
    console.log("images :", images);
    await this.awsService.putOubjects(images);
    return { is_success: true };
  }
  @Get("file")
  async getFileByS3(@Query("key") Key: string) {
    const url = await this.awsService.getPresignedURL(Key);
    return { url };
  }
  @Get("local")
  async getFileByLocal(@Query("key") Key: string) {
    const path = "public/assets/";
    return path + Key;
  }
}
