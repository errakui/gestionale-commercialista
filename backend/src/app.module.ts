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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE || 'gestionale_commercialista',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
      logging: process.env.NODE_ENV === 'development',
      charset: 'utf8mb4',
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
  ],
})
export class AppModule {}

