import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from './models';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private storageKey = 'favorites';
  private favoritesSubject = new BehaviorSubject<Product[]>([]);
  favorites$ = this.favoritesSubject.asObservable();
  constructor() {
    this.loadFromLocalStorage();
  }

  private persist() {
    try { localStorage.setItem(this.storageKey, JSON.stringify(this.favoritesSubject.value)); } catch {}
    this.favoritesSubject.next([...this.favoritesSubject.value]);
  }

  add(p: Product) {
    if (!p?.id) return;
    const current = this.favoritesSubject.value;
    if (current.find(x => x.id === p.id)) return;
    const updated = [...current, p];
    this.favoritesSubject.next(updated);
    this.persist();
  }

  remove(id: number) {
    const updated = this.favoritesSubject.value.filter(p => p.id !== id);
    this.favoritesSubject.next(updated);
    this.persist();
  }

  toggle(product: Product) {
    if (!product?.id) return;
    if (this.has(product.id)) this.remove(product.id);
    else this.add(product);
  }

  has(id: number) {
    return this.favoritesSubject.value.some(p => p.id === id);
  }
  ids(): number[] { return this.favoritesSubject.value.map(p => p.id!).filter(Boolean) as number[]; }
  getCount(): number { return this.favoritesSubject.value.length; }
  clear() {
    this.favoritesSubject.next([]);
    this.persist();
  }
  loadFromLocalStorage() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      const items: Product[] = raw ? JSON.parse(raw) : [];
      this.favoritesSubject.next(items || []);
    } catch {
      this.favoritesSubject.next([]);
    }
  }
}
