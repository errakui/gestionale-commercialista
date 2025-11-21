import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MovimentiService } from './movimenti.service';
import { CreateMovimentoDto, UpdateMovimentoDto, FilterMovimentoDto } from './dto/movimento.dto';

@Controller('api/movimenti')
@UseGuards(JwtAuthGuard) // ✅ RIATTIVATO
export class MovimentiController {
  constructor(private readonly movimentiService: MovimentiService) {}

  @Get()
  async findAll(@Query() filters: FilterMovimentoDto) {
    console.log('💰 [MOVIMENTI] GET /movimenti chiamato con filtri:', filters);
    const result = await this.movimentiService.findAll(filters);
    console.log(`✅ [MOVIMENTI] Trovati ${result.length} movimenti`);
    return result;
  }

  @Get('summary')
  async getSummary(@Query() filters: FilterMovimentoDto) {
    console.log('📊 [MOVIMENTI] GET /movimenti/summary chiamato con filtri:', filters);
    const result = await this.movimentiService.getSummary(filters);
    console.log('✅ [MOVIMENTI] Summary calcolato:', result);
    return result;
  }

  @Get('trend')
  async getMonthlyTrend(
    @Query('anno', ParseIntPipe) anno: number,
    @Query('clienteId', ParseIntPipe) clienteId?: number
  ) {
    return await this.movimentiService.getMonthlyTrend(anno, clienteId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.movimentiService.findOne(id);
  }

  @Post()
  async create(@Body() createMovimentoDto: CreateMovimentoDto) {
    console.log('➕ [MOVIMENTI] POST /movimenti - Creazione movimento:', createMovimentoDto);
    const result = await this.movimentiService.create(createMovimentoDto);
    console.log('✅ [MOVIMENTI] Movimento creato con ID:', result.id);
    return result;
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMovimentoDto: UpdateMovimentoDto
  ) {
    return await this.movimentiService.update(id, updateMovimentoDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.movimentiService.remove(id);
  }
}

