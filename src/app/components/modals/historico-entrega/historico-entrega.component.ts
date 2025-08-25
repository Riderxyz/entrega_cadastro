import { Component, inject } from '@angular/core';
import { HistoricoEntregaInterface } from 'src/app/interfaces/historico.interface';
import { TimelineModule } from 'primeng/timeline';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EntregaInterface, getEmptyEntrega } from 'src/app/interfaces/entrega.interface';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
@Component({
  selector: 'app-historico-entrega',
  templateUrl: './historico-entrega.component.html',
  standalone: true,
  imports: [CommonModule, TimelineModule, TagModule, DividerModule, ButtonModule, CardModule, DatePipe],

  styleUrls: ['./historico-entrega.component.scss'],
})
export class HistoricoEntregaComponent {
  historico: HistoricoEntregaInterface[] = [];
  entregaSelecionada: EntregaInterface = getEmptyEntrega();
  private readonly dynamicDialogConfig: DynamicDialogConfig = inject(
    DynamicDialogConfig<HistoricoEntregaInterface>
  );
  private readonly ref = inject(DynamicDialogRef);
  constructor() {
    this.historico = this.dynamicDialogConfig.data?.historico || [];
    this.entregaSelecionada = this.dynamicDialogConfig.data?.entrega || getEmptyEntrega();
    console.log(this.entregaSelecionada);

  }

  getMarkerColor(status: string): string {
    switch (status) {
      case 'Pendente':
        return 'var(--yellow-500)';
      case 'Em Rota':
        return 'var(--blue-500)';
      case 'Entregue':
        return 'var(--green-500)';
      case 'Cancelada':
        return 'var(--red-500)';
      default:
        return 'var(--surface-border)';
    }
  }

  close() {
    this.ref.close();
  }
}
