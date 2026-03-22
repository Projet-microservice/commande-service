import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { ToastService } from '../../core/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-container d-flex align-items-center justify-content-center">
      <div class="card shadow-lg border-0 p-4" style="width: 100%; max-width: 400px;">
        <div class="text-center mb-4">
          <h2 class="fw-bold text-primary">Connexion</h2>
          <p class="text-muted">Accédez à votre espace Mini ERP</p>
        </div>
        
        <form (ngSubmit)="onLogin()">
          <div class="mb-3">
            <label class="form-label small fw-semibold">Email</label>
            <div class="input-group">
              <span class="input-group-text bg-light border-0"><i class="bi bi-envelope"></i></span>
              <input type="email" class="form-control bg-light border-0" [(ngModel)]="credentials.email" name="email" placeholder="nom@exemple.com" required>
            </div>
          </div>
          
          <div class="mb-4">
            <label class="form-label small fw-semibold">Mot de passe</label>
            <div class="input-group">
              <span class="input-group-text bg-light border-0"><i class="bi bi-lock"></i></span>
              <input type="password" class="form-control bg-light border-0" [(ngModel)]="credentials.password" name="password" placeholder="••••••••" required>
            </div>
          </div>
          
          <button type="submit" class="btn btn-primary w-100 py-2 fw-semibold shadow-sm mb-3" [disabled]="loading">
            <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
            Se connecter
          </button>
          
          <div class="text-center small">
            Pas encore de compte ? <a routerLink="/register" class="text-decoration-none fw-semibold">Créer un compte</a>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 80vh;
      background-color: #f8f9fa;
    }
    .card {
      border-radius: 15px;
    }
  `]
})
export class LoginComponent {
  credentials = { email: '', password: '' };
  loading = false;
  
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  onLogin() {
    if (!this.credentials.email || !this.credentials.password) return;
    
    console.log('Login attempt with:', this.credentials.email);
    this.loading = true;
    this.auth.login(this.credentials).subscribe({
      next: (res) => {
        console.log('Login successful in component:', res);
        this.loading = false;
        
        // On récupère le user et le role de la réponse du service (qui a déjà normalisé les données)
        const user = res.user;
        const role = user?.role;
        
        console.log('Determined role:', role);
        this.toast.show(`Bienvenue ${user?.name || 'utilisateur'} !`, 'success');
        
        if (role === 'ADMIN') {
          console.log('Redirecting to /dashboard');
          this.router.navigateByUrl('/dashboard');
        } else {
          console.log('Redirecting to /home');
          this.router.navigateByUrl('/home');
        }
      },
      error: (err) => {
        console.error('Login component error:', err);
        this.loading = false;
        // L'intercepteur affiche déjà le message d'erreur
      }
    });
  }
}
