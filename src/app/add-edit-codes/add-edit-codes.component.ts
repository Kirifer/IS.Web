import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { SupplyCodes } from '../models/supplycodes';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-add-edit-codes',
  templateUrl: './add-edit-codes.component.html',
  styleUrl: './add-edit-codes.component.css'
})
export class AddEditCodesComponent {
  private codesUrl = environment.codesUrl;
  empForm: FormGroup;


  categ: string[] = [
    'Office Supply'
  ];

  constructor(
    private _fb: FormBuilder,
    private http: HttpClient,
    public dialogRef: MatDialogRef<AddEditCodesComponent>
  ) {    
      this.empForm = this._fb.group({
      code:'',
      // sequenceCode:'',
      category:'',
      item:'',
      color:'',
      size:'',
      quantity:'',
      supplyTaken:'',
    });
  }

  // CREATE
  onFormSubmit(){
    if(this.empForm.valid){
      const formData: SupplyCodes = this.empForm.value;
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
  }

  // CANCEL
  onCancel(): void{
    this.dialogRef.close()
  }


}

