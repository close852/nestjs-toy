import { INestApplication, ValidationPipe } from "@nestjs/common";
import { NestFastifyApplication } from "@nestjs/platform-fastify";
import fastifyCookie from "@fastify/cookie";
import fastifySession from "@fastify/session";
import cors, { FastifyCorsOptions } from "@fastify/cors";
import multipart from "@fastify/multipart";
import { join } from "path";
import { ValidationError } from "class-validator";
import { ValidationException } from "./exceptions/validation.exception";
import { HttpAdapterHost } from "@nestjs/core";
import { AllExceptionsFilter, ValidationExceptionFilter } from "./filters";
import { LoggingInterceptor, SuccessInterceptor } from "./interceptors";

export async function middleware(app: NestFastifyApplication): Promise<INestApplication> {
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalInterceptors(new SuccessInterceptor(), new LoggingInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost), new ValidationExceptionFilter(httpAdapterHost));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // dto 전환
      transformOptions: { enableImplicitConversion: true },
      whitelist: true, // only required validator output
      validateCustomDecorators: true, //custom decorators, validator too like ParamAndBody
      exceptionFactory: (errors: ValidationError[]) => new ValidationException(errors),
    })
  );
  app.register(multipart, {
    attachFieldsToBody: "keyValues",
    onFile: async (part: any) => {
      //part.value에 값을 넣으면 됨
      //filename이 필요없고 바로 buffer를 사용하려면
      // part.value = await part.toBuffer()
      part.value = { filename: part.filename, mimetype: part.mimetype, encoding: part.encoding, value: await part.toBuffer() };
      // set `part.value` to specify the request body value
    },
    // addToBody: true,
    limits: {
      fieldNameSize: 100, // Max field name size in bytes
      fieldSize: 100, // Max field value size in bytes
      // fields: 10, // Max number of non-file fields
      fileSize: 300 * 1024 * 1024, // For multipart forms, the max file size in bytes
      files: 10, // Max number of file fields
      headerPairs: 2000, // Max number of header key=>value pairs
    },
  });
  ["/public/assets"].forEach((prefix) => app.useStaticAssets({ root: join(process.cwd(), prefix), prefix }));

  app.register(cors, () => {
    return (_: any, callback: (error: Error | null, options: FastifyCorsOptions) => void) => {
      const corsOption: FastifyCorsOptions = { origin: true, credentials: true };
      return callback(null, corsOption);
    };
  });

  app.register(fastifyCookie, { secret: process.env.SESSION_SECRET, parseOptions: { httpOnly: true } });
  app.register(fastifySession, { secret: process.env.SESSION_SECRET, cookie: { secure: false, httpOnly: true } });
  return app;
}
