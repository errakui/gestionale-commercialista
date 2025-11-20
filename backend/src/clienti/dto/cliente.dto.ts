import { IsString, IsEmail, IsOptional, IsEnum, IsBoolean, MaxLength, IsNumber, Min, Max } from 'class-validator';
import { TipoCliente, PeriodicitaIva } from '../../entities/cliente.entity';

export class CreateClienteDto {
  @IsEnum(TipoCliente)
  tipoCliente: TipoCliente;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  ragioneSociale?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  nome?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  cognome?: string;

  @IsOptional()
  @IsString()
  @MaxLength(16)
  codiceFiscale?: string;

  @IsOptional()
  @IsString()
  @MaxLength(11)
  partitaIva?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  indirizzo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  cap?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  citta?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2)
  provincia?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEmail()
  pec?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  telefono?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  regimeFiscale?: string;

  @IsEnum(PeriodicitaIva)
  periodicitaIva: PeriodicitaIva;

  @IsOptional()
  @IsBoolean()
  haImmobili?: boolean;

  @IsOptional()
  @IsBoolean()
  attivo?: boolean;

  @IsOptional()
  @IsString()
  noteInterne?: string;
}

export class UpdateClienteDto {
  @IsOptional()
  @IsEnum(TipoCliente)
  tipoCliente?: TipoCliente;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  ragioneSociale?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  nome?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  cognome?: string;

  @IsOptional()
  @IsString()
  @MaxLength(16)
  codiceFiscale?: string;

  @IsOptional()
  @IsString()
  @MaxLength(11)
  partitaIva?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  indirizzo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  cap?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  citta?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2)
  provincia?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEmail()
  pec?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  telefono?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  regimeFiscale?: string;

  @IsOptional()
  @IsEnum(PeriodicitaIva)
  periodicitaIva?: PeriodicitaIva;

  @IsOptional()
  @IsBoolean()
  haImmobili?: boolean;

  @IsOptional()
  @IsBoolean()
  esenteIva?: boolean;

  @IsOptional()
  @IsBoolean()
  soggettoIva?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  aliquotaIva?: number;

  @IsOptional()
  @IsBoolean()
  esenteRitenuta?: boolean;

  @IsOptional()
  @IsBoolean()
  soggettoRitenuta?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  aliquotaRitenuta?: number;

  @IsOptional()
  @IsBoolean()
  attivo?: boolean;

  @IsOptional()
  @IsString()
  noteInterne?: string;
}

export class FilterClienteDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsBoolean()
  attivo?: boolean;

  @IsOptional()
  @IsString()
  regimeFiscale?: string;

  @IsOptional()
  @IsEnum(PeriodicitaIva)
  periodicitaIva?: PeriodicitaIva;
}

