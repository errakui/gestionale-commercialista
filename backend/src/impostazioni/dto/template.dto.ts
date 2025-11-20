import { IsString, IsEnum, IsOptional, IsInt, IsBoolean, IsArray, MaxLength } from 'class-validator';
import { TipoRicorrenza } from '../../entities/template-scadenza.entity';

export class CreateTemplateDto {
  @IsString()
  @MaxLength(100)
  codiceTemplate: string;

  @IsString()
  @MaxLength(255)
  descrizione: string;

  @IsEnum(TipoRicorrenza)
  tipoRicorrenza: TipoRicorrenza;

  @IsOptional()
  @IsInt()
  giornoScadenza?: number;

  @IsOptional()
  @IsArray()
  mesiApplicabili?: number[];

  @IsOptional()
  @IsInt()
  offsetMesi?: number;

  @IsOptional()
  @IsInt()
  offsetAnni?: number;

  @IsOptional()
  @IsBoolean()
  applicabileIvaMensile?: boolean;

  @IsOptional()
  @IsBoolean()
  applicabileIvaTrimestrale?: boolean;

  @IsOptional()
  @IsBoolean()
  applicabileImmobili?: boolean;

  @IsOptional()
  @IsBoolean()
  applicabileTutti?: boolean;

  @IsOptional()
  @IsBoolean()
  attivo?: boolean;
}

export class UpdateTemplateDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  codiceTemplate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  descrizione?: string;

  @IsOptional()
  @IsEnum(TipoRicorrenza)
  tipoRicorrenza?: TipoRicorrenza;

  @IsOptional()
  @IsInt()
  giornoScadenza?: number;

  @IsOptional()
  @IsArray()
  mesiApplicabili?: number[];

  @IsOptional()
  @IsInt()
  offsetMesi?: number;

  @IsOptional()
  @IsInt()
  offsetAnni?: number;

  @IsOptional()
  @IsBoolean()
  applicabileIvaMensile?: boolean;

  @IsOptional()
  @IsBoolean()
  applicabileIvaTrimestrale?: boolean;

  @IsOptional()
  @IsBoolean()
  applicabileImmobili?: boolean;

  @IsOptional()
  @IsBoolean()
  applicabileTutti?: boolean;

  @IsOptional()
  @IsBoolean()
  attivo?: boolean;
}

