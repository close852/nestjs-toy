import { Body, Controller, Get, Post } from "@nestjs/common";
import { AppService } from "./app.service";
import { UploadedFile, UploadedFiles } from "./decorators";
import { FastifyFile } from "./types/fastify.file";
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Post()
  async fileUploadTest(
    @UploadedFile("profile") profile: FastifyFile,
    @Body("name") name: string,
    @UploadedFiles("images") images: FastifyFile[]
  ): Promise<string> {
    console.log("profile :", profile);
    console.log("name :", name);
    console.log("images :", images);

    return "body";
  }
}
