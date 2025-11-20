import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from '../entities/cliente.entity';
import { MovimentoCassa } from '../entities/movimento-cassa.entity';
import { Scadenza } from '../entities/scadenza.entity';
import { ExportController } from './export.controller';
import { ExportService } from './export.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cliente, MovimentoCassa, Scadenza])],
  controllers: [ExportController],
  providers: [ExportService],
})
export class ExportModule {}

