import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MandatiService } from './mandati.service';
import { CreateMandatoDto, UpdateMandatoDto } from './dto/mandato.dto';

@Controller('api/mandati')
@UseGuards(JwtAuthGuard)
export class MandatiController {
  constructor(private readonly mandatiService: MandatiService) {}

  @Get()
  async findAll() {
    return await this.mandatiService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.mandatiService.findOne(id);
  }

  @Post()
  async create(@Body() createMandatoDto: CreateMandatoDto) {
    return await this.mandatiService.create(createMandatoDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMandatoDto: UpdateMandatoDto,
  ) {
    return await this.mandatiService.update(id, updateMandatoDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.mandatiService.remove(id);
  }
}

