import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Supply } from '../models/supply';
import { SupplyCodes } from '../models/supplycodes';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.css']
})
export class AddEditComponent implements OnInit {
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
      suppliesTaken: [],
      suppliesLeft: [{value: 0, disabled: true}],
      costPerUnit: [],
      total: [{value: 0, disabled: true}],
      dateCreated: [{value: new Date(), disabled: true  }],
      code: [''],
      supplyTaken: ['']
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
    const total = costPerUnit * suppliesLeft;

    this.empForm.patchValue({
      suppliesLeft: suppliesLeft,
      total: total
    }, {emitEvent: false}); // prevent triggering valueChanges again
  }

  // Submit form
  onFormSubmit() {
    this.updateDerivedFields(); // ensure calculations are up-to-date

    if (this.empForm.valid) {
      const formData: Supply = this.empForm.getRawValue(); // get the actual form values including disabled fields
      formData.dateCreated = new Date();
      this.http.post('https://localhost:7012/supplies', formData).subscribe({
        next: response => {
          console.log('Data successfully submitted', response);
          this.dialogRef.close();
        },
        error: error => {
          console.error('Error submitting data', error);
        }
      });
      this.http.post('https://localhost:7012/supplycodes', formData).subscribe({
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
    this.http.post('https://localhost:7012/supplies', formData).subscribe({
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
    this.http.post('https://localhost:7012/supplycodes', formData).subscribe({
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
    this.http.put(`https://localhost:7012/supplies/${formData.id}`, formData).subscribe({
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
