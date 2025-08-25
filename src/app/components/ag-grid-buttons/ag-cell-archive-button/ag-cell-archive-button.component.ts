/* eslint-disable @typescript-eslint/no-explicit-any */
// ag-cell-delete-button.component.ts
import { Component, inject, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { CommonModule } from '@angular/common';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService } from 'primeng/api';
import { ICellRendererParams } from 'ag-grid-community';
import {
  EntregaInterface,
  EntregaStatus,
} from 'src/app/interfaces/entrega.interface';
import { AuthService } from 'src/app/service/auth.service';
import { EntregaService } from 'src/app/service/entregas.service';
import { ToastService } from 'src/app/service/toast.service';
import { v4 as uuidv4 } from 'uuid';
@Component({
  selector: 'app-ag-cell-archive-button',
  standalone: true,
  imports: [CommonModule, ButtonModule, TooltipModule, ConfirmPopupModule],
  template: `
    <p-button
      icon="fa-solid fa-box-archive"
      pTooltip="Arquive esta entrega"
      [severity]="'secondary'"
      [loading]="showArchiveLoading"
      (click)="onClick($event)"
      *ngIf="!params.data!.arquivado; else avisoEntregue"
    ></p-button>
    <p-confirmPopup></p-confirmPopup>

    <ng-template #avisoEntregue>
      <p-button
        icon="fa-solid fa-check"
        pTooltip="Item esta arquivado"
        [severity]="'success'"
      ></p-button>
    </ng-template>
  `,
  providers: [ConfirmationService],
})
export class AgCellArchiveButtonComponent implements ICellRendererAngularComp {
  @Input() params!: ICellRendererParams<EntregaInterface>;
  showArchiveLoading = false;
  private readonly entregaSrv: EntregaService = inject(EntregaService);
  private readonly confirmationDialogSrv: ConfirmationService =
    inject(ConfirmationService);
  private readonly authSrv: AuthService = inject(AuthService);
  private readonly toastSrv: ToastService = inject(ToastService);
  agInit(params: ICellRendererParams<EntregaInterface>): void {
    this.params = params;
  }

  refresh(): boolean {
    return false;
  }

  onClick(event: Event): void {
    console.log(this.params);
    this.confirmationDialogSrv.confirm({
      target: event.target as EventTarget,
      message: 'Tem certeza que deseja arquivar esta entrega ?',
      icon: 'fa-solid fa-triangle-exclamation',
      accept: () => {
        this.showArchiveLoading = true;
        if (this.params.data) {
          const entregaObj = this.params.data;
          entregaObj.status = EntregaStatus.Arquivada;
          entregaObj!.updatedAt = new Date();
          entregaObj!.arquivado = true;
          entregaObj!.updatedBy = this.authSrv.currentUser!.id
            ? this.authSrv.currentUser!.id
            : '';
          this.entregaSrv.updateEntrega(entregaObj!).then((res) => {});
          this.entregaSrv
            .addHistoricoEntrega(entregaObj.id, {
              status: EntregaStatus.Arquivada,
              date: new Date(),
              id: uuidv4(),
              observacoes: '',
            })
            .then((res) => {
              this.toastSrv.notify(
                'info',
                'Arquivada',
                'Entrega foi arquivada',
                3000
              );
             /*  if (this.params && this.params.moveStatusForward) {
                // this.params.moveStatusForward(this.params.data);
              } */
            });
        }
      },
      reject: () => {
        //this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
      },
    });
  }
}
