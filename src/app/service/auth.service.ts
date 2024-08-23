import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<boolean> {
    return this.http.post<{ token: string }>('https://localhost:7012/login', { username, password }, { withCredentials: true })
      .pipe(
        map(response => {
          document.cookie = `token=${response.token}; path=/`; // Store token in cookie
          return true;
        }),
        catchError(() => of(false))
      );
  }

  logout(): void {
  this.http.post('https://localhost:7012/logout', {}, { withCredentials: true }).subscribe(
    () => {
      // Clear the token cookie
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      
      // Clear any other authentication-related data if necessary
      localStorage.removeItem('loggedUser'); // Clear local storage

      // Redirect to the login page
      this.router.navigate(['/login']).then(() => {
        window.location.reload();
      });
      
      console.log('Logged out successfully');
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
