import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Utente } from '../entities/utente.entity';

@Injectable()
export class AuthService {
  private loginAttempts: Map<string, { count: number; lastAttempt: Date }> = new Map();
  private readonly MAX_ATTEMPTS = 5;
  private readonly BLOCK_DURATION = 5 * 60 * 1000; // 5 minuti

  constructor(
    @InjectRepository(Utente)
    private utenteRepository: Repository<Utente>,
    private jwtService: JwtService,
  ) {}

  async validateUser(usernameOrEmail: string, password: string): Promise<any> {
    // Verifica blocco tentativi
    const attempts = this.loginAttempts.get(usernameOrEmail);
    if (attempts && attempts.count >= this.MAX_ATTEMPTS) {
      const timeSinceLastAttempt = Date.now() - attempts.lastAttempt.getTime();
      if (timeSinceLastAttempt < this.BLOCK_DURATION) {
        const remainingTime = Math.ceil((this.BLOCK_DURATION - timeSinceLastAttempt) / 1000 / 60);
        throw new UnauthorizedException(
          `Troppi tentativi falliti. Riprova tra ${remainingTime} minuti.`
        );
      } else {
        // Reset dopo il periodo di blocco
        this.loginAttempts.delete(usernameOrEmail);
      }
    }

    const user = await this.utenteRepository.findOne({
      where: [
        { username: usernameOrEmail, attivo: true },
        { email: usernameOrEmail, attivo: true },
      ],
    });

    if (!user) {
      this.recordFailedAttempt(usernameOrEmail);
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      this.recordFailedAttempt(usernameOrEmail);
      return null;
    }

    // Reset tentativi in caso di successo
    this.loginAttempts.delete(usernameOrEmail);

    const { passwordHash, ...result } = user;
    return result;
  }

  private recordFailedAttempt(identifier: string) {
    const attempts = this.loginAttempts.get(identifier);
    if (attempts) {
      this.loginAttempts.set(identifier, {
        count: attempts.count + 1,
        lastAttempt: new Date(),
      });
    } else {
      this.loginAttempts.set(identifier, {
        count: 1,
        lastAttempt: new Date(),
      });
    }
  }

  async login(user: any) {
    const payload = { sub: user.id, username: user.username, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  }

  async validateToken(userId: number): Promise<Utente> {
    console.log('🔍 [AUTH] validateToken chiamato per userId:', userId);
    
    const user = await this.utenteRepository.findOne({
      where: { id: userId, attivo: true },
    });

    if (!user) {
      console.error('❌ [AUTH] Utente non trovato o non attivo per userId:', userId);
      throw new UnauthorizedException('Utente non valido');
    }

    console.log('✅ [AUTH] Utente trovato:', user.username);
    return user;
  }
}

