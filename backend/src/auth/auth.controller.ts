import { Controller, Post, UseGuards, Request, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Request() req) {
    console.log('🔐 [AUTH] Login richiesto per user:', req.user?.username);
    
    const result = await this.authService.login(req.user);
    console.log('✅ [AUTH] Token generato:', result.access_token.substring(0, 20) + '...');

    const response = {
      message: 'Login effettuato con successo',
      user: result.user,
      access_token: result.access_token,
    };
    
    console.log('📤 [AUTH] Risposta login:', { ...response, access_token: '***' });
    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req) {
    console.log('👤 [AUTH] /me richiesto');
    console.log('🔑 [AUTH] Authorization header:', req.headers.authorization);
    console.log('👤 [AUTH] User autenticato:', req.user?.username);
    
    const response = {
      user: {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
      },
    };
    
    console.log('📤 [AUTH] /me risposta:', response);
    return response;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout() {
    console.log('🚪 [AUTH] Logout richiesto');
    return { message: 'Logout effettuato con successo' };
  }
}

