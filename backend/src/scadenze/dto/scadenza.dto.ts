import { IsString, IsDateString, IsEnum, IsOptional, IsInt, Min, Max } from 'class-validator';
import { StatoScadenza } from '../../entities/scadenza.entity';

export class CreateScadenzaDto {
  @IsOptional()
  @IsInt()
  clienteId?: number;

  @IsDateString()
  dataScadenza: string;

  @IsString()
  tipoScadenza: string;

  @IsOptional()
  @IsEnum(StatoScadenza)
  stato?: StatoScadenza;

  @IsOptional()
  @IsString()
  note?: string;
}

export class UpdateScadenzaDto {
  @IsOptional()
  @IsInt()
  clienteId?: number;

  @IsOptional()
  @IsDateString()
  dataScadenza?: string;

  @IsOptional()
  @IsString()
  tipoScadenza?: string;

  @IsOptional()
  @IsEnum(StatoScadenza)
  stato?: StatoScadenza;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsInt()
  movimentoCassaId?: number;
}

export class FilterScadenzaDto {
  @IsOptional()
  @IsInt()
  clienteId?: number;

  @IsOptional()
  @IsEnum(StatoScadenza)
  stato?: StatoScadenza;

  @IsOptional()
  @IsString()
  tipoScadenza?: string;

  @IsOptional()
  @IsDateString()
  dataInizio?: string;

  @IsOptional()
  @IsDateString()
  dataFine?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  mese?: number;

  @IsOptional()
  @IsInt()
  @Min(2000)
  @Max(2100)
  anno?: number;
}

