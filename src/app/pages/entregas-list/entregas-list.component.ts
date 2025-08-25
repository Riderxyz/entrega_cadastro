import { AG_GRID_LOCALE_BR } from '@ag-grid-community/locale';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  GridOptions,
  ICellRendererParams,
  GridApi,
  GridReadyEvent,
  ColDef,
} from 'ag-grid-community';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { AgCellArchiveButtonComponent } from 'src/app/components/ag-grid-buttons/ag-cell-archive-button/ag-cell-archive-button.component';
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
  styleUrls: ['./entregas-list.component.scss'],
  providers: [DialogService],
})
export class EntregasListComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly entregaSrv = inject(EntregaService);
  private readonly dialogSrv = inject(DialogService);
  private readonly themeSrv = inject(ThemeService);
  private readonly router = inject(Router);

  gridApi!: GridApi<EntregaInterface>;
  selectedRows: EntregaInterface[] = [];
  filtro = '';
  showGridInDarkMode = false;
  ref: DynamicDialogRef | undefined;

  /** Definição de colunas */
  private columnDefs: ColDef<EntregaInterface>[] = [
    {
      field: 'id',
      headerName: 'Código Único de Produto',
      checkboxSelection: true,
      headerCheckboxSelection: true,
    },
    { field: 'cliente', headerName: 'Cliente', maxWidth: 180 },
    { field: 'produto', headerName: 'Produto' },
    {
      field: 'dataEstimadaEntrega',
      headerName: 'Data Estimada Entrega',
      width: 130,
      valueFormatter: (params) =>
        new Date(params.value).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }),
    },
    { field: 'status', headerName: 'Status', width: 100 },
    {
      headerName: 'Avançar',
      cellRenderer: AgCellStatusForwardButtonComponent,
      width: 70,
      cellRendererParams: {
        moveStatusForward: (rowData: EntregaInterface) => console.log(rowData),
      },
    },
    {
      headerName: 'Histórico',
      cellRenderer: AgCellHistoryButtonComponent,
      width: 70,
      cellRendererParams: {
        onHistory: (rowData: EntregaInterface) => {
          this.selectedRows = [rowData];
          this.onHistoryRequest();
        },
      },
    },
   {
      headerName: 'Arquivar',
      cellRenderer: AgCellArchiveButtonComponent,
      width: 70,
      cellRendererParams: {
        onHistory: (rowData: EntregaInterface) => {
        
        },
      },
    },
  ];

  /** Configuração da Grid */
  gridOptions: GridOptions<EntregaInterface> = {
    localeText: AG_GRID_LOCALE_BR,
    columnDefs: this.columnDefs,
    defaultColDef: {
      editable: false,
      sortable: true,
      resizable: true,
      filter: true,
      autoHeight: true,
    },
    rowSelection: 'multiple',
    suppressRowClickSelection: false,
    onGridReady: this.onGridReady.bind(this),
    onSelectionChanged: (params) => {
      this.selectedRows = params.api.getSelectedRows();
      console.log('Selecionadas:', this.selectedRows);
    },
    isExternalFilterPresent: () => this.filtro !== '',
    doesExternalFilterPass: ({ data }) => {
      if (!data) return false;
      const term = this.filtro.toLowerCase();
      return [
        data.cliente,
        data.produto,
        data.status,
        data.id,
        data.createdBy,
        data.updatedBy,
        data.observacoes,
        data.createdAt?.toISOString(),
        data.updatedAt?.toISOString(),
        data.dataEstimadaEntrega?.toISOString(),
        data.dataEnvio?.toISOString(),
      ]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(term));
    },
  };

  /** Botões da toolbar (reagem à seleção) */
  get crudGridBtnArr() {
    return [
      {
        icon: 'fa-solid fa-plus',
        pTooltip: 'Incluir nova entrega',
        severity: 'success',
        disabled: false,
        onClick: this.addNewEntrega.bind(this),
      },
      {
        icon: 'fa-solid fa-pen-to-square',
        pTooltip: 'Editar entrega',
        severity: 'warning',
        disabled: this.selectedRows.length !== 1,
        onClick: this.editNewEntrega.bind(this),
      },
      {
        icon: 'fa-solid fa-folder-open',
        pTooltip: 'Abrir Histórico de entrega',
        severity: 'info',
        disabled: this.selectedRows.length !== 1,
        onClick: this.onHistoryRequest.bind(this),
      },
      {
        icon: 'fa-solid fa-box-archive',
        pTooltip: 'Arquivar entrega',
        severity: 'secondary',
        disabled: this.selectedRows.length === 0,
        onClick: this.onArchiveRequest.bind(this),
      },
      {
        icon: 'fa-solid fa-trash-can',
        pTooltip: 'Excluir entrega',
        severity: 'danger',
        disabled: this.selectedRows.length === 0,
        onClick: this.onDeleteRequest.bind(this),
      },
    ];
  }

  constructor() {}

  ngOnInit(): void {
    this.themeSrv.$onThemeChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((theme) => {
        this.showGridInDarkMode = theme === 'dark';
      });

    this.showGridInDarkMode = this.themeSrv.getCurrentTheme() === 'dark';
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

  addNewEntrega() {
    console.log('Adicionar nova entrega');
    /* this.dialogSrv.open(EntregaFormComponent, {
      header: 'Nova Entrega',
      width: '70%',
      data: {},
    }); */
  }

  editNewEntrega() {
    console.log('Editar entrega:', this.selectedRows[0]);
    /* this.dialogSrv.open(EntregaFormComponent, {
      header: 'Editar Entrega',
      width: '70%',
      data: { entrega: this.selectedRows[0] },
    }); */
  }

  onHistoryRequest() {
    const entrega = this.selectedRows[0];
    this.entregaSrv.getAllHistoricoEntrega(entrega.id).subscribe({
      next: (res) => {
        this.dialogSrv.open(HistoricoEntregaComponent, {
          header: 'Histórico de Entregas',
          width: '70%',
          modal: true,
          closeOnEscape: true,
          data: { historico: res, entrega },
        });
      },
    });
  }
  onArchiveRequest() {
    console.log('Arquivar entrega:', this.selectedRows[0]);
    /* this.dialogSrv.open(EntregaFormComponent, {
      header: 'Arquivar Entrega',
      width: '70%',
      data: { entrega: this.selectedRows[0] },
    }); */
  }

  onDeleteRequest() {
    console.log('Excluir entrega:', this.selectedRows[0]);
    /* this.dialogSrv.open(EntregaFormComponent, {
      header: 'Excluir Entrega',
      width: '70%',
      data: { entrega: this.selectedRows[0] },
    }); */
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
