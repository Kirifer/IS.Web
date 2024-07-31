import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupplyCodes } from '../models/supplycodes';
@Component({
  selector: 'app-edit-code',
  templateUrl: './edit-code.component.html',
  styleUrl: './edit-code.component.css'
})
export class EditCodeComponent {
  supplyForm: FormGroup;
  categ: string[] = [
    'Office Supply'
  ];
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditCodeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SupplyCodes
  ) {
    this.supplyForm = this.fb.group({
      code: [data.code, Validators.required],
      category: [data.category, Validators.required],
      item: [data.item, Validators.required],
      color: [data.color, Validators.required],
      size: [data.size, Validators.required],
      quantity: [data.quantity, Validators.required],
      suppliesTaken: [data.supplyTaken, Validators.required],
    });
  }

  save(){
    if(this.supplyForm.valid){
      const updatedSupply: SupplyCodes = { ...this.data, ...this.supplyForm.getRawValue() };
      this.dialogRef.close(updatedSupply);
  }
}

  close() {
    this.dialogRef.close();
  }
}
