import { Injectable } from '@angular/core';
import { GridApi } from 'ag-grid-community';
import * as XLSX from 'xlsx';

@Injectable({ providedIn: 'root' })
export class ExportService {

  constructor() { }

  /**
   * Exporta qualquer array de objetos para Excel (.xlsx)
   * @param data Array de objetos
   * @param headers Array de nomes de colunas (opcional)
   * @param fileName Nome do arquivo
   */
   private exportToExcel(data: any[], headers?: string[], fileName: string = 'dados') {
    if (!data || !data.length) {
      console.warn('Nenhum dado disponível para exportar.');
      return;
    }

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data, headers ? { header: headers } : {});
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Planilha1');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  }
  /**
   * Exporta dados do ag-Grid para Excel
   * @param gridApi API do ag-Grid
   * @param fileName Nome do arquivo Excel
   * @param selectedOnly Se true, exporta apenas linhas selecionadas
   */
  exportGridToExcel(gridApi: GridApi, selectedOnly: boolean, fileName: string = 'dados') {
    const allColumns = gridApi.getAllDisplayedColumns();
    if (!allColumns) {
      console.warn('Nenhuma coluna encontrada para exportação.');
      return;
    }

    // Apenas colunas visíveis
    const displayedColumns = allColumns.filter(col => col.isVisible());
    const headers = displayedColumns.map(col => col.getColDef().headerName || col.getColId());

    // Pega dados das linhas
    let rowData: any[] = [];
    if (selectedOnly) {
      rowData = gridApi.getSelectedRows();
    } else {
      gridApi.forEachNode(node => {
        rowData.push(node.data);
      });
    }

    // Só mantém as colunas visíveis
    const filteredRowData = rowData.map(row => {
      const filtered: any = {};
      displayedColumns.forEach(col => {
        const colId = col.getColId();
        filtered[colId] = row[colId];
      });
      return filtered;
    });
debugger;
    this.exportToExcel(filteredRowData, headers, fileName);
  }
}
