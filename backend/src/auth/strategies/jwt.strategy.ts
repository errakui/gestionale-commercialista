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
      secretOrKey: 'chiave_segreta_test_locale_123456789', // ✅ SECRET CORRETTA HARDCODATA
    });
  }

  async validate(payload: any) {
    console.log('🔍 [JWT] Validating token payload:', { sub: payload.sub, username: payload.username });
    
    try {
      const user = await this.authService.validateToken(payload.sub);
      if (!user) {
        console.error('❌ [JWT] User not found for payload.sub:', payload.sub);
        throw new UnauthorizedException('User not found');
      }
      console.log('✅ [JWT] Token validated for user:', user.username);
      return { id: payload.sub, username: payload.username, email: payload.email };
    } catch (error) {
      console.error('❌ [JWT] Validation error:', error.message);
      throw new UnauthorizedException(error.message);
    }
  }
}

