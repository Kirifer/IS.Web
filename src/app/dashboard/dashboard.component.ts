import { Component, OnInit } from '@angular/core';
import {Chart, registerables} from 'chart.js';
import { Supply } from '../models/supply';
import { HttpClient } from '@angular/common/http';
import { Observable,of,tap,throwError,map,catchError, } from 'rxjs';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent implements OnInit {
  totalQuantity: number = 0;
  totalSuppliesTaken: number = 0;
  totalSuppliesLeft: number = 0;
  firstChart: any;
  secondChart: any;

  public firstFigure: any = {
    type: 'bar',

    data: {
      labels: ['JAN', 'FEB', 'MAR', 'APRIL'],
      datasets: [
        {
          label: 'Budget',
          data: [10, 15, 20, 25],
          backgroundColor: 'blue',
          hoverOffset: 10,  
        },
        {
          label: 'Expense',
          data: [10, 15, 20, 25],
          backgroundColor: 'red',
        },
      ],
    },
    options: {
      aspectRatio: 1, 
    },
  };

  public secondFigure: any = {
    type: 'pie',

    data: {
      labels: ['Total Items', 'Supplies Taken', 'Supplies Left',],
      datasets: [
        {
          data: [this.totalQuantity, this.totalSuppliesTaken, this.totalSuppliesLeft],
          backgroundColor: ['#004ba3', '#844ddc', '#d2a517'],
        },
      ],
    },
    options: {
      aspectRatio: 1, 
    },
  };

  
  

  ngOnInit(): void {
    this.firstChart = new Chart('MyFirstChart', this.firstFigure);
    this.secondChart = new Chart('MySecondChart', this.secondFigure);
    this.fetchAndProcessSupplies();
    //second figure
    // this.getSupplies().subscribe(data => {
    //   this.totalQuantity = data.reduce((sum, item) => sum + item.quantity, 0);
    //   this.totalSuppliesTaken = data.reduce((sum, item) => sum + item.suppliesTaken, 0);
    //   this.totalSuppliesLeft = data.reduce((sum, item) => sum + item.suppliesLeft, 0);

    //   this.updateSecondFigure();
    // });
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

  // add the total quantity, supplies taken, and supplies left
  fetchAndProcessSupplies(): void {
    this.getSupplies().subscribe(data => {
      this.totalQuantity = data.reduce((sum, item) => sum + item.quantity, 0);
      this.totalSuppliesTaken = data.reduce((sum, item) => sum + item.suppliesTaken, 0);
      this.totalSuppliesLeft = data.reduce((sum, item) => sum + item.suppliesLeft, 0);
      this.secondChart.data.datasets[0].data = [this.totalQuantity, this.totalSuppliesTaken, this.totalSuppliesLeft];
      this.updateSecondFigure();
    });
  }

  // update the second chart wherein it sets the data that coming from the database
  updateSecondFigure(): void {
    this.secondFigure.data.datasets[0].data = [
      this.totalQuantity,
      this.totalSuppliesTaken,
      this.totalSuppliesLeft
    ];
  }
  
}
