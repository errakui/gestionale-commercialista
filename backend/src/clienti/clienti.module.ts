import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from '../entities/cliente.entity';
import { Scadenza } from '../entities/scadenza.entity';
import { TemplateScadenza } from '../entities/template-scadenza.entity';
import { ClientiController } from './clienti.controller';
import { ClientiService } from './clienti.service';
import { ScadenzeGeneratorService } from './scadenze-generator.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cliente, Scadenza, TemplateScadenza])],
  controllers: [ClientiController],
  providers: [ClientiService, ScadenzeGeneratorService],
  exports: [ClientiService],
})
export class ClientiModule {}

