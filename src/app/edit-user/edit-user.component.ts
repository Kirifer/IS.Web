import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../models/user';
@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css'
})
export class EditUserComponent {
  supplyForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditUserComponent>,
    @Inject (MAT_DIALOG_DATA) public data: User
  ){
    this.supplyForm = this.fb.group({
      firstName: [data.firstName, Validators.required],
      lastName: [data.lastName, Validators.required],
      username: [data.username, Validators.required],
      password: [data.password, Validators.required]
    });
  }

  save(){
    if(this.supplyForm.valid){
      const updatedSupply: User = { ...this.data, ...this.supplyForm.getRawValue() };
      this.dialogRef.close(updatedSupply);
  }
}

  close() {
    this.dialogRef.close();
  }
}
