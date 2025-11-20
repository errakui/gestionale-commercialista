import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServizioPredefinito } from '../entities/servizio-predefinito.entity';
import { MovimentoCassa } from '../entities/movimento-cassa.entity';
import { Cliente } from '../entities/cliente.entity';
import { ServiziService } from './servizi.service';
import { ServiziController } from './servizi.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServizioPredefinito, MovimentoCassa, Cliente]),
  ],
  controllers: [ServiziController],
  providers: [ServiziService],
  exports: [ServiziService],
})
export class ServiziModule {}

