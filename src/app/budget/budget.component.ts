import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap, throwError, map, catchError } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { BudgetExpenses } from '../models/budgetexpenses';
import { AddEditBudgetComponent } from '../add-edit-budget/add-edit-budget.component';
import { EditBudgetComponent } from '../edit-budget/edit-budget.component';
import { environment } from '../../environments/environment';

Chart.register(...registerables);

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css']
})
export class BudgetComponent implements OnInit, AfterViewInit {
  private budgetUrl = environment.budgetUrl;

  totalBudget: number = 0;
  totalExpenses: number = 0;
  totalLeft: number = 0;
  displayedColumns: string[] = ['monthCreated','yearCreated', 'budget', 'expenses', 'totalBudget', 'action'];
  dataSource = new MatTableDataSource<BudgetExpenses>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  firstChart: any;
  selectedYear: string = new Date().getFullYear().toString();
  years: string[] = [];
  currentDataIndex: number = 0;

  constructor(private _dialog: MatDialog, private http: HttpClient) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  budgetExpenses$: Observable<BudgetExpenses[]> = of([]);

  ngOnInit() {
    this.getAvailableYears();
    this.budgetExpenses$ = this.getBudgetExpenses();
    this.budgetExpenses$.subscribe({
      next: budget => {
        console.log('Supplies in component:', budget);
        this.dataSource.data = budget;
        this.calculateTotals(budget);
        this.updateChart();
      },
      error: err => console.log('Error in subscription:', err)
    });
  }

  private getBudgetExpenses(): Observable<BudgetExpenses[]> {
    return this.http.get<{ data: BudgetExpenses[] }>(`${this.budgetUrl}`).pipe(
      map(response => response.data),
      tap(data => console.log('Data received', data)),
      catchError(error => {
        console.error('Error:', error);
        return throwError(() => new Error('Error fetching'));
      })
    );
  }

  private calculateTotals(budgetExpenses: BudgetExpenses[]) {
    this.totalBudget = budgetExpenses.reduce((sum, item) => sum + item.budget, 0);
    this.totalExpenses = budgetExpenses.reduce((sum, item) => sum + item.expenses, 0);
    this.totalLeft = this.totalBudget - this.totalExpenses;
  }

  private updateChart() {
    const budgetExpenses = this.dataSource.data.filter(expense => 
      new Date(expense.dateCreated).getFullYear().toString() === this.selectedYear
    );

    budgetExpenses.sort((a, b) => new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime());

    const filteredExpenses = budgetExpenses.slice(this.currentDataIndex, this.currentDataIndex + 5);

    const labels = filteredExpenses.map(expense => this.formatDate(expense.dateCreated));
    const budgetData = filteredExpenses.map(expense => expense.budget);
    const expensesData = filteredExpenses.map(expense => expense.expenses);

    if (this.firstChart) {
      this.firstChart.destroy();
    }

    this.firstChart = new Chart('MyFirstChart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Expenses',
            data: expensesData,
            backgroundColor: 'red',
          },
          {
            label: 'Budget',
            data: budgetData,
            backgroundColor: 'blue',
          },
        ],
      },
      options: {
        aspectRatio: 1,
      },
    });
  }

  private formatDate(dateCreated: string): string {
    const date = new Date(dateCreated);
    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];  
    return monthNames[date.getMonth()];
  }

  onYearChange(year: string) {
    this.selectedYear = year;
    this.currentDataIndex = 0; // Reset to the first set of data for the new year
    this.updateChart();
  }

  nextDataSet() {
    const budgetExpenses = this.dataSource.data.filter(expense => 
      new Date(expense.dateCreated).getFullYear().toString() === this.selectedYear
    );

    if (this.currentDataIndex + 5 < budgetExpenses.length) {
      this.currentDataIndex += 5;
      this.updateChart();
    }
  }

  previousDataSet() {
    if (this.currentDataIndex > 0) {
      this.currentDataIndex -= 5;
      this.updateChart();
    }
  }

  private getAvailableYears() {
    const currentYear = new Date().getFullYear();
    const endYear = currentYear + 1;
    for (let year = 2023; year <= endYear; year++) {
      this.years.push(year.toString());
    }
}

  deleteBudgetExpenses(id: string) {
    this.http.delete(`${this.budgetUrl}/${id}`).subscribe({
      next: () => {
        console.log('Supply successfully deleted');
        this.dataSource.data = this.dataSource.data.filter((budget: BudgetExpenses) => budget.id !== id);
        this.dataSource._updateChangeSubscription();
        this.updateChart(); // Refresh the chart after deletion
      },
      error: error => {
        console.error('Error deleting supply', error);
      }
    });
  }

  openEditForm(supply: BudgetExpenses) {
    const dialogRef = this._dialog.open(EditBudgetComponent, {
      data: supply
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateSupply(result);
      }
    });
  }

  updateSupply(supply: BudgetExpenses) {
    this.http.put(`${this.budgetUrl}/${supply.id}`, supply).subscribe({
      next: () => {
        const index = this.dataSource.data.findIndex(item => item.id === supply.id);
        if (index !== -1) {
          this.dataSource.data[index] = supply;
          this.dataSource._updateChangeSubscription();
          this.updateChart(); // Refresh the chart after update
        }
      },
      error: error => {
        console.error('Error updating supply', error);
      }
    });
  }

  openAddEditForm() {
    this._dialog.open(AddEditBudgetComponent);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
