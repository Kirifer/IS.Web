import { Component } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import { AddEditComponent } from '../add-edit/add-edit.component';
import { MatDialog } from '@angular/material/dialog';
import {AfterViewInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';


// TABLE 2
export interface PeriodicElement1 {
  code: string;
  officeSupply: string;
  noOfItems: string;
  color2: string;
  size2: string;
}
// TABLE 2
const ELEMENT_DATA1: PeriodicElement1[] = [
  {code: 'BP00001', officeSupply: 'BLACK BALLPEN', noOfItems: '1 Box = 12 Pcs', color2: 'Black', size2: '0.05'},
];


export interface PeriodicElement {
  category: string;
  item: string;
  color: string;
  size: string;
  quantity: number;
  suppliesTaken: number;
  suppliesLeft: number;
  costPerUnit: number;
  total: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {category: 'Office Supply',item: 'Ballpen',color: 'Black',size:'0.05', quantity: 5,suppliesTaken:2,suppliesLeft:2,costPerUnit:5.50,total:55.00},
  {category: 'Office Supply',item: 'Clear Folder',color: 'Red',size:'Long', quantity: 10,suppliesTaken:1,suppliesLeft:9,costPerUnit:45.00,total:405.00},
  {category: 'Office Supply',item: 'Correction Tape',color: 'White',size:'', quantity: 3,suppliesTaken:1,suppliesLeft:2,costPerUnit:25.00,total:50.00},
  {category: 'Office Supply',item: 'CD Case',color: 'Black',size:'0.05', quantity: 4,suppliesTaken:2,suppliesLeft:2,costPerUnit:25.00,total:50.00},
  {category: 'Office Supply',item: 'Puncher',color: 'Black',size:'0.05', quantity: 3,suppliesTaken:1,suppliesLeft:2,costPerUnit:135.00,total:270.00},
];

@Component({
  selector: 'app-supply',
  templateUrl: './supply.component.html',
  styleUrl: './supply.component.css',
  
  
})
export class SupplyComponent{

  // TABLE 2
  displayedColumns1 = ['code', 'officeSupply', 'noOfItems', 'color2','size2','suppliesTaken2'];
  dataSource1 = ELEMENT_DATA1


  constructor(private _dialog: MatDialog){}

  openAddEditForm(){
    this._dialog.open(AddEditComponent);
  }

  displayedColumns: string[] = ['category', 'item', 'color', 'size', 'quantity', 'suppliesTaken','suppliesLeft','costPerUnit','total','action'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


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
