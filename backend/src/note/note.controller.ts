import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NoteService } from './note.service';
import { CreateNotaDto, UpdateNotaDto } from './dto/nota.dto';

@Controller('api')
// @UseGuards(JwtAuthGuard) // TEMP DISABLED
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Get('clienti/:clienteId/note')
  async findByCliente(@Param('clienteId', ParseIntPipe) clienteId: number) {
    return await this.noteService.findByCliente(clienteId);
  }

  @Get('note/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.noteService.findOne(id);
  }

  @Post('clienti/:clienteId/note')
  async create(
    @Param('clienteId', ParseIntPipe) clienteId: number,
    @Body() createNotaDto: CreateNotaDto
  ) {
    return await this.noteService.create(clienteId, createNotaDto);
  }

  @Put('note/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNotaDto: UpdateNotaDto
  ) {
    return await this.noteService.update(id, updateNotaDto);
  }

  @Delete('note/:id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.noteService.remove(id);
  }
}

