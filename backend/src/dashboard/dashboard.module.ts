import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovimentoCassa } from '../entities/movimento-cassa.entity';
import { Scadenza } from '../entities/scadenza.entity';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [TypeOrmModule.forFeature([MovimentoCassa, Scadenza])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}

