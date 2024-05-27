import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { FastifyRequest } from "fastify";
import { map, Observable } from "rxjs";
import { isNumber } from "underscore";

@Injectable()
export class SuccessInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx: FastifyRequest = context.switchToHttp().getRequest();
    const method = ctx.method.toUpperCase();
    if (method === "DELETE" || method === "PUT" || method === "PATCH") {
      return next.handle().pipe(
        map((data) => {
          if (isNumber(data?.affected)) {
            return { is_suceess: !!data?.affected };
          }
          return data;
        })
      );
    }
    return next.handle().pipe(map((data) => data));
  }
}
