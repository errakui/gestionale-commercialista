import { IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateNotaDto {
  @IsString()
  @MaxLength(255)
  titolo: string;

  @IsString()
  contenuto: string;
}

export class UpdateNotaDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  titolo?: string;

  @IsOptional()
  @IsString()
  contenuto?: string;
}

