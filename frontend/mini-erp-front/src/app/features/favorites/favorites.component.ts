import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritesService } from '../../core/favorites.service';
import { Product } from '../../core/models';
import { ProductService } from '../../core/product.service';
import { CartService } from '../../core/cart.service';
import { API_BASE } from '../../core/api';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent {
  products: Product[] = [];
  constructor(public fav: FavoritesService, private svc: ProductService, private cart: CartService) {
    this.fav.favorites$.subscribe(ps => this.products = ps);
  }
  add(p: Product) { this.cart.add(p, 1); }
  isFav(id?: number) { return !!id && this.fav.has(id); }
  toggleFav(id?: number) { if (id) this.fav.toggle(this.products.find(p => p.id === id)!); }
  imageSrc(p: Product) {
    if (p.imageUrl) {
      return p.imageUrl.startsWith('http') ? p.imageUrl : `${API_BASE}${p.imageUrl}`;
    }
    return `https://picsum.photos/seed/${p.id || p.nom}/400/300`;
  }
}
