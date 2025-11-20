import { IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator';

export class CreateCategoriaDto {
  @IsString()
  @MaxLength(100)
  nome: string;

  @IsOptional()
  @IsString()
  descrizione?: string;

  @IsOptional()
  @IsBoolean()
  attiva?: boolean;
}

export class UpdateCategoriaDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nome?: string;

  @IsOptional()
  @IsString()
  descrizione?: string;

  @IsOptional()
  @IsBoolean()
  attiva?: boolean;
}

