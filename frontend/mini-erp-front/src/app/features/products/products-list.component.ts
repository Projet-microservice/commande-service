import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/product.service';
import { Product } from '../../core/models';
import { CartService } from '../../core/cart.service';
import { ConfirmService } from '../../core/confirm.service';
import { ToastService } from '../../core/toast.service';
import { catchError, finalize, of } from 'rxjs';
import { PRODUCT_API } from '../../core/api';
import { FavoritesService } from '../../core/favorites.service';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent {
  products: Product[] = [];
  form: Product = { nom: '', prix: 0, quantiteDisponible: 0, categorie: '' };
  createFile?: File;
  edit?: Product | null = null;
  editFile?: File;
  searchTerm = '';
  searchCategory = '';
  createOpen = false;

  constructor(private svc: ProductService, private cart: CartService, private confirm: ConfirmService, private toast: ToastService, private fav: FavoritesService) {
    this.reload();
  }
  reload() {
    this.svc.list()
      .pipe(
        catchError(() => { this.toast.show('Échec chargement produits', 'danger'); return of([]); }),
        finalize(() => {})
      )
      .subscribe(d => {
        this.products = (d || []).map((x: any) => ({
          ...x,
          nom: x.name || x.nom,
          prix: x.price || x.prix,
          quantiteDisponible: x.stock || x.quantiteDisponible,
          categorie: x.description || x.categorie
        }));
      });
  }
  create() {
    if (!this.form.nom) return;
    this.svc.create(this.form)
      .pipe(
        catchError(() => { this.toast.show('Échec création produit', 'danger'); return of(null); }),
        finalize(() => {})
      )
      .subscribe(ok => {
        if (!ok) return;
        const doAfter = () => {
          this.form = { nom: '', prix: 0, quantiteDisponible: 0, categorie: '' };
          this.reload();
          this.createOpen = false;
          this.toast.show('Produit ajouté', 'success');
        };
        if (this.createFile && ok.id) {
          this.svc.uploadImage(ok.id, this.createFile)
            .pipe(catchError(() => { this.toast.show("Échec upload image", "danger"); return of(null as any); }))
            .subscribe(() => doAfter());
        } else doAfter();
      });
  }
  async delete(id: number) {
    const ok = await this.confirm.confirm('Suppression', 'Confirmer la suppression du produit ?');
    if (!ok) return;
    this.svc.delete(id)
      .pipe(
        catchError(() => { this.toast.show('Échec suppression produit', 'danger'); return of(void 0); }),
        finalize(() => {})
      )
      .subscribe(() => {
        this.reload();
        this.toast.show('Produit supprimé', 'success');
      });
  }
  toggleCreate() {
    this.createOpen = !this.createOpen;
  }
  addToCart(p: Product) { 
    if ((p.quantiteDisponible || 0) > 0) {
      this.cart.add(p, 1); 
      // La réduction du stock est déjà gérée dans CartService.add(p)
      this.toast.show(`Produit ${p.nom} ajouté au panier`, 'success');
    } else {
      this.toast.show(`Produit ${p.nom} en rupture de stock`, 'warning');
    }
  }
  toggleFav(p: Product) {
    if (!p.id) return;
    if (this.fav.has(p.id)) this.fav.remove(p.id);
    else this.fav.add(p);
  }
  onCreateFile(e: any) { this.createFile = e.target.files?.[0]; }
  onEditFile(e: any) { this.editFile = e.target.files?.[0]; }
  onSearch() {
    if (!this.searchTerm && !this.searchCategory) { this.reload(); return; }
    this.svc.search(this.searchTerm, this.searchCategory).subscribe(d => {
      this.products = (d || []).map((x: any) => ({
        ...x,
        nom: x.name || x.nom,
        prix: x.price || x.prix,
        quantiteDisponible: x.stock || x.quantiteDisponible,
        categorie: x.description || x.categorie
      }));
    });
  }
  startEdit(p: Product) { this.edit = { ...p }; }
  cancelEdit() { this.edit = null; this.editFile = undefined; }
  saveEdit() {
    if (!this.edit?.id) return;
    this.svc.update(this.edit.id, this.edit)
      .pipe(catchError(() => { this.toast.show("Échec mise à jour", "danger"); return of(this.edit!); }))
      .subscribe(updated => {
        const after = () => { this.toast.show('Produit mis à jour', 'success'); this.reload(); this.edit = null; };
        if (this.editFile)
          this.svc.uploadImage(updated.id!, this.editFile)
            .pipe(catchError(() => { this.toast.show("Échec upload image", "danger"); return of(null as any); }))
            .subscribe(() => after());
        else after();
      });
  }
  imageSrc(p: Product) {
    if (p.imageUrl) {
      return p.imageUrl.startsWith('http') ? p.imageUrl : `${PRODUCT_API}${p.imageUrl}`;
    }
    return `https://picsum.photos/seed/${p.id || p.nom}/400/300`;
  }
}
