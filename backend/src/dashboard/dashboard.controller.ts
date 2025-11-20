import { Controller, Get, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DashboardService } from './dashboard.service';

@Controller('api/dashboard')
// @UseGuards(JwtAuthGuard) // TEMP DISABLED
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('kpi')
  async getKPI() {
    return await this.dashboardService.getKPI();
  }

  @Get('scadenze-imminenti')
  async getScadenzeImminenti(@Query('giorni', ParseIntPipe) giorni?: number) {
    return await this.dashboardService.getScadenzeImminenti(giorni || 7);
  }

  @Get('scadenze-scadute')
  async getScadenzeScadute() {
    return await this.dashboardService.getScadenzeScadute();
  }

  @Get('flussi-cassa')
  async getFlussiCassaUltimi12Mesi() {
    return await this.dashboardService.getFlussiCassaUltimi12Mesi();
  }

  @Get('ultimi-movimenti')
  async getUltimiMovimenti(@Query('limit', ParseIntPipe) limit?: number) {
    return await this.dashboardService.getUltimiMovimenti(limit || 5);
  }
}

