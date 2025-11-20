import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovimentoCassa } from '../entities/movimento-cassa.entity';
import { Cliente } from '../entities/cliente.entity';
import { CategoriaMovimento } from '../entities/categoria-movimento.entity';
import { MovimentiController } from './movimenti.controller';
import { MovimentiService } from './movimenti.service';

@Module({
  imports: [TypeOrmModule.forFeature([MovimentoCassa, Cliente, CategoriaMovimento])],
  controllers: [MovimentiController],
  providers: [MovimentiService],
  exports: [MovimentiService],
})
export class MovimentiModule {}

