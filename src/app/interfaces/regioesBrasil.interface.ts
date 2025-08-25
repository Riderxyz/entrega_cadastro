export type UfSigla =
  | 'AC'
  | 'AP'
  | 'AM'
  | 'PA'
  | 'RO'
  | 'RR'
  | 'TO'
  | 'AL'
  | 'BA'
  | 'CE'
  | 'MA'
  | 'PB'
  | 'PE'
  | 'PI'
  | 'RN'
  | 'SE'
  | 'DF'
  | 'GO'
  | 'MT'
  | 'MS'
  | 'ES'
  | 'MG'
  | 'RJ'
  | 'SP'
  | 'PR'
  | 'RS'
  | 'SC';

  // Interface de uma Região
export interface RegiaoBrasil {
  regiao: RegiaoBrasilNomeEnum;
  ufs: UfSigla[];
}

export interface EstadoBrasil {
  uf: UfSigla;
  nome: string;
  regiao: RegiaoBrasilNomeEnum;
}

export enum RegiaoBrasilNomeEnum {
  Norte = 'Norte',
  Nordeste = 'Nordeste',
  CentroOeste = 'Centro-Oeste',
  Sudeste = 'Sudeste',
  Sul = 'Sul',
}



export const ESTADOS_BRASIL: EstadoBrasil[] = [
  { uf: 'AC', nome: 'Acre', regiao: RegiaoBrasilNomeEnum.Norte },
  { uf: 'AP', nome: 'Amapá', regiao: RegiaoBrasilNomeEnum.Norte },
  { uf: 'AM', nome: 'Amazonas', regiao: RegiaoBrasilNomeEnum.Norte },
  { uf: 'PA', nome: 'Pará', regiao: RegiaoBrasilNomeEnum.Norte },
  { uf: 'RO', nome: 'Rondônia', regiao: RegiaoBrasilNomeEnum.Norte },
  { uf: 'RR', nome: 'Roraima', regiao: RegiaoBrasilNomeEnum.Norte },
  { uf: 'TO', nome: 'Tocantins', regiao: RegiaoBrasilNomeEnum.Norte },

  { uf: 'AL', nome: 'Alagoas', regiao: RegiaoBrasilNomeEnum.Nordeste },
  { uf: 'BA', nome: 'Bahia', regiao: RegiaoBrasilNomeEnum.Nordeste },
  { uf: 'CE', nome: 'Ceará', regiao: RegiaoBrasilNomeEnum.Nordeste },
  { uf: 'MA', nome: 'Maranhão', regiao: RegiaoBrasilNomeEnum.Nordeste },
  { uf: 'PB', nome: 'Paraíba', regiao: RegiaoBrasilNomeEnum.Nordeste },
  { uf: 'PE', nome: 'Pernambuco', regiao: RegiaoBrasilNomeEnum.Nordeste },
  { uf: 'PI', nome: 'Piauí', regiao: RegiaoBrasilNomeEnum.Nordeste },
  { uf: 'RN', nome: 'Rio Grande do Norte', regiao: RegiaoBrasilNomeEnum.Nordeste },
  { uf: 'SE', nome: 'Sergipe', regiao: RegiaoBrasilNomeEnum.Nordeste },

  { uf: 'DF', nome: 'Distrito Federal', regiao: RegiaoBrasilNomeEnum.CentroOeste },
  { uf: 'GO', nome: 'Goiás', regiao: RegiaoBrasilNomeEnum.CentroOeste },
  { uf: 'MT', nome: 'Mato Grosso', regiao: RegiaoBrasilNomeEnum.CentroOeste },
  { uf: 'MS', nome: 'Mato Grosso do Sul', regiao: RegiaoBrasilNomeEnum.CentroOeste },

  { uf: 'ES', nome: 'Espírito Santo', regiao: RegiaoBrasilNomeEnum.Sudeste },
  { uf: 'MG', nome: 'Minas Gerais', regiao: RegiaoBrasilNomeEnum.Sudeste },
  { uf: 'RJ', nome: 'Rio de Janeiro', regiao: RegiaoBrasilNomeEnum.Sudeste },
  { uf: 'SP', nome: 'São Paulo', regiao: RegiaoBrasilNomeEnum.Sudeste },

  { uf: 'PR', nome: 'Paraná', regiao: RegiaoBrasilNomeEnum.Sul },
  { uf: 'RS', nome: 'Rio Grande do Sul', regiao: RegiaoBrasilNomeEnum.Sul },
  { uf: 'SC', nome: 'Santa Catarina', regiao: RegiaoBrasilNomeEnum.Sul }
];


