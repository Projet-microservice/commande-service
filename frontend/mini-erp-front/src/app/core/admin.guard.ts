import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

export const adminGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn() && auth.isAdmin()) {
    return true;
  }

  // Si l'utilisateur est connecté mais n'est pas admin, on le redirige vers l'accueil
  if (auth.isLoggedIn()) {
    router.navigate(['/home']);
    return false;
  }

  // Sinon vers le login
  router.navigate(['/login']);
  return false;
};
