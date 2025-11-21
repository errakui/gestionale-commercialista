import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ScadenzeService } from './scadenze.service';
import { CreateScadenzaDto, UpdateScadenzaDto, FilterScadenzaDto } from './dto/scadenza.dto';

@Controller('api/scadenze')
@UseGuards(JwtAuthGuard) // ✅ RIATTIVATO
export class ScadenzeController {
  constructor(private readonly scadenzeService: ScadenzeService) {}

  @Get()
  async findAll(@Query() filters: FilterScadenzaDto) {
    return await this.scadenzeService.findAll(filters);
  }

  @Get('imminenti')
  async findImminenti(@Query('giorni', ParseIntPipe) giorni?: number) {
    return await this.scadenzeService.findImminenti(giorni || 7);
  }

  @Get('scadute')
  async findScadute() {
    return await this.scadenzeService.findScadute();
  }

  @Get('calendar')
  async getCalendarData(
    @Query('mese', ParseIntPipe) mese: number,
    @Query('anno', ParseIntPipe) anno: number
  ) {
    return await this.scadenzeService.getCalendarData(mese, anno);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.scadenzeService.findOne(id);
  }

  @Post()
  async create(@Body() createScadenzaDto: CreateScadenzaDto) {
    return await this.scadenzeService.create(createScadenzaDto);
  }

  @Post(':id/completa')
  async completa(@Param('id', ParseIntPipe) id: number) {
    return await this.scadenzeService.completa(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateScadenzaDto: UpdateScadenzaDto
  ) {
    return await this.scadenzeService.update(id, updateScadenzaDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.scadenzeService.remove(id);
  }
}

