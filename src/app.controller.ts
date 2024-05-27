import { Body, ClassSerializerInterceptor, Controller, Get, Logger, Post, Query, UseGuards, UseInterceptors } from "@nestjs/common";
import { AppService } from "./app.service";
import { UploadedFile, UploadedFiles } from "./decorators";
import { FastifyFile } from "./types/fastify.file";
import * as fs from "fs";
import { join } from "path";
import { AwsService } from "./aws/aws.service";
import User from "./user/user.entity";
import UserConfig from "./user/user.config.entity";
import { UserTokenAuthGuard } from "./guards";
@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly appService: AppService,
    private readonly awsService: AwsService
  ) {}

  @Get("/users")
  @UseGuards(UserTokenAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  getUser() {
    const user = new User();
    user.id = 1;
    user.name = "name";
    user.password = "password";
    const config = new UserConfig();
    config.user_id = 1;
    config.is_ok = false;
    user.config = config;

    return [user];
  }

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
