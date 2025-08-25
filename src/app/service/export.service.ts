import { Injectable } from '@angular/core';
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
   * Exporta dados do ag-Grid para Excel respeitando colunas visíveis e ordem
   * @param gridApi API do ag-Grid
   * @param columnApi API de colunas do ag-Grid
   * @param fileName Nome do arquivo Excel
   */
  exportGridToExcel(gridApi: any, columnApi: any, fileName: string = 'dados') {
    const displayedColumns = columnApi.getAllDisplayedColumns();
    if (!displayedColumns || !displayedColumns.length) {
      console.warn('Nenhuma coluna visível encontrada para exportação.');
      return;
    }

    // Cria headers baseados nas colunas visíveis
    const headers = displayedColumns.map(col => col.getColDef().headerName || col.getColId());

    // Cria array de objetos apenas com colunas visíveis
    const rowData: any[] = [];
    gridApi.forEachNode(node => {
      const row: any = {};
      displayedColumns.forEach(col => {
        const colId = col.getColId();
        row[colId] = node.data[colId];
      });
      rowData.push(row);
    });

    this.exportToExcel(rowData, headers, fileName);
  }
}
