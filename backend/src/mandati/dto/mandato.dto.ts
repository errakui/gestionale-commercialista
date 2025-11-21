import { IsString, IsOptional, IsNumber, IsDateString, MaxLength } from 'class-validator';

export class CreateMandatoDto {
  @IsOptional()
  @IsNumber()
  clienteId?: number;

  @IsString()
  @MaxLength(255)
  nomeCliente: string;

  @IsString()
  @MaxLength(50)
  cfPivaCliente: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  indirizzoCliente?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  emailCliente?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  pecCliente?: string;

  @IsString()
  @MaxLength(100)
  tipoContabilita: string;

  @IsString()
  @MaxLength(255)
  compenso: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  modalitaPagamento?: string;

  @IsOptional()
  @IsString()
  serviziInclusi?: string;

  @IsOptional()
  @IsString()
  serviziExtra?: string;

  @IsDateString()
  dataInizio: string;

  @IsString()
  @MaxLength(255)
  luogoData: string;

  @IsString()
  testoMandato: string;
}

export class UpdateMandatoDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  nomeCliente?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  cfPivaCliente?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  indirizzoCliente?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  emailCliente?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  pecCliente?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  tipoContabilita?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  compenso?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  modalitaPagamento?: string;

  @IsOptional()
  @IsString()
  serviziInclusi?: string;

  @IsOptional()
  @IsString()
  serviziExtra?: string;

  @IsOptional()
  @IsDateString()
  dataInizio?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  luogoData?: string;

  @IsOptional()
  @IsString()
  testoMandato?: string;
}

