import { Module } from "@nestjs/common";
import { AwsService } from "./aws.service";

@Module({
  imports: [],
  controllers: [],
  providers: [AwsService],
})
export class AwsModule {}
