import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Supply } from '../models/supply';

@Component({
  selector: 'app-edit-supply',
  templateUrl: './edit-supply.component.html',
  styleUrls: ['./edit-supply.component.css']
})
export class EditSupplyComponent {
  supplyForm: FormGroup;
  categ: string[] = ['Office Supply'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditSupplyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Supply
  ) {
    this.supplyForm = this.fb.group({
      category: [data.category, Validators.required],
      item: [data.item, Validators.required],
      color: [data.color, Validators.required],
      size: [data.size, Validators.required],
      quantity: [data.quantity, Validators.required],
      suppliesTaken: [data.suppliesTaken, Validators.required],
      suppliesLeft: [{ value: data.suppliesLeft, disabled: true }, Validators.required],
      costPerUnit: [data.costPerUnit, Validators.required],
      total: [{ value: data.total, disabled: true }, Validators.required],
    });

    this.supplyForm.get('suppliesTaken')?.valueChanges.subscribe(() => this.updateSuppliesLeftAndTotal());
    this.supplyForm.get('quantity')?.valueChanges.subscribe(() => this.updateSuppliesLeftAndTotal());
    this.supplyForm.get('costPerUnit')?.valueChanges.subscribe(() => this.updateTotal());
  }

  updateSuppliesLeftAndTotal() {
    const quantity = this.supplyForm.get('quantity')?.value || 0;
    const suppliesTaken = this.supplyForm.get('suppliesTaken')?.value || 0;
    const suppliesLeft = quantity - suppliesTaken;
    this.supplyForm.patchValue({ suppliesLeft });
    this.updateTotal();
  }

  updateTotal() {
    const suppliesLeft = this.supplyForm.get('suppliesLeft')?.value || 0;
    const costPerUnit = this.supplyForm.get('costPerUnit')?.value || 0;
    const total = suppliesLeft * costPerUnit;
    this.supplyForm.patchValue({ total });
  }

  save() {
    if (this.supplyForm.valid) {
      const updatedSupply: Supply = { ...this.data, ...this.supplyForm.getRawValue() };
      updatedSupply.suppliesLeft = this.supplyForm.get('suppliesLeft')?.value;
      updatedSupply.total = this.supplyForm.get('total')?.value;
      this.dialogRef.close(updatedSupply);
    }
  }

  close() {
    this.dialogRef.close();
  }
}
