import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { Subject, takeUntil } from 'rxjs';
import { EntregaInterface } from 'src/app/interfaces/entrega.interface';
import { EntregaService } from 'src/app/service/entregas.service';
import { AG_GRID_LOCALE_BR } from '@ag-grid-community/locale';
import { ThemeService } from 'src/app/service/theme.service';
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
  };
  showGridInDarkMode = false;
  private readonly themeSrv: ThemeService = inject(ThemeService);
  constructor() {}
  ngOnInit(): void {
    this.entregaSrv
      .getAllEntregas()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => console.log(res),
        error: () => {},
      });

      this.themeSrv.$onThemeChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((theme) => {
        this.showGridInDarkMode = theme === 'dark';
      });


      
  }

  ngOnDestroy(): void {}
}
