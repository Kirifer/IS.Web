import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

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

  constructor(private _fb: FormBuilder){
    this.empForm = this._fb.group({
      category:'',
      item:'',
      color:'',
      size:'',
      quantity:'',
    });
  }

  onFormSubmit(){
    if(this.empForm.valid){
      console.log(this.empForm.value);
    }
  }

}
