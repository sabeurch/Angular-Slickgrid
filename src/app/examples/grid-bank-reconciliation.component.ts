import { Component, OnInit } from '@angular/core';
import { Column, FieldType, Formatter, Formatters, GridOption, AngularGridInstance } from './../modules/angular-slickgrid';

// Custom formatter for transaction status
const statusFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any) => {
  if (value === 'Matched') {
    return `<i class="fa fa-check" style="color: green;" aria-hidden="true"></i> ${value}`;
  } else if (value === 'Unmatched') {
    return `<i class="fa fa-times" style="color: red;" aria-hidden="true"></i> ${value}`;
  } else if (value === 'Pending') {
    return `<i class="fa fa-clock-o" style="color: orange;" aria-hidden="true"></i> ${value}`;
  }
  return value;
};

// Custom formatter for amount with currency
const currencyFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any) => {
  if (value === null || value === undefined) {
    return '';
  }
  const amount = parseFloat(value);
  const color = amount < 0 ? 'red' : 'green';
  return `<span style="color: ${color};">$${amount.toFixed(2)}</span>`;
};

@Component({
  templateUrl: './grid-bank-reconciliation.component.html'
})
export class GridBankReconciliationComponent implements OnInit {
  title = 'Example: Bank Reconciliation Features';
  subTitle = `
    This example demonstrates key Angular-Slickgrid features used in bank reconciliation solutions:
    <ul>
      <li><strong>Custom Formatters</strong> - Status indicators and currency formatting</li>
      <li><strong>Filtering</strong> - Filter by status, date range, or amount</li>
      <li><strong>Sorting</strong> - Multi-column sorting for transaction analysis</li>
      <li><strong>Row Selection</strong> - Select transactions for matching</li>
      <li><strong>Inline Editing</strong> - Edit transaction details</li>
      <li><strong>Export</strong> - Export reconciliation data to CSV</li>
      <li><strong>Auto-resize</strong> - Responsive grid layout</li>
    </ul>
  `;

  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset: any[];
  angularGrid: AngularGridInstance;

  ngOnInit(): void {
    this.columnDefinitions = [
      {
        id: 'select',
        name: '',
        field: 'id',
        width: 30,
        maxWidth: 30,
        checkboxSelection: true,
        excludeFromExport: true
      },
      {
        id: 'transactionId',
        name: 'Transaction ID',
        field: 'transactionId',
        sortable: true,
        filterable: true,
        type: FieldType.string,
        width: 120
      },
      {
        id: 'date',
        name: 'Date',
        field: 'date',
        formatter: Formatters.dateIso,
        sortable: true,
        filterable: true,
        type: FieldType.dateIso,
        exportWithFormatter: true,
        width: 100
      },
      {
        id: 'description',
        name: 'Description',
        field: 'description',
        sortable: true,
        filterable: true,
        type: FieldType.string,
        width: 200
      },
      {
        id: 'debit',
        name: 'Debit',
        field: 'debit',
        formatter: currencyFormatter,
        sortable: true,
        filterable: true,
        type: FieldType.number,
        exportWithFormatter: true,
        width: 100
      },
      {
        id: 'credit',
        name: 'Credit',
        field: 'credit',
        formatter: currencyFormatter,
        sortable: true,
        filterable: true,
        type: FieldType.number,
        exportWithFormatter: true,
        width: 100
      },
      {
        id: 'balance',
        name: 'Running Balance',
        field: 'balance',
        formatter: currencyFormatter,
        sortable: true,
        type: FieldType.number,
        exportWithFormatter: true,
        width: 120
      },
      {
        id: 'status',
        name: 'Status',
        field: 'status',
        formatter: statusFormatter,
        sortable: true,
        filterable: true,
        type: FieldType.string,
        width: 120,
        filter: {
          model: Formatters.multipleSelect,
          collection: [
            { value: 'Matched', label: 'Matched' },
            { value: 'Unmatched', label: 'Unmatched' },
            { value: 'Pending', label: 'Pending' }
          ]
        }
      },
      {
        id: 'reference',
        name: 'Reference',
        field: 'reference',
        sortable: true,
        filterable: true,
        type: FieldType.string,
        width: 120
      }
    ];

    this.gridOptions = {
      autoResize: {
        containerId: 'demo-container',
        sidePadding: 15
      },
      enableAutoResize: true,
      enableCellNavigation: true,
      enableFiltering: true,
      enableCheckboxSelector: true,
      enableRowSelection: true,
      rowSelectionOptions: {
        selectActiveRow: false
      },
      enableExcelCopyBuffer: true,
      enableExport: true,
      exportOptions: {
        sanitizeDataExport: true
      }
    };

    // Mock dataset for bank reconciliation
    this.dataset = this.generateMockBankTransactions();
  }

  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
  }

  generateMockBankTransactions(): any[] {
    const transactions = [];
    const descriptions = [
      'Direct Deposit - Salary',
      'ACH Payment - Rent',
      'Wire Transfer - Supplier',
      'Check #1001',
      'Debit Card Purchase',
      'ATM Withdrawal',
      'Interest Credit',
      'Service Fee',
      'Online Transfer',
      'Mobile Payment'
    ];
    const statuses = ['Matched', 'Unmatched', 'Pending'];
    
    let runningBalance = 10000.00;
    
    for (let i = 0; i < 100; i++) {
      const randomYear = 2024;
      const randomMonth = Math.floor(Math.random() * 12);
      const randomDay = Math.floor(Math.random() * 28) + 1;
      const isDebit = Math.random() > 0.5;
      const amount = parseFloat((Math.random() * 2000 + 50).toFixed(2));
      
      const debit = isDebit ? amount : null;
      const credit = !isDebit ? amount : null;
      
      if (isDebit) {
        runningBalance -= amount;
      } else {
        runningBalance += amount;
      }

      transactions.push({
        id: i,
        transactionId: `TXN${String(i + 1000).padStart(6, '0')}`,
        date: new Date(randomYear, randomMonth, randomDay),
        description: descriptions[Math.floor(Math.random() * descriptions.length)],
        debit: debit,
        credit: credit,
        balance: parseFloat(runningBalance.toFixed(2)),
        status: statuses[Math.floor(Math.random() * statuses.length)],
        reference: `REF${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`
      });
    }
    
    return transactions;
  }

  exportToCSV() {
    if (this.angularGrid && this.angularGrid.exportService) {
      this.angularGrid.exportService.exportToFile({
        delimiter: ',',
        filename: 'bank-reconciliation-export',
        format: 'csv'
      });
    }
  }
}
