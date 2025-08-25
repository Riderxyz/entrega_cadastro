/* eslint-disable @typescript-eslint/no-explicit-any */
// ag-cell-delete-button.component.ts
import { Component, inject, Input } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import {
  EntregaInterface,
  EntregaStatus,
} from 'src/app/interfaces/entrega.interface';
import { EntregaService } from 'src/app/service/entregas.service';
import { ConfirmationService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from 'src/app/service/auth.service';
@Component({
  selector: 'app-ag-cell-statusforward-button',
  standalone: true,
  imports: [CommonModule, ButtonModule, TooltipModule, ConfirmPopupModule],
  template: `
    <!--   <button mat-icon-button color="warn"  matTooltip="Visualizar entidade">
      <mat-icon>block</mat-icon>
    </button> -->
    <p-button
      icon="fa-solid fa-chevron-right"
      pTooltip="Mover status para {{ proximoStatus }}"
      [severity]="'warning'"
      [loading]="showStatusChangeLoading"
      (click)="onClick($event)"
      *ngIf="
        params.data.status !== EntregaStatusForHTML.Entregue;
        else avisoEntregue
      "
    ></p-button>
    <p-confirmPopup></p-confirmPopup>

    <ng-template #avisoEntregue>
      <p-button
        icon="fa-solid fa-check"
        pTooltip="Item foi entregue"
        [severity]="'success'"
      ></p-button>
    </ng-template>
  `,
  providers: [ConfirmationService],
})
export class AgCellStatusForwardButtonComponent
  implements ICellRendererAngularComp
{
  @Input() params: any;
  proximoStatus = '' as EntregaStatus;
  EntregaStatusForHTML = EntregaStatus;
  private readonly entregaSrv: EntregaService = inject(EntregaService);
  private readonly confirmationDialogSrv: ConfirmationService =
    inject(ConfirmationService);
    private readonly authSrv: AuthService =   inject(AuthService);
  showStatusChangeLoading = false;
  agInit(params: ICellRendererParams<EntregaInterface>): void {
    this.params = params;
    switch (params.data?.status) {
      case EntregaStatus.Pendente:
        this.proximoStatus = EntregaStatus.EmRota;
        break;
      case EntregaStatus.EmRota:
        this.proximoStatus = EntregaStatus.Entregue;
        break;
    }
  }

  refresh(): boolean {
    return false;
  }

  onClick(event: Event): void {
    console.log(this.params);
    /*     this.entregaSrv.addHistoricoEntrega(this.params.data.id, {
      status: this.proximoStatus,
      date: new Date(),
      id: uuidv4(),
      observacoes: '',
    })
    if (this.params && this.params.moveStatusForward) {
     // this.params.moveStatusForward(this.params.data);
    } */
    this.confirmationDialogSrv.confirm({
      target: event.target as EventTarget,
      message:
        'Tem certeza que deseja mover o status para "' +
        this.proximoStatus +
        '"?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.showStatusChangeLoading = true;
const entregaObj = this.params.data;
entregaObj.status = this.proximoStatus
entregaObj.updatedAt = new Date();
entregaObj.updatedBy = this.params.data.createdBy
        this.entregaSrv.updateEntrega(entregaObj).then((res) => {

        })
        this.entregaSrv.addHistoricoEntrega(entregaObj.id, {
          status: this.proximoStatus,
          date: new Date(),
          id: uuidv4(),
          observacoes: '',
        }).then((res) => {
          if (this.params && this.params.moveStatusForward) {
            // this.params.moveStatusForward(this.params.data);
          }

        });
      },
      reject: () => {
        //this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
      },
    });
  }
}
