import { AG_GRID_LOCALE_BR } from '@ag-grid-community/locale';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GridOptions, ICellRendererParams, GridApi } from 'ag-grid-community';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { AgCellHistoryButtonComponent } from 'src/app/components/ag-grid-buttons/ag-cell-history-button/ag-cell-history-button.component';
import { AgCellStatusForwardButtonComponent } from 'src/app/components/ag-grid-buttons/ag-cell-statusforward-button/ag-cell-statusforward-button.component';
import { EntregaFormComponent } from 'src/app/components/modals/entrega-form/entrega-form.component';
import { HistoricoEntregaComponent } from 'src/app/components/modals/historico-entrega/historico-entrega.component';
import { EntregaInterface } from 'src/app/interfaces/entrega.interface';
import { EntregaService } from 'src/app/service/entregas.service';
import { ThemeService } from 'src/app/service/theme.service';

@Component({
  selector: 'app-entregas-list',
  templateUrl: './entregas-list.component.html',
  styleUrls: ['./entregas-list.component.scss']
})
export class EntregasListComponent {
 gridOptions: GridOptions<EntregaInterface> = {
    localeText: AG_GRID_LOCALE_BR,
    columnDefs: [
      { field: 'id', headerName: 'Codigo Unico de Produto' },
      { field: 'cliente', headerName: 'Cliente', maxWidth: 180 },
      { field: 'produto', headerName: 'Produto' },
      {
        field: 'dataEstimadaEntrega',
        headerName: 'Data Estimada Entrega',
        width: 130,
        cellRenderer: (params: ICellRendererParams) => {
          const date = params.value;
          const formattedDate = date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          });
          return formattedDate;
        },
      },
      /* { field: 'dataEnvio', headerName: 'Data Envio' }, */
      { field: 'status', headerName: 'Status', width: 100 },
      {
        headerName: 'Avançar',
        filter: false,
        sortable: false,
        editable: false,
        cellRenderer: AgCellStatusForwardButtonComponent,
        width: 70,
        cellRendererParams: {
          moveStatusForward: (rowData: EntregaInterface) =>
            console.log(rowData),
        },
      },
      {
        headerName: 'Historico',
        filter: false,
        sortable: false,
        editable: false,
        cellRenderer: AgCellHistoryButtonComponent,
        width: 70,
        cellRendererParams: {
          onHistory: (rowData: EntregaInterface) =>
            this.onHistoryRequest(rowData),
        },
      },
    ],
    defaultColDef: {
      editable: false,
      sortable: true,
      resizable: true,
      filter: true,
    },
    onGridReady: this.onGridReady.bind(this),
  };
  gridApi!: GridApi<EntregaInterface>;

    showGridInDarkMode = false;
  private readonly destroy$ = new Subject<void>();
  private readonly entregaSrv: EntregaService = inject(EntregaService);
  private readonly dialogSrv = inject(DialogService);
  private readonly themeSrv: ThemeService = inject(ThemeService);
  private readonly router: Router = inject(Router);
constructor() {
this.themeSrv.$onThemeChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((theme) => {
        this.showGridInDarkMode = theme === 'dark';
      });
}



 addNewEntrega() {
    this.ref = this.dialogSrv.open(EntregaFormComponent, {
      header: 'Nova Entrega',
      width: '70%',
      data: {}, // sem entrega → inclusão
    });
  }

  onHistoryRequest(param: EntregaInterface) {
    this.entregaSrv.getAllHistoricoEntrega(param.id).subscribe({
      next: (res) => {
        console.log('historico', res);
        this.ref = this.dialogSrv.open(HistoricoEntregaComponent, {
          header: 'Historico de Entregas',
          width: '70%',
          modal: true,
          closeOnEscape: true,
          data: { historico: res, entrega: param },
        });
      },
    });
  }

}
