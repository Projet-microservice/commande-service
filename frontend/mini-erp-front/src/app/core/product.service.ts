import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PRODUCT_API } from './api';
import { Product } from './models';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private http: HttpClient) {}

  private getHeaders() {
    const userId = localStorage.getItem('userId') || 'admin';
    const userRole = localStorage.getItem('userRole') || 'ADMIN';
    return new HttpHeaders({
      'X-User-Id': userId,
      'X-User-Role': userRole
    });
  }

  list(): Observable<Product[]> {
    return this.http.get<Product[]>(`${PRODUCT_API}/products`, { headers: this.getHeaders() });
  }

  get(id: number): Observable<Product> {
    return this.http.get<Product>(`${PRODUCT_API}/products/${id}`, { headers: this.getHeaders() });
  }

  create(p: Product): Observable<Product> {
    // Adapter le modèle si nécessaire (nom -> name, etc.)
    const payload = {
      name: p.nom,
      description: p.categorie,
      price: p.prix,
      stock: p.quantiteDisponible,
      userId: localStorage.getItem('userId') || 'admin'
    };
    return this.http.post<Product>(`${PRODUCT_API}/products`, payload, { headers: this.getHeaders() });
  }

  update(id: number, p: Product): Observable<Product> {
    const payload = {
      name: p.nom,
      description: p.categorie,
      price: p.prix,
      stock: p.quantiteDisponible,
      userId: localStorage.getItem('userId') || 'admin'
    };
    return this.http.put<Product>(`${PRODUCT_API}/products/${id}`, payload, { headers: this.getHeaders() });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${PRODUCT_API}/products/${id}`, { headers: this.getHeaders() });
  }

  search(term?: string, categorie?: string): Observable<Product[]> {
    // Utiliser le filtrage du nouveau service
    return this.http.get<Product[]>(`${PRODUCT_API}/products/filter`, { headers: this.getHeaders() });
  }

  uploadImage(id: number, file: File): Observable<Product> {
    const fd = new FormData();
    fd.append('file', file);
    return this.http.post<Product>(`${PRODUCT_API}/products/${id}/image`, fd, { headers: this.getHeaders() });
  }

  checkAvailable(id: number, qty: number): Observable<void> {
    return this.http.get<void>(`${PRODUCT_API}/products/${id}/available?qty=${qty}`, { headers: this.getHeaders() });
  }
}

