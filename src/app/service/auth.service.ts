import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private identityUrl = environment.identityUrl;
  private loginUrl = environment.loginUrl;
  private logoutUrl = environment.logoutUrl;
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient, private router: Router, private cookieService: CookieService) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.loginUrl, { username, password }).pipe(
      map(response => {
        if (response.succeeded && response.data && response.data.token) {
          // Store the token in a cookie
          this.cookieService.set(this.tokenKey, response.data.token, { path: '/', secure: true, sameSite: 'Lax' });
          return response;
        } else {
          throw new Error('Invalid credentials');
        }
      }),
      catchError(error => {
        console.error('Login failed', error);
        return of({ succeeded: false });
      })
    );
  }

  logout(): void {
    this.http.post(this.logoutUrl, {}, { withCredentials: true }).subscribe(
      () => {
        this.cookieService.delete(this.tokenKey, '/');
        this.router.navigate(['/login']).then(() => {});
        console.log('Logged out successfully');
      },
      error => {
        console.error('Logout failed', error);
      }
    );
  }

  isAuthenticated(): Observable<boolean> {
    const token = this.cookieService.get(this.tokenKey);
    if (!token) {
      return of(false);
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(this.identityUrl, { headers }).pipe(
      map(response => {
        return response.succeeded;
      }),
      catchError(error => {
        console.error('Authentication failed', error);
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
}
