import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import {CookieService} from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7012';
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient, private router: Router, private cookieService: CookieService) {}
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>('https://localhost:7012/login', {username, password}).pipe(
      map(response => {
        if (response.succeeded && response.data && response.data.token) {
          // Store the token in the local storage
          // localStorage.setItem('token', response.data.token);
          this.cookieService.set(this.tokenKey, response.data.token, { path: '/', secure: true, sameSite: 'Lax' });
          return response;
        }
        else{
          throw new Error('Invalid credentials');
        }
      })
    )
  }

  logout(): void {
  this.http.post('https://localhost:7012/logout', {}, { withCredentials: true }).subscribe(
    () => {
      // localStorage.removeItem('token'); // Clear local storage
      this.cookieService.delete(this.tokenKey, '/');
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
  // const token = localStorage.getItem('token');
  const token = this.cookieService.get(this.tokenKey);
  console.log('Retrieved token:', token); // Debugging log
  if (!token) {
    return of(false);
  }

  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  console.log('Headers:', headers); // Debugging log
  return this.http.get<any>('https://localhost:7012/identity', { headers }).pipe(
    map(response => {
      console.log('Authentication response:', response); // Debugging log
      if (response.succeeded) {
        return true;
      }
      return false;
    }),
    catchError(error => {
      console.error('Authentication failed', error); // Enhanced error logging
      this.router.navigate(['/login']);
      return of(false);
    })
  );
}
}
