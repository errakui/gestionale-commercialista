import { IsString, IsOptional, IsBoolean, IsNumber, Min, Max, MaxLength } from 'class-validator';

export class CreateServizioDto {
  @IsString()
  @MaxLength(200)
  nome: string;

  @IsOptional()
  @IsString()
  descrizione?: string;

  @IsNumber()
  @Min(0)
  importo: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  categoria?: string;

  @IsOptional()
  @IsBoolean()
  applicaIva?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  aliquotaIva?: number;

  @IsOptional()
  @IsBoolean()
  applicaRitenuta?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  aliquotaRitenuta?: number;

  @IsOptional()
  @IsBoolean()
  attivo?: boolean;
}

export class UpdateServizioDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  nome?: string;

  @IsOptional()
  @IsString()
  descrizione?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  importo?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  categoria?: string;

  @IsOptional()
  @IsBoolean()
  applicaIva?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  aliquotaIva?: number;

  @IsOptional()
  @IsBoolean()
  applicaRitenuta?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  aliquotaRitenuta?: number;

  @IsOptional()
  @IsBoolean()
  attivo?: boolean;
}

export class GeneraMovimentoDaServizioDto {
  @IsNumber()
  servizioId: number;

  @IsNumber()
  clienteId: number;

  @IsString()
  dataMovimento: string;

  @IsOptional()
  @IsString()
  metodoPagamento?: string;

  @IsOptional()
  @IsString()
  note?: string;
}

