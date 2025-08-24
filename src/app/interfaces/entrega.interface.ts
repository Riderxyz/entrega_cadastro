import { EnderecoInterface, getEmptyEndereco } from "./endereco.interface";

export interface EntregaInterface {
  id: string;
  cliente: string;
  dataEnvio: Date;
  status: EntregaStatus;
  endereco: EnderecoInterface;
  enderecoFormatado: string;
  produto: string;
  dataEstimadaEntrega: Date;
  observacoes?: string;
  arquivado: boolean;

}

export const getEmptyEntrega = (): EntregaInterface => ({
  id: '',
  cliente: '',
  dataEnvio: new Date(),
  status: EntregaStatus.Pendente,
  endereco: getEmptyEndereco(),
  enderecoFormatado: '',
  produto: '',
  dataEstimadaEntrega: new Date(),
  observacoes: '',
  arquivado: false
//  historico: [],
});


export enum EntregaStatus {
  Pendente = 'Pendente',
  EmRota = 'Em Rota',
  Entregue = 'Entregue',
  Cancelada = 'Cancelada',
}
