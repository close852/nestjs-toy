import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { middleware } from "./app.middleware";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { winstonLogger } from "./logger/winston.utils";

async function bootstrap() {
  const PORT = process.env.PORT || 4000;
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), { logger: winstonLogger });

  middleware(app);

  //https://stackoverflow.com/questions/14043926/node-js-connect-only-works-on-localhost
  await app.listen(PORT, "0.0.0.0");
  console.log(`http://localhost:${PORT}`);
}
bootstrap();
