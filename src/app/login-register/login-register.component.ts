import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.css']
})
export class LoginRegisterComponent {
  title = 'Login-Page';
  hide = true;
  isSignDivVisiable: boolean = true;
  isPasswordVisible = false;

  loginObj: LoginModel = new LoginModel();

  constructor(private router: Router, private authService: AuthService) {}

  toggleVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onLogin(signInForm: any) {
    if (signInForm.valid) {
      const username = this.loginObj.username;
      const password = this.loginObj.password;

      this.authService.login(username, password).subscribe(response => {
        if (response.succeeded) {
          alert('Redirecting you to the Dashboard..');
          this.router.navigateByUrl('dashboard');
        } else {
          alert('Invalid credentials');
        }
      });

      // Clear the form after login attempt
      this.loginObj = new LoginModel();
      signInForm.resetForm();
    } else {
      alert('Please fill out all fields');
    }
  }
}

export class LoginModel {
  username: string; // This can be either username or email
  password: string;

  constructor() {
    this.username = "";
    this.password = "";
  }
}
