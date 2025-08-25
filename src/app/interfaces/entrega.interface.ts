import { EnderecoInterface, getEmptyEndereco } from './endereco.interface';

export interface EntregaInterface {
  /**
   * UUID da entrega
    */
  id: string;
  cliente: string;
  dataEnvio?: Date;
  status: EntregaStatus;
  endereco: EnderecoInterface;
  enderecoFormatado: string;
  produto: string;
  dataEstimadaEntrega: Date;
  observacoes?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
  arquivado: boolean;
}

export const getEmptyEntrega = (): EntregaInterface => ({
  id: '',
  cliente: '',
  //dataEnvio: new Date(),
  status: EntregaStatus.Pendente,
  endereco: getEmptyEndereco(),
  enderecoFormatado: '',
  produto: '',
  dataEstimadaEntrega: new Date(),
  updatedAt: new Date(),
  createdAt: new Date(),
  createdBy: '',
  updatedBy: '',
  observacoes: '',
  arquivado: false,
  //  historico: [],
});

export enum EntregaStatus {
  Pendente = 'Pendente',
  EmRota = 'Em Rota',
  Entregue = 'Entregue',
  Arquivada = 'Arquivada',
  Cancelada = 'Cancelada',
}
