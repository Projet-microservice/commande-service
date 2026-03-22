import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { USER_API, API_BASE } from './api';
import { Customer } from './models';
import { Observable, map, of, catchError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  constructor(private http: HttpClient) {}

  list(): Observable<Customer[]> {
    return this.http.get<any[]>(`${USER_API}/users`).pipe(
      map(users => users.map(u => this.mapUserToCustomer(u)))
    );
  }

  get(id: number): Observable<Customer> {
    return this.http.get<any>(`${USER_API}/users/${id}`).pipe(
      map(u => this.mapUserToCustomer(u))
    );
  }

  create(c: Customer): Observable<Customer> {
    const payload = {
      name: c.nom,
      email: c.email,
      password: 'DefaultPassword123!', // Le user-service semble exiger un password
      role: 'USER'
    };
    return this.http.post<any>(`${USER_API}/users`, payload).pipe(
      map(u => this.mapUserToCustomer(u))
    );
  }

  update(id: number, c: Customer): Observable<Customer> {
    const payload = {
      name: c.nom,
      email: c.email
    };
    return this.http.patch<any>(`${USER_API}/users/${id}`, payload).pipe(
      map(u => this.mapUserToCustomer(u))
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${USER_API}/users/${id}`);
  }

  /**
   * S'assure que le client existe dans la base de données de commande (MySQL)
   */
  ensureInOrderService(c: Customer): Observable<Customer> {
    return this.http.get<Customer>(`${API_BASE}/customers/${c.id}`).pipe(
      catchError(() => {
        // Si le client n'existe pas, on le crée dans order-invoice-service
        const payload = {
          id: c.id,
          nom: c.nom,
          email: c.email,
          telephone: c.telephone || '',
          adresse: c.adresse || ''
        };
        return this.http.post<Customer>(`${API_BASE}/customers`, payload);
      })
    );
  }

  private mapUserToCustomer(u: any): Customer {
    return {
      id: u.id || u._id,
      nom: u.name || u.username,
      email: u.email,
      telephone: u.phone || '',
      adresse: u.address || ''
    };
  }
}

