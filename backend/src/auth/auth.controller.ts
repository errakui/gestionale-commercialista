import { Controller, Post, UseGuards, Request, Response, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Response as ExpressResponse } from 'express';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Request() req, @Response({ passthrough: true }) res: ExpressResponse) {
    console.log('🔐 [AUTH] Login richiesto per user:', req.user?.username);
    
    const result = await this.authService.login(req.user);
    console.log('✅ [AUTH] Token generato:', result.access_token.substring(0, 20) + '...');
    
    // Imposta il token in un cookie HttpOnly
    // NON specificare domain per localhost (causa problemi)
    const cookieOptions = {
      httpOnly: true,
      secure: false, // false per localhost HTTP
      sameSite: 'lax' as const,
      maxAge: 8 * 60 * 60 * 1000, // 8 ore
      path: '/',
    };
    
    console.log('🍪 [AUTH] Impostazione cookie con options:', cookieOptions);
    res.cookie('access_token', result.access_token, cookieOptions);
    console.log('✅ [AUTH] Cookie impostato! Headers:', res.getHeaders());
    console.log('🔍 [AUTH] Verifica Set-Cookie header:', res.getHeader('Set-Cookie'));

    const response = {
      message: 'Login effettuato con successo',
      user: result.user,
      access_token: result.access_token, // AGGIUNGI TOKEN NELLA RISPOSTA!
    };
    
    console.log('📤 [AUTH] Risposta inviata (con token):', { ...response, access_token: '***' });
    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req) {
    console.log('👤 [AUTH] /me richiesto');
    console.log('🍪 [AUTH] Cookies ricevuti:', req.cookies);
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
  async logout(@Response({ passthrough: true }) res: ExpressResponse) {
    console.log('🚪 [AUTH] Logout richiesto');
    res.clearCookie('access_token');
    console.log('🍪 [AUTH] Cookie cancellato');
    return { message: 'Logout effettuato con successo' };
  }
}

