import { Component } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import {AfterViewInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { AddEditCodesComponent } from '../add-edit-codes/add-edit-codes.component';
import { Observable,of,tap,throwError,map,catchError, } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SupplyCodes } from '../models/supplycodes';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {ChangeDetectionStrategy, inject} from '@angular/core';
import {JsonPipe} from '@angular/common';




@Component({
  selector: 'app-codes',
  templateUrl: './codes.component.html',
  styleUrl: './codes.component.css'
})
export class CodesComponent {
  displayedColumns: string[] = ['code','category', 'officeSupplies', 'numberOfItems', 'color', 'size','action','supplyTaken'];
  dataSource = new MatTableDataSource<SupplyCodes>();


  constructor(private _dialog: MatDialog, private http: HttpClient){}

  // connecting to web api
  supplyCodes$: Observable<SupplyCodes[]> = of([]);
  ngOnInit(){
    this.supplyCodes$ = this.getSupplyCodes();
    this.supplyCodes$.subscribe({
      next: supplycodes => {
        console.log('Supply Codes in component:', supplycodes);
        this.dataSource.data = supplycodes;
      },
      error: err => console.log('Error in subscription:', err)
    });
  }

  // http get
  private getSupplyCodes(): Observable<SupplyCodes[]>{
    return this.http.get<{data: SupplyCodes[]}>('https://localhost:7012/supplycodes').pipe(
      map(response => response.data),
      tap(data => console.log('Data received', data)),
      catchError(error => {
        console.error('Error:',error);
        return throwError(() => new Error('Error fetching'));
      })
    );
  }

  // ADD - EDIT Supply
  openAddEditForm(){
    this._dialog.open(AddEditCodesComponent);
  }



  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Supply Taken
  private readonly _formBuilder = inject(FormBuilder);
  readonly taken = this._formBuilder.group({
    supplyTaken: false,
  });

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
