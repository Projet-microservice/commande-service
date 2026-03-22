import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../core/order.service';
import { CustomerService } from '../../core/customer.service';
import { ProductService } from '../../core/product.service';
import { Order, OrderStatus, Customer, Product } from '../../core/models';
import { ConfirmService } from '../../core/confirm.service';
import { ToastService } from '../../core/toast.service';
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.css']
})
export class OrdersListComponent {
  orders: Order[] = [];
  customers: Customer[] = [];
  products: Product[] = [];
  selectedCustomerId: number | null = null;
  
  selectedOrderId: number | null = null;
  selectedProductId: number | null = null;
  quantity = 1;

  constructor(
    private ordersSvc: OrderService,
    private customersSvc: CustomerService,
    private productsSvc: ProductService,
    private confirm: ConfirmService,
    private toast: ToastService
  ) {
    this.reloadAll();
  }

  reloadAll() {
    this.ordersSvc.list()
      .pipe(catchError(() => { this.toast.show('Échec chargement commandes', 'danger'); return of([]); }), finalize(() => {}))
      .subscribe(d => (this.orders = d));
    this.customersSvc.list()
      .pipe(catchError(() => { this.toast.show('Échec chargement clients', 'danger'); return of([]); }), finalize(() => {}))
      .subscribe(d => (this.customers = d));
    this.productsSvc.list()
      .pipe(catchError(() => { this.toast.show('Échec chargement produits', 'danger'); return of([]); }), finalize(() => {}))
      .subscribe(d => (this.products = d));
  }

  createOrder() {
    if (!this.selectedCustomerId) return;
    this.ordersSvc.create(this.selectedCustomerId)
      .pipe(catchError(() => { this.toast.show('Échec création commande', 'danger'); return of(null); }), finalize(() => {}))
      .subscribe(ok => {
        if (!ok) return;
        this.reloadAll();
        this.toast.show('Commande créée', 'success');
      });
  }

  updateStatus(order: Order) {
    if (!order.id || !order.status) return;
    this.ordersSvc.updateStatus(order.id, order.status as OrderStatus)
      .pipe(catchError(() => { this.toast.show('Échec maj status', 'danger'); return of(order); }), finalize(() => {}))
      .subscribe(() => this.reloadAll());
  }

  async deleteOrder(id: number) {
    const ok = await this.confirm.confirm('Suppression', 'Confirmer la suppression de la commande ?');
    if (!ok) return;
    this.ordersSvc.delete(id)
      .pipe(catchError(() => { this.toast.show('Échec suppression commande', 'danger'); return of(void 0); }), finalize(() => {}))
      .subscribe(() => {
        this.reloadAll();
        this.toast.show('Commande supprimée', 'success');
      });
  }

  addItem() {
    if (!this.selectedOrderId || !this.selectedProductId || this.quantity <= 0) return;
    this.ordersSvc.addItem(this.selectedOrderId, this.selectedProductId, this.quantity)
      .pipe(catchError(() => { this.toast.show('Échec ajout article', 'danger'); return of(null); }), finalize(() => {}))
      .subscribe(ok => {
        if (!ok) return;
        this.reloadAll();
        this.toast.show('Article ajouté', 'success');
      });
  }
}
