import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from './api';
import { Order, OrderStatus } from './models';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private http: HttpClient) {}

  list(): Observable<Order[]> {
    return this.http.get<Order[]>(`${API_BASE}/orders`);
  }

  get(id: number): Observable<Order> {
    return this.http.get<Order>(`${API_BASE}/orders/${id}`);
  }

  create(customerId: number): Observable<Order> {
    return this.http.post<Order>(`${API_BASE}/orders`, { customerId });
  }

  updateStatus(id: number, status: OrderStatus): Observable<Order> {
    return this.http.put<Order>(`${API_BASE}/orders/${id}`, { status });
  }

  addItem(id: number, productId: number, quantity: number): Observable<Order> {
    return this.http.post<Order>(`${API_BASE}/orders/${id}/items`, { productId, quantity });
  }

  removeItem(orderId: number, itemId: number): Observable<Order> {
    return this.http.delete<Order>(`${API_BASE}/orders/${orderId}/items/${itemId}`);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE}/orders/${id}`);
  }
}
