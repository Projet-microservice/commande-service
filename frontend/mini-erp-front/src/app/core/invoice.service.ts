import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_BASE } from './api';
import { Invoice, InvoiceStatus } from './models';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  constructor(private http: HttpClient) {}

  list(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${API_BASE}/invoices`);
  }

  get(id: number): Observable<Invoice> {
    return this.http.get<Invoice>(`${API_BASE}/invoices/${id}`);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE}/invoices/${id}`);
  }

  generate(orderId: number): Observable<Invoice> {
    const params = new HttpParams().set('orderId', orderId);
    return this.http.post<Invoice>(`${API_BASE}/invoices`, null, { params });
  }

  updateStatus(id: number, status: InvoiceStatus): Observable<Invoice> {
    return this.http.put<Invoice>(`${API_BASE}/invoices/${id}`, { status });
  }

  totalByStatus(status: InvoiceStatus): Observable<{ total: number }> {
    const params = new HttpParams().set('status', status);
    return this.http.get<{ total: number }>(`${API_BASE}/invoices/report`, { params });
  }
}
