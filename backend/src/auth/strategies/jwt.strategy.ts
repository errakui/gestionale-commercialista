import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // Prima prova Authorization Bearer
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        // Poi prova cookie
        (request: Request) => {
          return request?.cookies?.access_token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'default-secret-change-this',
    });
  }

  async validate(payload: any) {
    const user = await this.authService.validateToken(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return { id: payload.sub, username: payload.username, email: payload.email };
  }
}

