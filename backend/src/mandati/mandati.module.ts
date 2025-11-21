import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mandato } from '../entities/mandato.entity';
import { Cliente } from '../entities/cliente.entity';
import { MandatiController } from './mandati.controller';
import { MandatiService } from './mandati.service';

@Module({
  imports: [TypeOrmModule.forFeature([Mandato, Cliente])],
  controllers: [MandatiController],
  providers: [MandatiService],
  exports: [MandatiService],
})
export class MandatiModule {}

