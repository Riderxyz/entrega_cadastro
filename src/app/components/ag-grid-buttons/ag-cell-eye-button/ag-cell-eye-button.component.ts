/* eslint-disable @typescript-eslint/no-explicit-any */
// ag-cell-delete-button.component.ts
import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-ag-cell-eye-button',
  standalone: true,
  imports: [

  ],
  template: `
<!--     <button mat-icon-button color="primary" (click)="onClick()" matTooltip="Visualizar entidade">
      <mat-icon>visibility</mat-icon>
    </button> -->


  `,
})

export class AgCellEyeButtonComponent implements ICellRendererAngularComp {
  @Input() params: any;

  agInit(params: any): void {
    this.params = params;
  }

  refresh(): boolean {
    return false;
  }

  onClick(): void {
    if (this.params && this.params.onOpen) {
      this.params.onOpen(this.params.data);
    }
  }
}
