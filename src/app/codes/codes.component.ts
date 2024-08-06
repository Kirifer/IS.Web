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
import { EditCodeComponent } from '../edit-code/edit-code.component';



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

  // http delete
  deleteSupply(id: string) {
    this.http.delete(`https://localhost:7012/supplycodes/${id}`).subscribe({
      next: () => {
        console.log('Supply successfully deleted');
        // Ensure id is a string for comparison
        this.dataSource.data = this.dataSource.data.filter((supplycodes: SupplyCodes) => supplycodes.id !== id);
        // Trigger change detection if necessary
        this.dataSource._updateChangeSubscription();
      },
      error: error => {
        console.error('Error deleting supply', error);
        // Log detailed error information
        if (error.status) {
          console.error(`HTTP Status: ${error.status}`);
        }
        if (error.message) {
          console.error(`Error Message: ${error.message}`);
        }
        if (error.error) {
          console.error(`Error Details: ${JSON.stringify(error.error)}`);
        }
      }
    });
  }

  // http update
  openEditForm(supply: SupplyCodes) {
    const dialogRef = this._dialog.open(EditCodeComponent, {
      data: supply
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateSupply(result);
      }
    });
  }
  updateSupply(supply: SupplyCodes) {
    this.http.put(`https://localhost:7012/supplycodes/${supply.id}`, supply).subscribe({
      next: () => {
        const index = this.dataSource.data.findIndex(item => item.id === supply.id);
        if (index !== -1) {
          this.dataSource.data[index] = supply;
          this.dataSource._updateChangeSubscription();
        }
      },
      error: error => {
        console.error('Error updating supply', error);
      }
    });
  }

  // this will automatically updates the supplyTaken (checked = true or unchecked = false)
  updateSupplyTaken(row: any, isChecked: boolean) {
    row.supplyTaken = isChecked;
    console.log('Updating supply taken status with row data:', row);
  
    this.http.put(`https://localhost:7012/supplycodes/${row.id}`, row)
      .subscribe({
        next: response => {
          console.log('Supply taken status updated', response);
        },
        error: error => {
          console.error('Error updating supply taken status', error);
          if (error.status === 400) {
            console.error('Bad Request: Please check the payload and endpoint.');
            console.error('Payload:', row);
            console.error('Endpoint:', `https://localhost:7012/supplycodes/${row.id}`);
          }
        }
      });
  }


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Supply Taken - checkbox (if the supplyTaken is false = unchecked, if true = checked)
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
