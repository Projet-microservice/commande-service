import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../core/models';
import { ProductService } from '../../core/product.service';
import { CartService } from '../../core/cart.service';
import { FavoritesService } from '../../core/favorites.service';
import { ToastService } from '../../core/toast.service';
import { PRODUCT_API } from '../../core/api';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  products: Product[] = [];
  private toast = inject(ToastService);
  private auth = inject(AuthService);

  constructor(private svc: ProductService, private cart: CartService, public fav: FavoritesService) {
    this.svc.list().subscribe(p => {
      // Adapter le nouveau modèle (name -> nom, etc.) pour le template
      this.products = (p || []).map((x: any) => ({
        ...x,
        nom: x.name || x.nom,
        prix: x.price || x.prix,
        quantiteDisponible: x.stock || x.quantiteDisponible,
        categorie: x.description || x.categorie
      }));
    });
  }
  add(p: Product) { 
    if (!this.auth.isLoggedIn()) {
      this.toast.show('Veuillez vous connecter pour ajouter au panier', 'warning');
      return;
    }
    if ((p.quantiteDisponible || 0) > 0) {
      this.cart.add(p, 1);
      this.toast.show(`Produit ${p.nom} ajouté au panier`, 'success');
    } else {
      this.toast.show(`Produit ${p.nom} en rupture de stock`, 'warning');
    }
  }
  isFav(id?: number) { return !!id && this.fav.has(id); }
  onFavorite(p: Product) { this.fav.toggle(p); }
  imageSrc(p: Product) {
    if (p.imageUrl) {
      return p.imageUrl.startsWith('http') ? p.imageUrl : `${PRODUCT_API}${p.imageUrl}`;
    }
    return `https://picsum.photos/seed/${p.id || p.nom}/400/300`;
  }
}
