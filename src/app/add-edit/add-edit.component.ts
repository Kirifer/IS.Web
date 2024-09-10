import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Supply } from '../models/supply';
import { SupplyCodes } from '../models/supplycodes';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.css']
})
export class AddEditComponent implements OnInit {
  private supplyUrl = environment.supplyUrl;
  private codesUrl = environment.codesUrl;
  
  empForm: FormGroup;
  

  constructor(
    private _fb: FormBuilder,
    private http: HttpClient,
    public dialogRef: MatDialogRef<AddEditComponent>
  ) {
    // data from the form
    this.empForm = this._fb.group({
      category: [''],
      item: [''],
      color: [''],
      size: [''],
      quantity: [],
      suppliesTaken: [0],
      suppliesLeft: [{value: 0, disabled: true}],
      costPerUnit: [],
      total: [{value: 0, disabled: true}],
      dateCreated: [{value: new Date(), disabled: true  }],
      code: [''],
      supplyTaken: [''],
      
    });
  }
  
  ngOnInit() {
    // update derived fields whenever their dependencies change
    this.empForm.get('quantity')?.valueChanges.subscribe(() => this.updateDerivedFields());
    this.empForm.get('suppliesTaken')?.valueChanges.subscribe(() => this.updateDerivedFields());
    this.empForm.get('costPerUnit')?.valueChanges.subscribe(() => this.updateDerivedFields());
  }

  // calculation of supplies left (quantity - supplies taken) and total (cost per unit * supplies left)
  updateDerivedFields() {
    const quantity = this.empForm.get('quantity')?.value || 0;
    const suppliesTaken = this.empForm.get('suppliesTaken')?.value || 0;
    const costPerUnit = this.empForm.get('costPerUnit')?.value || 0;

    const suppliesLeft = quantity - suppliesTaken;
    const total = quantity * costPerUnit;

    this.empForm.patchValue({
      suppliesLeft: suppliesLeft,
      total: total
    }, {emitEvent: false}); // prevent triggering valueChanges again
  }

  // Submit form
  onFormSubmit() {
    this.updateDerivedFields(); // ensure calculations are up-to-date

    if (this.empForm.valid) {
      const formData: Supply = this.empForm.getRawValue();
      formData.dateCreated = new Date();
  
      const { category, item, color, size, costPerUnit } = formData;
  
      // Encode query parameters to handle special characters
      const queryParams = new URLSearchParams({
        category: encodeURIComponent(category),
        item: encodeURIComponent(item),
        color: encodeURIComponent(color),
        size: encodeURIComponent(size),
        costPerUnit: encodeURIComponent(costPerUnit.toString())
      }).toString();
  
      // Check if a record with the same category, item, color, size, and costPerUnit already exists
      this.http.get<Supply[]>(`${this.supplyUrl}?${queryParams}`,{withCredentials: true}) // widhCredentials: true is used to send cookies
        .subscribe({
          next: (existingSupplies) => {
            if (existingSupplies.length > 0) {
              // If a matching record is found, update it using the id
              const existingSupply = existingSupplies[0];
              formData.id = existingSupply.id;
  
              // Optional: Update other fields if needed, e.g., increase quantity
              formData.quantity += existingSupply.quantity; 
  
              // Update the existing record
              this.updateData(formData);
            } else {
              // If no matching record is found, create a new one
              this.createData(formData);
            }
          },
          error: error => {
            console.error('Error checking for existing data', error);
          }
        });
      
      // this creates data to the supply codes table
      this.http.post(this.codesUrl, formData,{withCredentials: true}).subscribe({ // widhCredentials: true is used to send cookies
        next: response => {
          console.log('Data successfully submitted', response);
          this.dialogRef.close();
        },
        error: error => {
          console.error('Error submitting data', error);
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }

  // create 
  createData(formData: Supply) {
    this.http.post(this.supplyUrl, formData,{withCredentials: true}).subscribe({
      next: response => {
        console.log('Data successfully submitted', response);
        this.dialogRef.close();
      },
      error: error => {
        console.error('Error submitting data', error);
      }
    });
  }

  // create for SupplyCodes
  createSupplyCodes(formData: SupplyCodes){
    this.http.post(this.codesUrl, formData,{withCredentials: true}).subscribe({
      next: response => {
        console.log('Data successfully submitted', response);
        this.dialogRef.close();
      },
      error: error => {
        console.error('Error submitting data', error);
      }
    });
  }

  // update
  updateData(formData: Supply) {
    this.http.put(`${this.supplyUrl}/${formData.id}`, formData).subscribe({
      next: response => {
        console.log('Data successfully updated', response);
        this.dialogRef.close();
      },
      error: error => {
        console.error('Error updating data', error);
      }
    });
  }

  // Cancel form
  onCancel(): void {
    this.dialogRef.close();
  }
}
