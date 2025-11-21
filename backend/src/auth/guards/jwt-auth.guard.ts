import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    console.log('🛡️ [GUARD] JwtAuthGuard chiamato per:', request.url);
    console.log('🛡️ [GUARD] Authorization header:', request.headers.authorization);
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    console.log('🛡️ [GUARD] handleRequest:', { err: err?.message, user: user?.username, info });
    
    if (err || !user) {
      console.error('❌ [GUARD] Autenticazione fallita:', err?.message || info);
      throw err || new Error('Unauthorized');
    }
    
    console.log('✅ [GUARD] Autenticazione riuscita per:', user.username);
    return user;
  }
}

