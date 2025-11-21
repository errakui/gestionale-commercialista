import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ClientiModule } from './clienti/clienti.module';
import { ScadenzeModule } from './scadenze/scadenze.module';
import { MovimentiModule } from './movimenti/movimenti.module';
import { NoteModule } from './note/note.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ImpostazioniModule } from './impostazioni/impostazioni.module';
import { ExportModule } from './export/export.module';
import { ServiziModule } from './servizi/servizi.module';
import { MandatiModule } from './mandati/mandati.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // ✅ Cerca .env nella directory di esecuzione (backend/)
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE || 'railway',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false, // ✅ Tabella mandati creata sul database Railway
      logging: ['error', 'warn', 'schema', 'query'], // ✅ ABILITO LOGGING COMPLETO
      ssl: process.env.DB_HOST?.includes('railway.net') ? { rejectUnauthorized: false } : false,
      extra: {
        max: 10,
        connectionTimeoutMillis: 30000, // ✅ AUMENTO A 30 secondi
        idleTimeoutMillis: 30000,
        statement_timeout: 30000,
      },
    }),
    AuthModule,
    ClientiModule,
    ScadenzeModule,
    MovimentiModule,
    NoteModule,
    DashboardModule,
    ImpostazioniModule,
    ExportModule,
    ServiziModule,
    MandatiModule,
  ],
})
export class AppModule {}

