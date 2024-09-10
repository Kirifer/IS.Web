import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AddEditComponent } from '../add-edit/add-edit.component';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Supply } from '../models/supply';
import { Observable,of,tap,throwError,map,catchError, } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EditSupplyComponent } from '../edit-supply/edit-supply.component';
import { ExcelExportService } from '../service/excel-export.service';
import { environment } from '../../environments/environment';


@Component({
  selector: 'app-supply',
  templateUrl: './supply.component.html',
  styleUrls: ['./supply.component.css']
})
export class SupplyComponent implements OnInit, AfterViewInit {
  private supplyUrl = environment.supplyUrl;

  displayedColumns: string[] = ['category', 'item', 'color', 'size', 'quantity', 'supplies_taken', 'supplies_left', 'cost_per_unit', 'total', 'action'];
  dataSource = new MatTableDataSource<Supply>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _dialog: MatDialog, private http: HttpClient,private excelExportService: ExcelExportService) {}

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
  // Fetching data from the web API
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

  // http delete
  // Deleting an item from the table
  deleteSupply(id: string) {
    this.http.delete(`${this.supplyUrl}/${id}`,{withCredentials: true}).subscribe({
      next: () => {
        console.log('Supply successfully deleted');
        // Ensure id is a string for comparison
        this.dataSource.data = this.dataSource.data.filter((supply: Supply) => supply.id !== id);
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
  // EditSupply Component (FORM)
  openEditForm(supply: Supply) {
    const dialogRef = this._dialog.open(EditSupplyComponent, {
      data: supply
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateSupply(result);
      }
    });
  }
  // Updating the editted supply
  updateSupply(supply: Supply) {
    this.http.put(`${this.supplyUrl}/${supply.id}`, supply,{withCredentials: true}).subscribe({
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

  // PRINT TABLE TO EXCEL
  exportTableToExcel(): void {
    const dataToExport = this.dataSource.data.map(row => {
      return {
        Category: row.category,
        Item: row.item,
        Color: row.color,
        Size: row.size,
        Quantity: row.quantity,
        SuppliesTaken: row.suppliesTaken,
        SuppliesLeft: row.suppliesLeft,
        CostPerUnit: row.costPerUnit,
        Total: row.total

      };
    });
    this.excelExportService.exportAsExcelFile(dataToExport, 'Supply');
  }
  
  // Add Supply (Form)
  openAddEditForm() {
    this._dialog.open(AddEditComponent);
  }
  
  // filtering the dataSource to display the data in the table
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
