import { Controller, Get, Query, UseGuards, Response } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ExportService } from './export.service';
import { Response as ExpressResponse } from 'express';

@Controller('api/export')
// @UseGuards(JwtAuthGuard) // TEMP DISABLED
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Get('clienti')
  async exportClienti(
    @Query('format') format: 'csv' | 'excel' = 'csv',
    @Response() res: ExpressResponse
  ) {
    const buffer = await this.exportService.exportClienti(format);

    const filename = `clienti_${new Date().toISOString().split('T')[0]}`;
    const contentType = format === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    const extension = format === 'csv' ? 'csv' : 'xlsx';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}.${extension}"`);
    res.send(buffer);
  }

  @Get('movimenti')
  async exportMovimenti(
    @Query('format') format: 'csv' | 'excel' = 'csv',
    @Query() filters: any,
    @Response() res: ExpressResponse
  ) {
    const buffer = await this.exportService.exportMovimenti(filters, format);

    const filename = `movimenti_${new Date().toISOString().split('T')[0]}`;
    const contentType = format === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    const extension = format === 'csv' ? 'csv' : 'xlsx';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}.${extension}"`);
    res.send(buffer);
  }

  @Get('scadenze')
  async exportScadenze(
    @Query('format') format: 'csv' | 'excel' = 'csv',
    @Query() filters: any,
    @Response() res: ExpressResponse
  ) {
    const buffer = await this.exportService.exportScadenze(filters, format);

    const filename = `scadenze_${new Date().toISOString().split('T')[0]}`;
    const contentType = format === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    const extension = format === 'csv' ? 'csv' : 'xlsx';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}.${extension}"`);
    res.send(buffer);
  }
}

