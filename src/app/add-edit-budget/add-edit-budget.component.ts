import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { BudgetExpenses } from '../models/budgetexpenses';
@Component({
  selector: 'app-add-edit-budget',
  templateUrl: './add-edit-budget.component.html',
  styleUrl: './add-edit-budget.component.css'
})
export class AddEditBudgetComponent {
  empForm: FormGroup;
  months = [
    { value: 'JAN', viewValue: 'January' },
    { value: 'FEB', viewValue: 'February' },
    { value: 'MAR', viewValue: 'March' },
    { value: 'APR', viewValue: 'April' },
    { value: 'MAY', viewValue: 'May' },
    { value: 'JUN', viewValue: 'June' },
    { value: 'JUL', viewValue: 'July' },
    { value: 'AUG', viewValue: 'August' },
    { value: 'SEP', viewValue: 'September' },
    { value: 'OCT', viewValue: 'October' },
    { value: 'NOV', viewValue: 'November' },
    { value: 'DEC', viewValue: 'December' }
  ];

  constructor(
    private _fb: FormBuilder,
    private http: HttpClient,
    public dialogRef: MatDialogRef<AddEditBudgetComponent>
  ) {    
      this.empForm = this._fb.group({
      monthCreated:'',
      yearCreated:2024,
      budget:'',
      expenses:'',
    });
  }

  // CREATE
  onFormSubmit(){
    if(this.empForm.valid){
      const formData: BudgetExpenses = this.empForm.value;
      this.http.post('https://localhost:7012/budget-expenses', formData).subscribe({
        next: response => {
          console.log('Data successfully submitted', response);
          this.dialogRef.close();
        },
        error: error => {
          console.error('Error submitting data', error);
        }
      });
    }
  }

  // CANCEL
  onCancel(): void{
    this.dialogRef.close()
  }
}
