import { Component, OnInit } from '@angular/core';
import {Chart, registerables} from 'chart.js';
import { Supply } from '../models/supply';
import { HttpClient } from '@angular/common/http';  
import { Observable,of,tap,throwError,map,catchError, } from 'rxjs';
import {AfterViewInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {CurrencyPipe} from '@angular/common';
import {MatDialog} from '@angular/material/dialog';
import { DatePipe } from '@angular/common';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent implements OnInit {
  displayedColumns: string[] = ['date', 'category', 'item', 'color','size','quantity'];
  dataSource = new MatTableDataSource<Supply>();

  totalQuantity: number = 0;
  totalSuppliesTaken: number = 0;
  totalSuppliesLeft: number = 0;
  totalCategory: number = 0;
  secondChart: any;

  public secondFigure: any = {
    type: 'pie',

    data: {
      labels: ['Total Items', 'Supplies Taken', 'Supplies Left',],
      datasets: [
        {
          data: [this.totalQuantity, this.totalSuppliesTaken, this.totalSuppliesLeft],
          backgroundColor: ['#004ba3', '#00b8d4', '#d2a517'],
        },
      ],
    },
    options: {
      aspectRatio: 1, 
    },
  };

  supplies$: Observable<Supply[]> = of([]);
  ngOnInit(){
    this.supplies$ = this.getSupplies();
    this.supplies$.subscribe({
      next: supplies => {
        console.log('Supplies in component:', supplies);
        this.dataSource.data = supplies.sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()); // sort from new to old
        this.dataSource.data = this.dataSource.data.slice(0, 7); // limits the data to 7
      },
      error: err => console.log('Error in subscription:', err)
    });
    this.secondChart = new Chart('MySecondChart', this.secondFigure);
    this.fetchAndProcessSupplies();
  }

  // http get
  constructor(private http: HttpClient) {}
  private getSupplies(): Observable<Supply[]>{
    return this.http.get<{data: Supply[]}>('https://localhost:7012/supplies').pipe(
      map(response => response.data),
      tap(data => console.log('Data received',data)),
      catchError(error => {
        console.error('Error:',error);
        return throwError(() => new Error('Error fetching'));
      })
    );
  }
  // automatically shows the chart
  ngAfterViewInit() {
    this.secondChart = new Chart('MySecondChart', this.secondFigure);
    this.updateSecondFigure();
  }

  // add the total quantity, supplies taken, and supplies left
  fetchAndProcessSupplies() {
    this.getSupplies().subscribe(data => {
      this.totalQuantity = data.reduce((sum, item) => sum + item.quantity, 0); // sums of quantity in supplies table
      this.totalSuppliesTaken = data.reduce((sum, item) => sum + item.suppliesTaken, 0); // sums of supplies taken in supplies table
      this.totalSuppliesLeft = data.reduce((sum, item) => sum + item.suppliesLeft, 0); // sums of supplies left in supplies table
      this.totalCategory = new Set(data.map(item => item.category)).size; // total category in supplies table
      this.secondChart.data.datasets[0].data = [this.totalQuantity, this.totalSuppliesTaken, this.totalSuppliesLeft];
      this.updateSecondFigure();
    });
  }

  // update the second chart wherein it sets the data that coming from the database
  updateSecondFigure() {
    if (this.secondChart) {
      this.secondChart.data.datasets[0].data = [
        this.totalQuantity,
        this.totalSuppliesTaken,
        this.totalSuppliesLeft
      ];
      this.secondChart.update();
    }
  }
  
}
