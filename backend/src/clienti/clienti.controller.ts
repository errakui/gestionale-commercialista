import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ClientiService } from './clienti.service';
import { CreateClienteDto, UpdateClienteDto, FilterClienteDto } from './dto/cliente.dto';

@Controller('api/clienti')
@UseGuards(JwtAuthGuard) // ✅ RIATTIVATO
export class ClientiController {
  constructor(private readonly clientiService: ClientiService) {}

  @Get()
  async findAll(@Query() filters: FilterClienteDto) {
    console.log('📋 [CLIENTI] GET /clienti chiamato con filtri:', filters);
    try {
      const result = await this.clientiService.findAll(filters);
      console.log('✅ [CLIENTI] Trovati', result?.length || 0, 'clienti');
      return result;
    } catch (error) {
      console.error('❌ [CLIENTI] Errore:', error);
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.clientiService.findOne(id);
  }

  @Get(':id/statistics')
  async getStatistics(
    @Param('id', ParseIntPipe) id: number,
    @Query('year', ParseIntPipe) year?: number
  ) {
    return await this.clientiService.getStatistics(id, year);
  }

  @Post()
  async create(@Body() createClienteDto: CreateClienteDto) {
    return await this.clientiService.create(createClienteDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClienteDto: UpdateClienteDto
  ) {
    return await this.clientiService.update(id, updateClienteDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.clientiService.remove(id);
  }
}

