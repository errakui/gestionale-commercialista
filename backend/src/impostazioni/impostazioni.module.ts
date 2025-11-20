import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplateScadenza } from '../entities/template-scadenza.entity';
import { CategoriaMovimento } from '../entities/categoria-movimento.entity';
import { ImpostazioniController } from './impostazioni.controller';
import { ImpostazioniService } from './impostazioni.service';

@Module({
  imports: [TypeOrmModule.forFeature([TemplateScadenza, CategoriaMovimento])],
  controllers: [ImpostazioniController],
  providers: [ImpostazioniService],
})
export class ImpostazioniModule {}

