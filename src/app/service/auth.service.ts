import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private identityUrl = environment.identityUrl;
  private loginUrl = environment.loginUrl;
  private logoutUrl = environment.logoutUrl;
  private currentUser: User | null = null;
  private userUrl = environment.userUrl;

  constructor(private http: HttpClient, private router: Router, private cookieService: CookieService) {}

  login(username: string, password: string): Observable<any>{
    console.debug('Login attempt with username:', username);
    const loginData = { username, password };
    return this.http.post<any>(this.loginUrl, loginData, { withCredentials: true }).pipe(
      map(response => {
        console.debug('Login response:', response);
        if (response.succeeded && response.data && response.data.token){
          this.currentUser = {
            ...response.data,
            token: response.data.token,
          };
          console.log('Current user after login:', this.currentUser);
          return response;
        }else{
          console.error('Login failed:', response);
        }
      }),
      catchError(error => {
        console.error('Login error:', error);
        return of(null)
      })
    )
  }

logout(): Observable<any> {
    console.debug('Logging out...');
    
    return this.http.post<any>(this.logoutUrl, {}, { withCredentials: true }).pipe(
      tap(() => {
        console.log('Logout successful.');
        alert('You have been logged out successfully.');
        this.router.navigate(['/login']);
      }),
      catchError(error => {
        console.error('Logout error occurred:', error);
        alert('An error occurred during logout. Please try again.');
        return of(null);
      })
    );
  }

  isAuthenticated(): Observable<boolean> {
    console.debug('Fetching user identity');
  
    // Check if the user is already logged in by inspecting the current user
    if (!this.currentUser) {
      console.warn('User is not logged in, skipping identity fetch.');
      // return of(false); // Return false immediately if not logged in
    }
  
    return this.http.get<{ data: User, succeeded: boolean }>(this.identityUrl, { withCredentials: true }).pipe(
      map(response => {
        console.log('Identity response:', response); // Debugging log
        if (response.succeeded) {
          this.currentUser = {
            ...response.data,
          };
          console.log('Current user during identity fetch:', this.currentUser); // Debugging log
          return true; // Identity fetch successful
        }
        return false; // Identity fetch failed
      }),
      catchError(error => {
        if (error.status === 401) {
          console.warn('Unauthorized access, redirecting to login.');
        } else {
          console.error('Error fetching identity:', error); // Debugging log
        }
        this.router.navigate(['/login']); // Redirect to login on unauthorized access
        return of(false); // Return false in case of error
      })
    );
  }

  getCurrentUser(): User | null{
    console.debug('Current user retrieved:', this.currentUser);
    return this.currentUser;
  }

  updateUser(user: User) {
    console.log(`${this.userUrl}/${this.currentUser?.userId}`);
    console.log(user); // Check if the object has valid data
    this.http.put(`${this.userUrl}/${this.currentUser?.userId}`, user, { withCredentials: true }).subscribe({
      next: () => {
        console.log('User successfully updated');
        this.currentUser = user;
      },
      error: error => {
        console.error('Error updating user:', error);
      }
    });
  }

  // login(username: string, password: string): Observable<any> {
  //   return this.http.post<any>(this.loginUrl, { username, password }).pipe(
  //     map(response => {
  //       if (response.succeeded && response.data && response.data.token) {
  //         // Store the token in a cookie
  //         this.cookieService.set(this.tokenKey, response.data.token, { path: '/', secure: true, sameSite: 'Lax' });
  //         return response;
  //       } else {
  //         throw new Error('Invalid credentials');
  //       }
  //     }),
  //     catchError(error => {
  //       console.error('Login failed', error);
  //       return of({ succeeded: false });
  //     })
  //   );
  // }

  // logout(): void {
  //   this.http.post(this.logoutUrl, {}, { withCredentials: true }).subscribe(
  //     () => {
  //       this.cookieService.delete(this.tokenKey, '/');
  //       this.router.navigate(['/login']).then(() => {});
  //       console.log('Logged out successfully');
  //     },
  //     error => {
  //       console.error('Logout failed', error);
  //     }
  //   );
  // }

 
}
