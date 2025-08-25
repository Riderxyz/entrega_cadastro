/* eslint-disable @typescript-eslint/no-explicit-any */
// ag-cell-delete-button.component.ts
import { Component, inject, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { CommonModule } from '@angular/common';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService } from 'primeng/api';
import { AuthService } from 'src/app/service/auth.service';
import { EntregaService } from 'src/app/service/entregas.service';
import { ToastService } from 'src/app/service/toast.service';
import { ICellRendererParams } from 'ag-grid-community';
import { EntregaInterface } from 'src/app/interfaces/entrega.interface';

@Component({
  selector: 'app-ag-cell-delete-button',
  standalone: true,
  imports: [CommonModule, ButtonModule, TooltipModule, ConfirmPopupModule],
  template: `
    <p-button
      icon="fa-solid fa-trash"
      pTooltip="Delete essa entrega"
      [severity]="'danger'"
      (click)="onClick($event)"
    ></p-button>
  `,
})
export class AgCellDeleteButtonComponent implements ICellRendererAngularComp {
  @Input() params!: ICellRendererParams<EntregaInterface>;
  private readonly entregaSrv: EntregaService = inject(EntregaService);
  private readonly confirmationDialogSrv: ConfirmationService =
    inject(ConfirmationService);
  private readonly authSrv: AuthService = inject(AuthService);
  private readonly toastSrv: ToastService = inject(ToastService);
  agInit(params: any): void {
    this.params = params;
  }

  refresh(): boolean {
    return false;
  }

  onClick(event: Event): void {
    this.confirmationDialogSrv.confirm({
      target: event.target as EventTarget,
      message:
        'Tem certeza que deseja excluir esta entrega ? Não há voltas depois que essa ação for executada',
      header: 'Excluir Entrega',
      icon: 'fa-solid fa-triangle-exclamation',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        if (this.params.data) {
          const entregaObj = this.params.data;
          this.entregaSrv.deleteEntrega(entregaObj.id).then((res) => {
            this.toastSrv.notify(
              'info',
              'Excluida',
              'Entrega foi excluida com sucesso',
              3000
            );
          });
        }
      },
      reject: () => {
        //this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
      },
    });
  }
}
