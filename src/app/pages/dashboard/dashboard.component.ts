import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { Subject, takeUntil } from 'rxjs';
import {
  EntregaInterface,
  EntregaStatus,
} from 'src/app/interfaces/entrega.interface';
import { EntregaService } from 'src/app/service/entregas.service';
import { AG_GRID_LOCALE_BR } from '@ag-grid-community/locale';
import { ThemeService } from 'src/app/service/theme.service';
import { entregasMock } from 'src/app/interfaces/mock';
import { StatusCardInterface } from 'src/app/interfaces/statusCard.interface';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EntregaFormComponent } from 'src/app/components/modals/entrega-form/entrega-form.component';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [DialogService]
})
export class DashboardComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly entregaSrv: EntregaService = inject(EntregaService);
   private dialogSrv = inject(DialogService);
  ref: DynamicDialogRef | undefined;
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
  statusCards: StatusCardInterface[] = [];
  entregasParaHoje: EntregaInterface[] = [];
  constructor() {}
  ngOnInit(): void {
    this.themeSrv.$onThemeChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((theme) => {
        this.showGridInDarkMode = theme === 'dark';
      }); //this.onlyRunOnce()
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    this.entregaSrv
      .getAllEntregas()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.getStatusCardData(res);
          this.gridApi.updateGridOptions({ rowData: res });
          this.gridApi.sizeColumnsToFit();
        },
        error: () => {},
      });
  }

  getStatusCardData(entregasArr: EntregaInterface[]) {
    const totalEntregas = entregasArr.length;
    const entregasPendentes = entregasArr.filter(
      (entrega) => entrega.status === EntregaStatus.Pendente
    );
    const entregasEmRota = entregasArr.filter(
      (entrega) => entrega.status === EntregaStatus.EmRota
    );
    const entregasCanceladas = entregasArr.filter(
      (entrega) => entrega.status === EntregaStatus.Cancelada
    );
    const entregasEntregues = entregasArr.filter(
      (entrega) => entrega.status === EntregaStatus.Entregue
    );

    this.statusCards = [
/*       {
        title: 'Total Entregas',
        subtitle: 'Total de entregas cadastradas',
        icon: 'fa-solid fa-truck',
        color: 'purple',
        value: totalEntregas,
      }, */
      {
        title: 'Pendentes',
        subtitle: 'Entregas pendentes para envio',
        icon: 'fa-solid fa-clock',
        color: 'orange',
        value: entregasPendentes.length,
      },
      {
        title: 'Em Rota',
        subtitle: 'Pacotes ja em transito para entrega',
        icon: 'fa-solid fa-truck-fast',
        color: 'blue',
        value: entregasEmRota.length,
      },
      {
        title: 'Canceladas',
        subtitle: 'Entregas canceladas',
        icon: 'fa-solid fa-xmark',
        color: 'red',
        value: entregasCanceladas.length,
      },
      {
        title: 'Entregues',
        subtitle: 'Entregas entregues',
        icon: 'fa-solid fa-check',
        color: 'green',
        value: entregasEntregues.length,
      },

      /*   { label: 'Pendentes', value: entregasPendentes.length },
  { label: 'Em Rota', value: entregasEmRota.length },
  { label: 'Canceladas', value: entregasCanceladas.length },
  { label: 'Entregues', value: entregasEntregues.length }, */
    ];
  }

  getEntregasParaHoje(entregasArr: EntregaInterface[]) {
    const today = new Date();
    const entregasParaHoje = entregasArr.filter((entrega) => {
      const entregaDate = new Date(entrega.dataEnvio);
      return (
        entregaDate.getDate() === today.getDate() &&
        entregaDate.getMonth() === today.getMonth() &&
        entregaDate.getFullYear() === today.getFullYear()
      );
    });
    this.entregasParaHoje = entregasParaHoje;
  }


  addNewEntrega() {
this.ref = this.dialogSrv.open(EntregaFormComponent, {
      header: 'Nova Entrega',
      width: '70%',
      data: {} // sem entrega → inclusão
    });
  }
  ngOnDestroy(): void {}
}
