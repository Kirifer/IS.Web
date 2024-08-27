import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './service/auth.service';
import { map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  console.log('authGuard invoked'); // Debugging: Log when authGuard is invoked
  console.log('Route:', route); // Debugging: Log the route
  console.log('State:', state); // Debugging: Log the state

  return authService.isAuthenticated().pipe(
    map(isAuthenticated => {
      console.log('isAuthenticated:', isAuthenticated); // Debugging: Log the authentication status
      if (isAuthenticated) {
        console.log('User is authenticated'); // Debugging: Log if the user is authenticated
        return true;
      } else {
        console.log('User is not authenticated, redirecting to login'); // Debugging: Log if the user is not authenticated
        router.navigate(['/login']);
        return false;
      }
    })
  );
};
