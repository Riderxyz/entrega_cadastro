/* eslint-disable @typescript-eslint/no-explicit-any */
// ag-cell-delete-button.component.ts
import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { CommonModule } from '@angular/common';
import { ConfirmPopupModule } from 'primeng/confirmpopup';

@Component({
  selector: 'app-ag-cell-history-button',
  standalone: true,
 imports: [CommonModule, ButtonModule, TooltipModule, ConfirmPopupModule],
  template: `
   <p-button
      icon="fa-solid fa-box-archive"
      pTooltip="verificar historico da entrega"
      [severity]="'secondary'"
      (click)="onClick()"
    ></p-button>
  `,
})

export class AgCellHistoryButtonComponent implements ICellRendererAngularComp {
  @Input() params: any;

  agInit(params: any): void {
    this.params = params;
  }

  refresh(): boolean {
    return false;
  }

  onClick(): void {
    if (this.params && this.params.onHistory) {
      this.params.onHistory(this.params.data);
    }
  }
}
