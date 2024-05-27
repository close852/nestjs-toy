import { FastifyRequest } from "fastify";
import { BadRequestException, ExecutionContext, createParamDecorator } from "@nestjs/common";
import { isArray } from "class-validator";

export const UploadedFiles = createParamDecorator(async (data: any, ctx: ExecutionContext) => {
  const req: FastifyRequest = ctx.switchToHttp().getRequest();
  const result: any = req.body;
  const target = result[data];
  console.log("target >>>", target);
  if (target) return target.filter((item) => item.type == "file").map((item) => toDto(item));
  return undefined;
});
export const UploadedFile = createParamDecorator(async (data: any, ctx: ExecutionContext) => {
  const req: FastifyRequest = ctx.switchToHttp().getRequest();
  if (!req.isMultipart()) {
    throw new BadRequestException("asdasd");
  }
  const result: any = req.body;
  const target = result[data];
  if (target && !isArray(target)) {
    return toDto(target);
  }
  return undefined;
});

function toDto(raw: any) {
  return {
    type: raw.type,
    data: raw._buf,
    filename: raw.filename,
    mimetype: raw.mimetype,
  };
}
/*
  data: Buffer;
  filename: string;
  encoding: string;
  mimetype: string;
  limit: boolean;

*/
