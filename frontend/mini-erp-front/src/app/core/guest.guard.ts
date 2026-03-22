import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

export const guestGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    return true;
  }

  // Rediriger vers le dashboard si c'est un admin, sinon vers le home
  if (auth.isAdmin()) {
    router.navigate(['/dashboard']);
  } else {
    router.navigate(['/home']);
  }
  return false;
};
