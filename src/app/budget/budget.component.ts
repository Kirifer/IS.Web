import { Component, OnInit } from '@angular/core';
import {Chart, registerables} from 'chart.js';
import { Supply } from '../models/supply';
import { HttpClient } from '@angular/common/http';
import { Observable,of,tap,throwError,map,catchError, } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
Chart.register(...registerables);



@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrl: './budget.component.css'
})
export class BudgetComponent implements OnInit{
  firstChart: any;
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

  ngOnInit() {
    this.firstChart = new Chart('MyFirstChart', this.firstFigure);
  }
}
