import { Injectable } from '@angular/core';
import { GridApi, Column } from 'ag-grid-community';
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
    // Pega todas as colunas visíveis (incluindo as que estão dentro de grupos)
    const allDisplayedColumns = gridApi.getAllDisplayedColumns();

    if (!allDisplayedColumns || allDisplayedColumns.length === 0) {
      console.warn('Nenhuma coluna encontrada para exportação.');
      return;
    }

    // Filtra apenas colunas que têm field (exclui colunas de ação, checkbox, etc.)
    const dataColumns = allDisplayedColumns.filter(col => {
      const colDef = col.getColDef();
      return colDef.field && !colDef.cellRenderer; // Exclui colunas com cellRenderer (botões)
    });

    if (dataColumns.length === 0) {
      console.warn('Nenhuma coluna de dados encontrada para exportação.');
      return;
    }

    // Cria os headers baseado nos headerName das colunas
    const headers = dataColumns.map(col => {
      const colDef = col.getColDef();
      return colDef.headerName || colDef.field || col.getColId();
    });

    // Pega dados das linhas
    let rowData: any[] = [];
    if (selectedOnly) {
      rowData = gridApi.getSelectedRows();
    } else {
      gridApi.forEachNode(node => {
        if (node.data) { // Certifica que o node tem dados
          rowData.push(node.data);
        }
      });
    }

    if (rowData.length === 0) {
      console.warn(selectedOnly ? 'Nenhuma linha selecionada.' : 'Nenhum dado encontrado.');
      return;
    }

    // Cria os dados filtrados apenas com as colunas de dados
    const filteredRowData = rowData.map(row => {
      const filtered: any = {};
      dataColumns.forEach((col, index) => {
        const colDef = col.getColDef();
        const fieldName = colDef.field!;

        // Se existe um valueFormatter, aplica a formatação
        if (colDef.valueFormatter && typeof colDef.valueFormatter === 'function') {
          try {
            filtered[headers[index]] = colDef.valueFormatter({
              value: row[fieldName],
              data: row,
              node: null,
              colDef: colDef,
              column: col,
              api: gridApi,
              context: null
            });
          } catch (error) {
            // Se der erro na formatação, usa o valor original
            filtered[headers[index]] = row[fieldName];
          }
        } else {
          filtered[headers[index]] = row[fieldName];
        }
      });
      return filtered;
    });

    console.log('Dados para exportação:', filteredRowData);
    console.log('Headers:', headers);

    this.exportToExcel(filteredRowData, headers, fileName);
  }
}
