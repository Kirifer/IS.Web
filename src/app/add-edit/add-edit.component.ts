import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';



@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrl: './add-edit.component.css'
})
export class AddEditComponent {
  empForm: FormGroup;


  categ: string[] = [
    'Office Supply'
  ];

  constructor(private _fb: FormBuilder, public dialogRef: MatDialogRef<AddEditComponent>){
    this.empForm = this._fb.group({
      category:'',
      item:'',
      color:'',
      size:'',
      quantity:'',
      costPerUnit:'',
    });
  }

  onFormSubmit(){
    if(this.empForm.valid){
      console.log(this.empForm.value);
    }
  }

  onCancel(): void{
    this.dialogRef.close()
  }


}
