import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { USER_API } from './api';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { CartService } from './cart.service';

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSignal = signal<any>(null);
  user$ = this.userSignal.asReadonly();
  private cart = inject(CartService);

  constructor(private http: HttpClient, private router: Router) {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        this.userSignal.set(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${USER_API}/auth/register`, userData);
  }

  login(credentials: any): Observable<AuthResponse> {
    return this.http.post<any>(`${USER_API}/auth/login`, credentials).pipe(
      tap((res: any) => {
        console.log('Server response:', res);
        
        // Gérer les deux formats possible (access_token ou accessToken)
        const token = res.access_token || res.accessToken;
        if (!token) {
          throw new Error('Pas de token reçu du serveur');
        }

        let user = res.user;
        
        // Si le user est manquant dans la réponse, on essaie de le reconstruire depuis le token
        if (!user) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            user = {
              id: payload.sub || payload.id,
              email: payload.email,
              role: payload.role,
              name: payload.name || payload.username || 'Utilisateur'
            };
            console.log('User reconstructed from JWT:', user);
          } catch (e) {
            console.error('Failed to decode JWT:', e);
            throw new Error('Réponse invalide : user manquant et token illisible');
          }
        }

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('userId', user.id);
        localStorage.setItem('userRole', user.role);
        this.userSignal.set(user);
        
        // On normalise l'objet pour qu'il respecte l'interface AuthResponse
        res.access_token = token;
        res.user = user;
      })
    );
  }

  logout() {
    localStorage.clear();
    this.userSignal.set(null);
    this.cart.clear();
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  isAdmin(): boolean {
    return localStorage.getItem('userRole') === 'ADMIN';
  }

  getUser() {
    return this.userSignal();
  }
}
