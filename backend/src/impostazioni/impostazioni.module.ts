import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplateScadenza } from '../entities/template-scadenza.entity';
import { CategoriaMovimento } from '../entities/categoria-movimento.entity';
import { ImpostazioniGenerali } from '../entities/impostazioni-generali.entity';
import { ImpostazioniController } from './impostazioni.controller';
import { ImpostazioniService } from './impostazioni.service';

@Module({
  imports: [TypeOrmModule.forFeature([TemplateScadenza, CategoriaMovimento, ImpostazioniGenerali])],
  controllers: [ImpostazioniController],
  providers: [ImpostazioniService],
  exports: [ImpostazioniService],
})
export class ImpostazioniModule {}

