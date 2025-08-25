import { AG_GRID_LOCALE_BR } from '@ag-grid-community/locale';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  GridOptions,
  ICellRendererParams,
  GridApi,
  GridReadyEvent,
  ColDef,
  ColGroupDef,
} from 'ag-grid-community';
import { ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { map, Subject, takeUntil } from 'rxjs';
import { AgCellArchiveButtonComponent } from 'src/app/components/ag-grid-buttons/ag-cell-archive-button/ag-cell-archive-button.component';
import { AgCellDeleteButtonComponent } from 'src/app/components/ag-grid-buttons/ag-cell-delete-button/ag-cell-delete-button.component';
import { AgCellHistoryButtonComponent } from 'src/app/components/ag-grid-buttons/ag-cell-history-button/ag-cell-history-button.component';
import { AgCellStatusForwardButtonComponent } from 'src/app/components/ag-grid-buttons/ag-cell-statusforward-button/ag-cell-statusforward-button.component';
import { EntregaFormComponent } from 'src/app/components/modals/entrega-form/entrega-form.component';
import { HistoricoEntregaComponent } from 'src/app/components/modals/historico-entrega/historico-entrega.component';
import {
  EntregaInterface,
  EntregaStatus,
} from 'src/app/interfaces/entrega.interface';
import { AuthService } from 'src/app/service/auth.service';
import { EntregaService } from 'src/app/service/entregas.service';
import { ExportService } from 'src/app/service/export.service';
import { ThemeService } from 'src/app/service/theme.service';
import { ToastService } from 'src/app/service/toast.service';
import { v4 as uuidv4 } from 'uuid';
@Component({
  selector: 'app-entregas-list',
  templateUrl: './entregas-list.component.html',
  styleUrls: ['./entregas-list.component.scss'],
  providers: [DialogService, ConfirmationService],
})
export class EntregasListComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly entregaSrv = inject(EntregaService);
  private readonly dialogSrv = inject(DialogService);
  private readonly themeSrv = inject(ThemeService);
  private readonly authSrv = inject(AuthService);
  private readonly toastSrv = inject(ToastService);
  private readonly confirmationDialogSrv: ConfirmationService =
    inject(ConfirmationService);
  private readonly exportSrv: ExportService = inject(ExportService); // ExportService

  gridApi!: GridApi<EntregaInterface>;
  selectedRows: EntregaInterface[] = [];
  filtro = '';
  showGridInDarkMode = false;
  ref: DynamicDialogRef | undefined;

  /** Definição de colunas */
  private columnDefs: (
    | ColDef<EntregaInterface, any>
    | ColGroupDef<EntregaInterface>
  )[] = [
    {
      filter: false,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 50,
      suppressSizeToFit: true,
    },
    {
      headerName: 'Dados da Entrega',
      children: [
        {
          field: 'id',
          headerName: 'Código Único de Produto',
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
      ],
    },
    {
      headerName: 'Ações',

      children: [
        {
          headerName: 'Avançar',
          cellRenderer: AgCellStatusForwardButtonComponent,
          width: 70,
          cellRendererParams: {
            moveStatusForward: (rowData: EntregaInterface) =>
              console.log(rowData),
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
            onHistory: (rowData: EntregaInterface) => {},
          },
        },
        {
          headerName: 'Excluir',
          cellRenderer: AgCellDeleteButtonComponent,
          width: 70,
          cellRendererParams: {
            onHistory: (rowData: EntregaInterface) => {},
          },
        },
      ],
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
    doesExternalFilterPass: this.externalFilterPass.bind(this),
  };

  /** Botões da toolbar (reagem à seleção) */
  get crudGridBtnArr() {
    return [
      {
        icon: 'fa-solid fa-file-excel',
        pTooltip:
          this.selectedRows.length > 0
            ? 'Exportar dados selecionados para Excel'
            : 'Exportar dados para Excel',
        severity: 'primary',
        disabled: false,
      },
      {
        icon: 'fa-solid fa-plus',
        pTooltip: 'Incluir nova entrega',
        severity: 'success',
        disabled: false,
      },
      {
        icon: 'fa-solid fa-pen-to-square',
        pTooltip: 'Editar entrega',
        severity: 'warning',
        disabled: this.selectedRows.length !== 1,
      },
      {
        icon: 'fa-solid fa-folder-open',
        pTooltip: 'Abrir Histórico de entrega',
        severity: 'info',
        disabled: this.selectedRows.length !== 1,
      },
      {
        icon: 'fa-solid fa-box-archive',
        pTooltip: 'Arquivar entrega',
        severity: 'secondary',
        disabled: this.selectedRows.length === 0,
      },
      {
        icon: 'fa-solid fa-trash-can',
        pTooltip: 'Excluir entrega',
        severity: 'danger',
        disabled: this.selectedRows.length === 0,
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
      .pipe(
        takeUntil(this.destroy$),
        map((entregas) => entregas.filter((entrega) => !entrega.arquivado))
      )
      .subscribe({
        next: (res) => {
          this.gridApi.updateGridOptions({ rowData: res });
          this.gridApi.sizeColumnsToFit();
        },
        error: () => {},
      });
  }

  private externalFilterPass(node: any): boolean {
    if (!node.data) return false;

    const term = this.filtro.toLowerCase().trim();
    if (!term) return true;

    const searchableFields = [
      node.data.cliente,
      node.data.produto,
      node.data.status,
      node.data.id,
      node.data.createdBy,
      node.data.updatedBy,
      node.data.observacoes,
    ].filter(Boolean);

    // Busca otimizada - para na primeira ocorrência
    return searchableFields.some((field) => field.toLowerCase().includes(term));
  }

  addNewEntrega() {
    console.log('Adicionar nova entrega');
    this.dialogSrv.open(EntregaFormComponent, {
      header: 'Nova Entrega',
      width: '70%',
      data: {},
    });
  }

  editNewEntrega() {
    console.log('Editar entrega:', this.selectedRows[0]);
    this.dialogSrv.open(EntregaFormComponent, {
      header: 'Editar Entrega',
      width: '70%',
      data: { entrega: this.selectedRows[0] },
    });
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
    this.confirmationDialogSrv.confirm({
      message:
        this.selectedRows.length === 1
          ? 'Tem certeza que deseja arquivar esta entrega ?'
          : 'Tem certeza que deseja arquivar estas entregas ?',
      icon: 'fa-solid fa-triangle-exclamation',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        const archiveOperations = this.selectedRows.map((entrega) => {
          const historicoData = {
            status: EntregaStatus.Arquivada,
            date: new Date(),
            id: uuidv4(),
            observacoes: `Arquivado por ${
              this.authSrv.currentUser?.displayName || 'Sistema'
            }`,
          };

          return this.entregaSrv.archiveEntrega(entrega).then(() => {
            return this.entregaSrv.addHistoricoEntrega(
              entrega.id,
              historicoData
            );
          });
        });

        Promise.all(archiveOperations)
          .then(() => {
            this.selectedRows = [];
          })
          .catch((error) => {
            console.error('Erro ao arquivar entregas:', error);
          })
          .finally(() => {
            this.toastSrv.notify(
              'success',
              'Entregas arquivadas com sucesso',
              '',
              5000
            );
          });
      },
      reject: () => {
        console.log('não foi');
      },
    });
  }

  onDeleteRequest() {
    console.log('Excluir entrega:', this.selectedRows[0]);
    this.confirmationDialogSrv.confirm({
      message:
        this.selectedRows.length === 1
          ? 'Tem certeza que deseja excluir esta entrega ?'
          : 'Tem certeza que deseja excluir estas entregas ?',
      icon: 'fa-solid fa-triangle-exclamation',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        console.log('foi');
        this.selectedRows.forEach((entrega) => {
          this.entregaSrv.deleteEntrega(entrega.id).then((res) => {});
        });
      },
      reject: () => {
        console.log('não foi');
      },
    });
  }


  private exportToExcel(): void {
    const exportSelected = this.selectedRows.length > 0;
    const filename = `Lista_de_Entregas_${
      new Date().toISOString().split('T')[0]
    }`;

    this.exportSrv.exportGridToExcel(this.gridApi, exportSelected, filename);
  }

  trackByFn(index: number, item: any) {
    return index;
  }

  handleButtonClick(index: number) {
    console.log(index);

    const actions = [
      () => this.exportToExcel(),
      () => this.addNewEntrega(),
      () => this.editNewEntrega(),
      () => this.onHistoryRequest(),
      () => this.onArchiveRequest(),
      () => this.onDeleteRequest(),
    ];

    const action = actions[index];
    if (action) {
      action();
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
