import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from './models';
import { ProductService } from './product.service';

@Injectable({ providedIn: 'root' })
export class CartService {
  private itemsSubject = new BehaviorSubject<Product[]>([]);
  items$ = this.itemsSubject.asObservable();
  private qtyMap: Record<number, number> = {};
  private countSubject = new BehaviorSubject<number>(0);
  count$ = this.countSubject.asObservable();
  constructor(private products: ProductService) {
    this.loadFromLocalStorage();
  }

  add(product: Product, qty = 1) {
    if (!product?.id) return;
    
    // Vérifier si le stock est suffisant
    const available = product.quantiteDisponible || 0;
    if (available < qty) {
      return; // On pourrait ajouter un toast ici mais on va rester simple
    }

    const id = product.id!;
    const items = [...this.itemsSubject.value];
    const exists = items.find(p => p.id === id);
    
    if (exists) {
      this.qtyMap[id] = (this.qtyMap[id] || 0) + qty;
    } else {
      items.push({ ...product }); // On clone pour éviter les références directes si besoin
      this.qtyMap[id] = (this.qtyMap[id] || 0) + qty;
      this.itemsSubject.next(items);
    }

    // Diminuer le stock localement
    product.quantiteDisponible = (product.quantiteDisponible || 0) - qty;
    
    this.recalcAndPersist();
  }

  update(productId: number, qty: number) {
    const id = productId;
    const currentQty = this.qtyMap[id] || 0;
    const newQty = Math.max(0, Math.floor(qty || 0));
    
    if (newQty === currentQty) return;

    const diff = newQty - currentQty;
    const product = this.itemsSubject.value.find(p => p.id === id);
    
    if (product) {
      if (diff > 0 && (product.quantiteDisponible || 0) < diff) {
        return; // Pas assez de stock pour augmenter
      }
      product.quantiteDisponible = (product.quantiteDisponible || 0) - diff;
    }

    if (newQty <= 0) {
      this.remove(id);
      return;
    }
    
    this.qtyMap[id] = newQty;
    this.recalcAndPersist();
  }

  remove(productId: number) {
    const product = this.itemsSubject.value.find(p => p.id === productId);
    if (product) {
      // Remettre le stock
      product.quantiteDisponible = (product.quantiteDisponible || 0) + (this.qtyMap[productId] || 0);
    }
    
    const items = [...this.itemsSubject.value].filter(p => p.id !== productId);
    delete this.qtyMap[productId];
    this.itemsSubject.next(items);
    this.recalcAndPersist();
  }

  clear() {
    // Remettre le stock pour tous les articles
    this.itemsSubject.value.forEach(p => {
      p.quantiteDisponible = (p.quantiteDisponible || 0) + (this.qtyMap[p.id!] || 0);
    });
    
    this.itemsSubject.next([]);
    this.qtyMap = {};
    this.recalcAndPersist();
  }

  getCount(): number {
    return Object.values(this.qtyMap).reduce((s, v) => s + v, 0);
  }

  getQty(productId: number): number {
    return this.qtyMap[productId] || 0;
  }

  total(): number {
    return this.itemsSubject.value.reduce((sum, p) => {
      const qty = this.qtyMap[p.id!] || 0;
      const price = p.prix || 0;
      return sum + qty * price;
    }, 0);
  }

  loadFromLocalStorage() {
    try {
      const rawItems = localStorage.getItem('cart_items');
      const rawQty = localStorage.getItem('cart_qty');
      const items: Product[] = rawItems ? JSON.parse(rawItems) : [];
      const qty: Record<number, number> = rawQty ? JSON.parse(rawQty) : {};
      this.itemsSubject.next(items || []);
      this.qtyMap = qty || {};
      this.recalcAndPersist(false);
    } catch {
      this.itemsSubject.next([]);
      this.qtyMap = {};
      this.recalcAndPersist(false);
    }
  }

  private recalcAndPersist(persist = true) {
    const count = Object.values(this.qtyMap).reduce((s, v) => s + v, 0);
    this.countSubject.next(count);
    if (persist) {
      try {
        localStorage.setItem('cart_items', JSON.stringify(this.itemsSubject.value));
        localStorage.setItem('cart_qty', JSON.stringify(this.qtyMap));
      } catch {}
    }
  }
}
