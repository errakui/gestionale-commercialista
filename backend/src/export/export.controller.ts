import { Controller, Get, Query, UseGuards, Response, Param, Post, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ExportService } from './export.service';
import { Response as ExpressResponse } from 'express';

@Controller('api/export')
@UseGuards(JwtAuthGuard) // ✅ RIATTIVATO
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Get('clienti')
  async exportClienti(
    @Query('format') format: 'csv' | 'excel' = 'csv',
    @Response() res: ExpressResponse
  ) {
    try {
      console.log('📥 [EXPORT] Richiesta export clienti, formato:', format);
      const buffer = await this.exportService.exportClienti(format);

      const filename = `clienti_${new Date().toISOString().split('T')[0]}`;
      const contentType = format === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      const extension = format === 'csv' ? 'csv' : 'xlsx';

      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.${extension}"`);
      res.send(buffer);
      console.log('✅ [EXPORT] Export clienti completato');
    } catch (error) {
      console.error('❌ [EXPORT] Errore export clienti:', error);
      res.status(500).json({ 
        statusCode: 500, 
        message: 'Errore durante l\'export dei clienti', 
        error: error.message 
      });
    }
  }

  @Get('movimenti')
  async exportMovimenti(
    @Query('format') format: 'csv' | 'excel' = 'csv',
    @Query() filters: any,
    @Response() res: ExpressResponse
  ) {
    try {
      console.log('📥 [EXPORT] Richiesta export movimenti, formato:', format, 'filtri:', filters);
      const buffer = await this.exportService.exportMovimenti(filters, format);

      const filename = `movimenti_${new Date().toISOString().split('T')[0]}`;
      const contentType = format === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      const extension = format === 'csv' ? 'csv' : 'xlsx';

      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.${extension}"`);
      res.send(buffer);
      console.log('✅ [EXPORT] Export movimenti completato');
    } catch (error) {
      console.error('❌ [EXPORT] Errore export movimenti:', error);
      res.status(500).json({ 
        statusCode: 500, 
        message: 'Errore durante l\'export dei movimenti', 
        error: error.message 
      });
    }
  }

  @Get('scadenze')
  async exportScadenze(
    @Query('format') format: 'csv' | 'excel' = 'csv',
    @Query() filters: any,
    @Response() res: ExpressResponse
  ) {
    try {
      console.log('📥 [EXPORT] Richiesta export scadenze, formato:', format, 'filtri:', filters);
      const buffer = await this.exportService.exportScadenze(filters, format);

      const filename = `scadenze_${new Date().toISOString().split('T')[0]}`;
      const contentType = format === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      const extension = format === 'csv' ? 'csv' : 'xlsx';

      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.${extension}"`);
      res.send(buffer);
      console.log('✅ [EXPORT] Export scadenze completato');
    } catch (error) {
      console.error('❌ [EXPORT] Errore export scadenze:', error);
      res.status(500).json({ 
        statusCode: 500, 
        message: 'Errore durante l\'export delle scadenze', 
        error: error.message 
      });
    }
  }

  @Get('cliente/:id')
  async exportCliente(
    @Param('id') clienteId: number,
    @Query('format') format: 'excel' | 'pdf' = 'excel',
    @Response() res: ExpressResponse
  ) {
    try {
      console.log('📥 [EXPORT] Richiesta export cliente:', clienteId, 'formato:', format);
      const buffer = await this.exportService.exportCliente(clienteId, format);

      const filename = `cliente_${clienteId}_${new Date().toISOString().split('T')[0]}`;
      const contentType = format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      const extension = format === 'pdf' ? 'pdf' : 'xlsx';

      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.${extension}"`);
      res.send(buffer);
      console.log('✅ [EXPORT] Export cliente completato');
    } catch (error) {
      console.error('❌ [EXPORT] Errore export cliente:', error);
      res.status(500).json({ 
        statusCode: 500, 
        message: 'Errore durante l\'export del cliente', 
        error: error.message 
      });
    }
  }

  @Post('mandato')
  @UseGuards(JwtAuthGuard)
  async exportMandato(
    @Body() body: any,
    @Response() res: ExpressResponse
  ) {
    try {
      console.log('📥 [EXPORT] Richiesta export mandato');
      const buffer = await this.exportService.exportMandato(body);

      const filename = `mandato_${new Date().toISOString().split('T')[0]}`;

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.pdf"`);
      res.send(buffer);
      console.log('✅ [EXPORT] Export mandato completato');
    } catch (error) {
      console.error('❌ [EXPORT] Errore export mandato:', error);
      res.status(500).json({ 
        statusCode: 500, 
        message: 'Errore durante l\'export del mandato', 
        error: error.message 
      });
    }
  }
}

