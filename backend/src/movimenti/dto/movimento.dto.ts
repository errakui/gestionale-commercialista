import { IsString, IsDateString, IsEnum, IsOptional, IsInt, IsNumber, Min, Max, MaxLength, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { TipoMovimento } from '../../entities/movimento-cassa.entity';

export class CreateMovimentoDto {
  @IsOptional()
  @IsInt()
  clienteId?: number;

  @IsDateString()
  dataMovimento: string;

  @IsEnum(TipoMovimento)
  tipo: TipoMovimento;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  categoria?: string;

  @IsString()
  descrizione: string;

  @IsNumber()
  importo: number;

  // Campi fiscali opzionali
  @IsOptional()
  @IsNumber()
  imponibile?: number;

  @IsOptional()
  @IsNumber()
  importoIva?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  aliquotaIva?: number;

  @IsOptional()
  @IsNumber()
  importoRitenuta?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  aliquotaRitenuta?: number;

  @IsOptional()
  @IsNumber()
  nonImponibile?: number;

  @IsOptional()
  @IsBoolean()
  spesaInterna?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  metodoPagamento?: string;

  @IsOptional()
  @IsInt()
  scadenzaId?: number;

  @IsOptional()
  @IsString()
  note?: string;
}

export class UpdateMovimentoDto {
  @IsOptional()
  @IsInt()
  clienteId?: number;

  @IsOptional()
  @IsDateString()
  dataMovimento?: string;

  @IsOptional()
  @IsEnum(TipoMovimento)
  tipo?: TipoMovimento;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  categoria?: string;

  @IsOptional()
  @IsString()
  descrizione?: string;

  @IsOptional()
  @IsNumber()
  importo?: number;

  // Campi fiscali opzionali
  @IsOptional()
  @IsNumber()
  imponibile?: number;

  @IsOptional()
  @IsNumber()
  importoIva?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  aliquotaIva?: number;

  @IsOptional()
  @IsNumber()
  importoRitenuta?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  aliquotaRitenuta?: number;

  @IsOptional()
  @IsNumber()
  nonImponibile?: number;

  @IsOptional()
  @IsBoolean()
  spesaInterna?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  metodoPagamento?: string;

  @IsOptional()
  @IsInt()
  scadenzaId?: number;

  @IsOptional()
  @IsString()
  note?: string;
}

export class FilterMovimentoDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  clienteId?: number;

  @IsOptional()
  @IsEnum(TipoMovimento)
  tipo?: TipoMovimento;

  @IsOptional()
  @IsString()
  categoria?: string;

  @IsOptional()
  @IsBoolean()
  spesaInterna?: boolean;

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
  @Type(() => Number)
  mese?: number;

  @IsOptional()
  @IsInt()
  @Min(2000)
  @Max(2100)
  @Type(() => Number)
  anno?: number;
}

