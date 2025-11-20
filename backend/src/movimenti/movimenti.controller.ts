import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MovimentiService } from './movimenti.service';
import { CreateMovimentoDto, UpdateMovimentoDto, FilterMovimentoDto } from './dto/movimento.dto';

@Controller('api/movimenti')
// @UseGuards(JwtAuthGuard) // TEMP DISABLED
export class MovimentiController {
  constructor(private readonly movimentiService: MovimentiService) {}

  @Get()
  async findAll(@Query() filters: FilterMovimentoDto) {
    return await this.movimentiService.findAll(filters);
  }

  @Get('summary')
  async getSummary(@Query() filters: FilterMovimentoDto) {
    return await this.movimentiService.getSummary(filters);
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
    return await this.movimentiService.create(createMovimentoDto);
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

