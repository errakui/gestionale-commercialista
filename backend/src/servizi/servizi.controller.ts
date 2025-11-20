import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ServiziService } from './servizi.service';
import { CreateServizioDto, UpdateServizioDto, GeneraMovimentoDaServizioDto } from './dto/servizio.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/servizi')
// @UseGuards(JwtAuthGuard) // TEMP DISABLED
export class ServiziController {
  constructor(private readonly serviziService: ServiziService) {}

  @Get()
  findAll(@Query('attivo') attivo?: string) {
    const attivoBoolean = attivo === 'true' ? true : attivo === 'false' ? false : undefined;
    return this.serviziService.findAll(attivoBoolean);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviziService.findOne(+id);
  }

  @Post()
  create(@Body() createServizioDto: CreateServizioDto) {
    return this.serviziService.create(createServizioDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateServizioDto: UpdateServizioDto) {
    return this.serviziService.update(+id, updateServizioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviziService.remove(+id);
  }

  @Post('genera-movimento')
  generaMovimento(@Body() dto: GeneraMovimentoDaServizioDto) {
    return this.serviziService.generaMovimentoDaServizio(dto);
  }
}

