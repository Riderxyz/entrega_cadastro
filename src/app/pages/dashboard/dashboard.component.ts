import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { Subject, takeUntil } from 'rxjs';
import { EntregaInterface } from 'src/app/interfaces/entrega.interface';
import { EntregaService } from 'src/app/service/entregas.service';
import { AG_GRID_LOCALE_BR } from '@ag-grid-community/locale';
import { ThemeService } from 'src/app/service/theme.service';
import { entregasMock } from 'src/app/interfaces/mock';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly entregaSrv: EntregaService = inject(EntregaService);
  gridOptions: GridOptions<EntregaInterface> = {
    localeText: AG_GRID_LOCALE_BR,
    columnDefs: [
      { field: 'id', headerName: 'ID' },
      { field: 'dataEnvio', headerName: 'Data Envio' },
      { field: 'dataEstimadaEntrega', headerName: 'Data Estimada Entrega' },
      { field: 'status', headerName: 'Status' },
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
  private readonly themeSrv: ThemeService = inject(ThemeService);
  constructor() {}
  ngOnInit(): void {


      this.themeSrv.$onThemeChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((theme) => {
        this.showGridInDarkMode = theme === 'dark';
      });


;//this.onlyRunOnce()
  }



  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
        this.entregaSrv
      .getAllEntregas()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.gridApi.updateGridOptions({ rowData: res });
          this.gridApi.sizeColumnsToFit();
        },
        error: () => {},
      });
  }

  onlyRunOnce() {
   entregasMock.forEach((entrega) => {
    this.entregaSrv.addEntrega(entrega).then((res) => {
      console.log('Finalizado');
    })
    });
  }

  ngOnDestroy(): void {}
}
