import { FastifyRequest } from "fastify";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { Strategy as JwtStrategy, ExtractJwt, VerifiedCallback } from "passport-jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UserTokenStrategy extends PassportStrategy(JwtStrategy, "user:token") {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get("SESSION_SECRET"),
      ignoreExpiration: false,
    });
  }

  async validate(payload: { id: number }, done: VerifiedCallback): Promise<any> {
    return done(null, payload);
  }
}
@Injectable()
export class UserTokenStrategy2 extends PassportStrategy(JwtStrategy, "user:token") {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([UserTokenStrategy2.extractJWT, ExtractJwt.fromAuthHeaderAsBearerToken()]),
      secretOrKey: configService.get("SESSION_SECRET"),
      ignoreExpiration: false,
    });
  }
  private static extractJWT(req: FastifyRequest): string | null {
    const token = req.headers.authorization?.split(" ")[1];
    console.log("headers > ", token);
    return token;
  }

  async validate(payload: { id: number }, done: VerifiedCallback): Promise<any> {
    return done(null, payload);
  }
}
