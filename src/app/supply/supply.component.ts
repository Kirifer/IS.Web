import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AddEditComponent } from '../add-edit/add-edit.component';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Supply } from '../models/supply';
import { SupplyService } from '../service/supply.service';
import { environment } from '../../environments/environment';
import { Observable,of,tap,throwError,map,catchError, } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-supply',
  templateUrl: './supply.component.html',
  styleUrls: ['./supply.component.css']
})
export class SupplyComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['category', 'item', 'color', 'size', 'quantity', 'supplies_taken', 'supplies_left', 'cost_per_unit', 'total', 'action'];
  dataSource = new MatTableDataSource<Supply>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _dialog: MatDialog, private http: HttpClient) {}

  // connecting to web api
  supplies$: Observable<Supply[]> = of([]);
  ngOnInit() {
    this.supplies$ = this.getSupplies();
    this.supplies$.subscribe({
      next: supplies => {
        console.log('Supplies in component:', supplies);
        this.dataSource.data = supplies; // Update the data source (data -> table)
      },
      error: err => console.log('Error in subscription:', err)
    });
  }
  // http get
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

  // http delete
  
  // Add Supply (Form)
  openAddEditForm() {
    this._dialog.open(AddEditComponent);
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
