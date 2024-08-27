import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
//document.cookie = `token=${response.token}; path=/`; // Store token in cookie
  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post<{ token: string }>('https://localhost:7012/login', { username, password }, { withCredentials: true })
      .pipe(
        map(response => {
          console.log('Server response:', response); // Debugging: Log the entire response
          if (response && response.token) {
            // Store token in local storage
            localStorage.setItem('token', response.token);
            console.log('Token received and stored:', response.token); // Debugging: Log the token
            return true;
          } else {
            console.error('No token received in response');
            return response;
          }
        }),
        catchError(error => {
          console.error('Login failed', error);
          return of(false);
        })
      );
  }

  logout(): void {
  this.http.post('https://localhost:7012/logout', {}, { withCredentials: true }).subscribe(
    () => {
      // Clear the token cookie
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      
      // Clear any other authentication-related data if necessary
      localStorage.removeItem('token'); // Clear local storage

      // Redirect to the login page
      this.router.navigate(['/login']).then(() => {
      });
      
      console.log('Logged out successfully');
      console.log('Token cookie cleared');
    },
    error => {
      console.error('Logout failed', error);
    }
  );
}


  isAuthenticated(): Observable<boolean> {
    return this.http.get('https://localhost:7012/identity', { withCredentials: true })
      .pipe(
        map(() => true),
        catchError(() => of(false))
      );
  }
}
