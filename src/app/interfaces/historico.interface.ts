import { EntregaStatus } from "./entrega.interface";

export interface HistoricoEntregaInterface {
  date: Date;
  id: string;
  observacoes?: string;
  status: EntregaStatus;
}
