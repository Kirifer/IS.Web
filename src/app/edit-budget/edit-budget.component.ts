import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BudgetExpenses } from '../models/budgetexpenses';

@Component({
  selector: 'app-edit-budget',
  templateUrl: './edit-budget.component.html',
  styleUrl: './edit-budget.component.css'
})
export class EditBudgetComponent {
  supplyForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditBudgetComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BudgetExpenses
  ) {
    this.supplyForm = this.fb.group({
      dateCreated: [data.dateCreated, Validators.required],
      budget: [data.budget, Validators.required],
      expenses: [data.expenses, Validators.required],
      totalBudget: [data.totalBudget, Validators.required],
    });
  }

  save(){
    if(this.supplyForm.valid){
      const updatedSupply: BudgetExpenses = { ...this.data, ...this.supplyForm.getRawValue() };
      this.dialogRef.close(updatedSupply);
  }
}

  close() {
    this.dialogRef.close();
  }
}
