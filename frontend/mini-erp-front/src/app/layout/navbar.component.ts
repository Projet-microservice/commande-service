import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
    <nav class="app-navbar navbar navbar-expand bg-white px-3 shadow-sm mb-4">
      <div class="container-fluid">
        <form class="d-none d-md-flex" role="search">
          <div class="input-group">
            <span class="input-group-text bg-light border-0"><i class="bi bi-search text-muted"></i></span>
            <input class="form-control bg-light border-0" type="search" placeholder="Rechercher..." aria-label="Search" />
          </div>
        </form>
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center gap-3">
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle d-flex align-items-center p-1 rounded-pill hover-bg-light" href="#" id="profileMenu" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <img src="https://ui-avatars.com/api/?name={{username}}&background=0D6EFD&color=fff&bold=true" class="rounded-circle me-2" width="32" height="32" alt="avatar" />
              <span class="fw-semibold small d-none d-lg-inline">{{username}}</span>
            </a>
            <ul class="dropdown-menu dropdown-menu-end shadow border-0 mt-2" aria-labelledby="profileMenu">
              <li><a class="dropdown-item py-2" routerLink="/home"><i class="bi bi-house me-2"></i>Boutique</a></li>
              <li><a class="dropdown-item py-2" href="#"><i class="bi bi-person me-2"></i>Profil</a></li>
              <li><a class="dropdown-item py-2" href="#"><i class="bi bi-gear me-2"></i>Paramètres</a></li>
              <li><hr class="dropdown-divider opacity-10" /></li>
              <li><a class="dropdown-item py-2 text-danger" href="javascript:void(0)" (click)="logout()"><i class="bi bi-box-arrow-right me-2"></i>Déconnexion</a></li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  `,
  styles: [`
    .hover-bg-light:hover {
      background-color: #f8f9fa;
    }
    .app-navbar {
      height: 70px;
    }
  `]
})
export class NavbarComponent {
  private auth = inject(AuthService);

  get username() { return this.auth.getUser()?.name || 'Admin'; }

  logout() {
    this.auth.logout();
  }
}


