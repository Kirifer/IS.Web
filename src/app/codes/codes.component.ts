import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AddEditCodesComponent } from '../add-edit-codes/add-edit-codes.component';
import { Observable, of, tap, throwError, map, catchError, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SupplyCodes } from '../models/supplycodes';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ChangeDetectionStrategy, inject } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { EditCodeComponent } from '../edit-code/edit-code.component';
import { Supply } from '../models/supply';
import { ExcelExportService } from '../service/excel-export.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-codes',
  templateUrl: './codes.component.html',
  styleUrl: './codes.component.css'
})
export class CodesComponent {
  private codesUrl = environment.codesUrl;
  private supplyUrl = environment.supplyUrl;

  displayedColumns: string[] = ['codeDisplay', 'category', 'item', 'color', 'size','numberOfSupplies', 'supplyTaken','action'];
  dataSource = new MatTableDataSource<SupplyCodes>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _dialog: MatDialog, private http: HttpClient, private excelExportService: ExcelExportService) { }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  // connecting to web api
  supplyCodes$: Observable<SupplyCodes[]> = of([]);
  ngOnInit() {
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
  private getSupplyCodes(): Observable<SupplyCodes[]> {
    return this.http.get<{ data: SupplyCodes[] }>(`${this.codesUrl}`,{withCredentials: true}).pipe(
      map(response => response.data),
      tap(data => console.log('Data received', data)),
      catchError(error => {
        console.error('Error:', error);
        return throwError(() => new Error('Error fetching'));
      })
    );
  }

  // http delete
  deleteSupply(id: string) {
    this.http.delete(`${this.codesUrl}/${id}`,{withCredentials: true}).subscribe({
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
    this.http.put(`${this.codesUrl}/${supply.id}`, supply,{withCredentials: true}).subscribe({
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

    this.http.put(`${this.codesUrl}/${row.id}`, row,{withCredentials: true})
      .subscribe({
        next: response => {
          console.log('Supply taken status updated', response);
        },
        error: error => {
          console.error('Error updating supply taken status', error);
          if (error.status === 400) {
            console.error('Bad Request: Please check the payload and endpoint.');
            console.error('Payload:', row);
            console.error('Endpoint:', `${this.codesUrl}/${row.id}`);
          }
        }
      });
    
    // this will update the supplies table (if chekced, suppliesTaken will increment by 1, if unchecked, suppliesTaken will decrement by 1)
    if (isChecked) {
      this.http.get<{ data: Supply[] }>(`${this.supplyUrl}`, {
        params: {
          category: row.category,
          officeSupplies: row.officeSupplies,
          color: row.color,
          size: row.size
        },
        withCredentials: true
      }).pipe(
        map(response => response.data),
        switchMap(supplies => {
          // Filter supplies to find the exact match
          const exactMatch = supplies.find(supply =>
            supply.category === row.category &&
            supply.item === row.item &&
            supply.color === row.color &&
            supply.size === row.size
          );
  
          if (exactMatch) {
            if (isChecked) {
              exactMatch.suppliesTaken += 1;
            } else {
              exactMatch.suppliesTaken -= 1;
            }
            console.log('Payload for updating supplies table:', exactMatch);
            return this.http.put(`${this.supplyUrl}/${exactMatch.id}`, exactMatch,{withCredentials: true});
          } else {
            return throwError(() => new Error('No matching supply found'));
          }
        })
      ).subscribe({
        next: response => {
          console.log('Supplies table updated', response);
        },
        error: err => {
          console.error('Error updating supplies table', err);
        }
      });
    }
  }

  updateSupplyTakenStatus(row: any) {
    this.http.put(`${this.codesUrl}/${row.id}`, row,{withCredentials: true})
      .subscribe({
        next: response => {
          console.log('Supply taken status updated', response);
        },
        error: error => {
          console.error('Error updating supply taken status', error);
          if (error.status === 400) {
            console.error('Bad Request: Please check the payload and endpoint.');
            console.error('Payload:', row);
            console.error('Endpoint:', `${this.codesUrl}/${row.id}`);
          }
        }
      });
  }

  // PRINT TABLE TO EXCEL
  exportTableToExcel(): void {
    const dataToExport = this.dataSource.data.map(row => {
      return {
        Code: row.codeDisplay,
        Category: row.category,
        Item: row.item,
        Color: row.color,
        Size: row.size,
        SupplyTaken: row.supplyTaken ? 'Yes' : 'No'

      };
    });
    this.excelExportService.exportAsExcelFile(dataToExport, 'Supply_Codes');
  }
  
  
  

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

}