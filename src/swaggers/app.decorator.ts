import { applyDecorators } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import User from "src/user/user.entity";
const tags = "App";

export const getUsersSchema = () => {
  return applyDecorators(
    ApiOperation({ summary: "사용자 조회 샘플(ClassSerializerInterceptor)" }),
    ApiTags(tags),
    ApiOkResponse({ type: User, isArray: true })
  );
};
export const getHelloSchema = () => {
  return applyDecorators(ApiOperation({ summary: "get hello" }), ApiTags(tags));
};
export const postFileUploadSchema = () => {
  return applyDecorators(
    ApiOperation({ summary: "단일 이미지(profile), 속성 필드(name), 다중이미지 업로드(images) 테스트 API" }),
    ApiTags(tags),
    ApiConsumes("multipart/form-data"),
    ApiBody({
      schema: {
        type: "object",
        properties: {
          profile: { type: "string", format: "binary", description: "프로필 이미지" },
          name: { type: "string", description: "사용지 이름" },
          images: { type: "array", items: { type: "string", format: "binary", description: "이미지들" } },
        },
      },
    })
  );
};
export const getFileByS3Schema = () => {
  return applyDecorators(
    ApiOperation({ summary: "s3 업로드한 파일 조회" }),
    ApiTags(tags),
    ApiQuery({ name: "key", type: "string", description: "s3 file key" })
  );
};
export const getFileByLocalSchema = () => {
  return applyDecorators(
    ApiOperation({ summary: "local에 업로드한 파일 조회" }),
    ApiTags(tags),
    ApiQuery({ name: "key", type: "string", description: "upoload한 파일경로" })
  );
};
