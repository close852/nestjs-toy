import { HttpException } from "@nestjs/common";
import { ValidationError } from "class-validator";
export class ValidationException extends HttpException {
  constructor(errors: ValidationError[]) {
    const errorObj = errors.reduce((prev, { property, constraints }: any) => ((prev[property] = [...Object.values(constraints || {})]), prev), {});
    super(errorObj, 400);
  }
}
