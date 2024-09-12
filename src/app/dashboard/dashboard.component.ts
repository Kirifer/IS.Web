import { Component, OnInit } from '@angular/core';
import {Chart, registerables} from 'chart.js';
import { Supply } from '../models/supply';
import { HttpClient } from '@angular/common/http';  
import { Observable,of,tap,throwError,map,catchError, } from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';
import { environment } from '../../environments/environment';
import { AuthService } from '../service/auth.service';
import { User } from '../models/user';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { MatDialog } from '@angular/material/dialog';
import {MatMenuTrigger} from '@angular/material/menu';
import { HttpHeaders } from '@angular/common/http';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent implements OnInit {
  loggedInUser: User | null = null;

  displayedColumns: string[] = ['date', 'category', 'item', 'color','size','quantity'];
  dataSource = new MatTableDataSource<Supply>();
  supplyUrl = environment.supplyUrl;
  identityUrl = environment.identityUrl;
  userUrl = environment.userUrl;

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
  constructor(private http: HttpClient, private authService: AuthService, private _dialog: MatDialog) {}

  supplies$: Observable<Supply[]> = of([]);
  ngOnInit(){
    this.supplies$ = this.getSupplies();
    this.supplies$.subscribe({
      next: supplies => {
        console.log('Supplies in component:', supplies);
        this.dataSource.data = supplies.sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime());
        this.dataSource.data = this.dataSource.data.slice(0, 7); // limits the data to 7
      },
      error: err => console.log('Error in subscription:', err)
    });
    this.secondChart = new Chart('MySecondChart', this.secondFigure);
    this.fetchAndProcessSupplies();
    this.loggedInUser = this.authService.getCurrentUser();
    

  }

  // http get
  
  private getSupplies(): Observable<Supply[]>{
    return this.http.get<{data: Supply[]}>(this.supplyUrl,{withCredentials: true}).pipe(
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


  // edit user
  openEditForm(user: User | null) {
    console.log('Edit user:', user);
    console.log('Logged-in user:', user?.userId);
    if (user) {
      const dialogRef = this._dialog.open(EditUserComponent, {
        data: user
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.authService.updateUser(result);
        }
      });
    } else {
      console.error('No logged-in user available');
    }
  }
  

  // Function to handle password change
  changePassword(user: User| null) {
    // Logic to handle password change for the user
    console.log('Change password for:', user);
  }

  // Update the user with new details
  
  

}
