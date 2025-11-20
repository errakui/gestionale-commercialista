export enum TipoCliente {
  DITTA_INDIVIDUALE = 'DITTA_INDIVIDUALE',
  SRL = 'SRL',
  SNC = 'SNC',
  LIBERO_PROF = 'LIBERO_PROF',
  PRIVATO = 'PRIVATO',
}

export enum PeriodicitaIva {
  MENSILE = 'MENSILE',
  TRIMESTRALE = 'TRIMESTRALE',
  NESSUNA = 'NESSUNA',
}

export enum StatoScadenza {
  DA_FARE = 'DA_FARE',
  IN_CORSO = 'IN_CORSO',
  FATTO = 'FATTO',
}

export enum TipoMovimento {
  ENTRATA = 'ENTRATA',
  USCITA = 'USCITA',
}

export interface Cliente {
  id: number;
  tipoCliente: TipoCliente;
  ragioneSociale?: string;
  nome?: string;
  cognome?: string;
  codiceFiscale?: string;
  partitaIva?: string;
  indirizzo?: string;
  cap?: string;
  citta?: string;
  provincia?: string;
  email?: string;
  pec?: string;
  telefono?: string;
  regimeFiscale?: string;
  periodicitaIva: PeriodicitaIva;
  haImmobili: boolean;
  // Campi fiscali
  esenteIva?: boolean;
  soggettoIva?: boolean;
  aliquotaIva?: number;
  esenteRitenuta?: boolean;
  soggettoRitenuta?: boolean;
  aliquotaRitenuta?: number;
  attivo: boolean;
  noteInterne?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Scadenza {
  id: number;
  clienteId?: number;
  cliente?: Cliente;
  dataScadenza: string;
  tipoScadenza: string;
  stato: StatoScadenza;
  note?: string;
  movimentoCassaId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface MovimentoCassa {
  id: number;
  clienteId?: number;
  cliente?: Cliente;
  dataMovimento: string;
  tipo: TipoMovimento;
  categoria?: string;
  descrizione: string;
  importo: number;
  // Campi fiscali
  imponibile?: number;
  importoIva?: number;
  aliquotaIva?: number;
  importoRitenuta?: number;
  aliquotaRitenuta?: number;
  nonImponibile?: number;
  spesaInterna?: boolean;
  metodoPagamento?: string;
  scadenzaId?: number;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServizioPredefinito {
  id: number;
  nome: string;
  descrizione?: string;
  importo: number;
  categoria?: string;
  attivo: boolean;
  applicaIva: boolean;
  aliquotaIva: number;
  applicaRitenuta: boolean;
  aliquotaRitenuta: number;
  createdAt: string;
  updatedAt: string;
}

export interface NotaCliente {
  id: number;
  clienteId: number;
  titolo: string;
  contenuto: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
}

