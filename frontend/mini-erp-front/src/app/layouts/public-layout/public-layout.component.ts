import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/cart.service';
import { FavoritesService } from '../../core/favorites.service';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './public-layout.component.html',
  styleUrls: ['./public-layout.component.css']
})
export class PublicLayoutComponent {
  cartCount = 0;
  favCount = 0;
  private auth = inject(AuthService);

  constructor(private cart: CartService, private fav: FavoritesService) {
    this.cart.count$.subscribe(n => this.cartCount = n);
    this.fav.favorites$.subscribe(items => this.favCount = items.length);
  }

  get isLoggedIn() { return this.auth.isLoggedIn(); }
  get isAdmin() { return this.auth.isAdmin(); }
  get username() { return this.auth.getUser()?.name || 'User'; }

  logout() {
    this.auth.logout();
  }
}
