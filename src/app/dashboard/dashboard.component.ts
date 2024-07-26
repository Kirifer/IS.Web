import { Component, OnInit } from '@angular/core';
import {Chart, registerables} from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent implements OnInit {
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
      labels: ['JAN', 'FEB', 'MAR', 'APRIL'],
      datasets: [
        {
          label: 'Revenue',
          data: [10, 15, 20, 25],
          backgroundColor: '',
          hoverOffset: 10,
        },
      ],
    },
    options: {
      aspectRatio: 1, 
    },
  };


  

  firstChart: any;
  secondChart: any;
  thirdChart: any;

  ngOnInit(): void {
    this.firstChart = new Chart('MyFirstChart', this.firstFigure);
    this.secondChart = new Chart('MySecondChart', this.secondFigure);
  }
}
