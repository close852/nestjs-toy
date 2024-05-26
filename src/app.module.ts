import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";

const NODE_ENV = process.env.NODE_ENV;
const envFilePath = ".env" + (NODE_ENV == "local" ? ".local" : NODE_ENV == "development" ? ".development" : "");
@Module({
  imports: [ConfigModule.forRoot({ envFilePath })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
