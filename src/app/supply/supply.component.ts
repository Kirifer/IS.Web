import { Component } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import { AddEditComponent } from '../add-edit/add-edit.component';
import { MatDialog } from '@angular/material/dialog';


export interface PeriodicElement {
  category: string;
  item: string;
  color: string;
  size: string;
  quantity: number;
  suppliesTaken: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {category: 'Office Supply',item: 'Ballpen',color: 'Black',size:'0.05', quantity: 5,suppliesTaken:2},
  {category: 'Office Supply',item: 'Clear Folder',color: 'Red',size:'Long', quantity: 10,suppliesTaken:1},
  {category: 'Office Supply',item: 'Correction Tape',color: 'White',size:'', quantity: 3,suppliesTaken:1},
  {category: 'Office Supply',item: 'CD Case',color: 'Black',size:'0.05', quantity: 4,suppliesTaken:2},
  {category: 'Office Supply',item: 'Puncher',color: 'Black',size:'0.05', quantity: 3,suppliesTaken:1},
];

@Component({
  selector: 'app-supply',
  templateUrl: './supply.component.html',
  styleUrl: './supply.component.css',
  
  
})
export class SupplyComponent {
  constructor(private _dialog: MatDialog){}

  openAddEditForm(){
    this._dialog.open(AddEditComponent);
  }

  displayedColumns: string[] = ['category', 'item', 'color', 'size', 'quantity', 'suppliesTaken'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
