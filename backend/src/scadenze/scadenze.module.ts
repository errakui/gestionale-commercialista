import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Scadenza } from '../entities/scadenza.entity';
import { Cliente } from '../entities/cliente.entity';
import { ScadenzeController } from './scadenze.controller';
import { ScadenzeService } from './scadenze.service';

@Module({
  imports: [TypeOrmModule.forFeature([Scadenza, Cliente])],
  controllers: [ScadenzeController],
  providers: [ScadenzeService],
  exports: [ScadenzeService],
})
export class ScadenzeModule {}

