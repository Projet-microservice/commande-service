import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { ToastService } from '../../core/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-container d-flex align-items-center justify-content-center">
      <div class="card shadow-lg border-0 p-4" style="width: 100%; max-width: 450px;">
        <div class="text-center mb-4">
          <h2 class="fw-bold text-primary">Inscription</h2>
          <p class="text-muted">Rejoignez l'ERP dès aujourd'hui</p>
        </div>
        
        <form (ngSubmit)="onRegister()">
          <div class="row g-3">
            <div class="col-12">
              <label class="form-label small fw-semibold">Nom d'utilisateur</label>
              <div class="input-group">
                <span class="input-group-text bg-light border-0"><i class="bi bi-person"></i></span>
                <input type="text" class="form-control bg-light border-0" [(ngModel)]="user.name" name="name" placeholder="Ghassen" required>
              </div>
            </div>
            
            <div class="col-12">
              <label class="form-label small fw-semibold">Email</label>
              <div class="input-group">
                <span class="input-group-text bg-light border-0"><i class="bi bi-envelope"></i></span>
                <input type="email" class="form-control bg-light border-0" [(ngModel)]="user.email" name="email" placeholder="nom@exemple.com" required>
              </div>
            </div>
            
            <div class="col-12">
              <label class="form-label small fw-semibold">Mot de passe</label>
              <div class="input-group">
                <span class="input-group-text bg-light border-0"><i class="bi bi-lock"></i></span>
                <input type="password" class="form-control bg-light border-0" [(ngModel)]="user.password" name="password" placeholder="••••••••" required>
              </div>
            </div>

            <div class="col-12">
              <label class="form-label small fw-semibold">Rôle</label>
              <select class="form-select bg-light border-0" [(ngModel)]="user.role" name="role">
                <option value="USER">Utilisateur (Client)</option>
                <option value="ADMIN">Administrateur</option>
              </select>
            </div>
          </div>
          
          <button type="submit" class="btn btn-primary w-100 py-2 fw-semibold shadow-sm mt-4 mb-3" [disabled]="loading">
            <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
            Créer un compte
          </button>
          
          <div class="text-center small">
            Déjà un compte ? <a routerLink="/login" class="text-decoration-none fw-semibold">Se connecter</a>
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
export class RegisterComponent {
  user = { name: '', email: '', password: '', role: 'USER' };
  loading = false;
  
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  onRegister() {
    if (!this.user.name || !this.user.email || !this.user.password) return;
    
    this.loading = true;
    this.auth.register(this.user).subscribe({
      next: () => {
        this.toast.show('Compte créé avec succès ! Connectez-vous.', 'success');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        this.toast.show(err.error?.message || "Échec de l'inscription", 'danger');
      }
    });
  }
}
