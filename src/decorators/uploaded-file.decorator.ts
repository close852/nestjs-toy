import { FastifyRequest } from "fastify";
import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { FastifyFile } from "src/types/fastify.file";
import { isArray } from "class-validator";

export const UploadedFile = createParamDecorator((data, ctx: ExecutionContext) => {
  const req: FastifyRequest = ctx.switchToHttp().getRequest();
  const result: any = req.body;
  const target: FastifyFile = result[data];
  if (target && !isArray(target)) return target;
  return undefined;
});
