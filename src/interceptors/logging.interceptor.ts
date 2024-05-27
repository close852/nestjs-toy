import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { FastifyRequest } from "fastify";
import { Observable, tap } from "rxjs";
import { isArray } from "class-validator";
import _ from "underscore";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req: FastifyRequest = context.switchToHttp().getRequest();
    const now = Date.now();
    const ip = req.ip;
    const userAgent = req.headers["user-agent"];
    return next.handle().pipe(
      tap(() => {
        const contentType = req.headers["content-type"];
        const isMultipart = contentType?.includes("multipart/form-data;");
        const body = req.body;
        if (isMultipart) {
          const keys = Object.keys(body);
          for (const key of keys) {
            const item = body[key];
            if (typeof item == "object") {
              if (isArray(item)) body[key] = item.map((obj) => _.omit(obj, ["value"]));
              else body[key] = _.omit(body[key], ["value"]);
            }
          }
        }
        this.logger.log(
          `\r\n[${context.getClass().name} ${context.getHandler().name}] ` +
            `elapsed_time: ${Date.now() - now} ms \r\n` +
            JSON.stringify({ ip, url: req.url, query: req.query, body, userAgent })
        );
      })
    );
  }
}
