import { isArray } from "class-validator";
import { FastifyRequest } from "fastify";
import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { FastifyFile } from "src/types/fastify.file";

export const UploadedFiles = createParamDecorator((data, ctx: ExecutionContext) => {
  const req: FastifyRequest = ctx.switchToHttp().getRequest();
  const result: any = req.body;
  const target: FastifyFile[] = result[data];
  if (target) {
    return isArray(target) ? target : [target];
  }
  return undefined;
});
