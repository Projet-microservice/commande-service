import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../core/cart.service';
import { OrderService } from '../../core/order.service';
import { InvoiceService } from '../../core/invoice.service';
import { AuthService } from '../../core/auth.service';
import { ToastService } from '../../core/toast.service';
import { CustomerService } from '../../core/customer.service';
import { forkJoin, switchMap, map, from, concatMap, toArray, of } from 'rxjs';
import { Order } from '../../core/models';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  items: { product: any; qty: number }[] = [];
  loading = false;

  private cart = inject(CartService);
  private orderSvc = inject(OrderService);
  private invoiceSvc = inject(InvoiceService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);
  private customerSvc = inject(CustomerService);

  constructor() {
    this.cart.items$.subscribe(list => {
      this.items = (list || []).map((p: any) => ({ 
        product: {
          ...p,
          nom: p.name || p.nom,
          prix: p.price || p.prix,
          quantiteDisponible: p.stock || p.quantiteDisponible
        }, 
        qty: this.cart.getQty(p.id!) 
      }));
    });
  }

  onOrder() {
    if (this.items.length === 0) return;
    
    const user = this.auth.getUser();
    if (!user) {
      this.toast.show('Veuillez vous connecter pour commander', 'warning');
      this.router.navigate(['/login']);
      return;
    }

    this.loading = true;
    
    const customer = {
      id: Number(user.id),
      nom: user.name,
      email: user.email,
      telephone: '',
      adresse: ''
    };

    let createdOrder: Order;

    this.customerSvc.ensureInOrderService(customer).pipe(
      // 1. Créer la commande
      switchMap(c => this.orderSvc.create(c.id!)),
      // 2. Ajouter les articles un par un (séquentiel pour éviter les conflits DB)
      switchMap((order: Order) => {
        createdOrder = order;
        return from(this.items).pipe(
          concatMap(i => this.orderSvc.addItem(order.id!, i.product.id!, i.qty)),
          toArray()
        );
      }),
      // 3. Générer la facture
      switchMap(() => this.invoiceSvc.generate(createdOrder.id!))
    ).subscribe({
      next: (invoice) => {
        console.log('Invoice generated:', invoice);
        this.loading = false;
        this.cart.clear();
        this.toast.show('Commande validée avec succès !', 'success');
        if (invoice && invoice.id) {
          this.router.navigate(['/invoice', invoice.id, 'print']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Erreur commande:', err);
        this.toast.show('Échec de la commande. Veuillez vérifier le stock.', 'danger');
      }
    });
  }

  update(id: number, qty: number) { this.cart.update(id, Math.max(1, qty || 1)); }
  inc(id: number, qty: number) { this.cart.update(id, Math.max(1, (qty || 1) + 1)); }
  dec(id: number, qty: number) { this.cart.update(id, Math.max(1, (qty || 1) - 1)); }
  remove(id: number) { this.cart.remove(id); }
  clear() { this.cart.clear(); }
  total() { return this.cart.total(); }
}
