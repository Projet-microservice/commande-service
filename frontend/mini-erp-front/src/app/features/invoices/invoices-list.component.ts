import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InvoiceService } from '../../core/invoice.service';
import { OrderService } from '../../core/order.service';
import { Invoice, InvoiceStatus, Order } from '../../core/models';
import { RouterModule } from '@angular/router';
import { ToastService } from '../../core/toast.service';
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'app-invoices-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './invoices-list.component.html',
  styleUrls: ['./invoices-list.component.css']
})
export class InvoicesListComponent {
  invoices: Invoice[] = [];
  orders: Order[] = [];
  selectedOrderId: number | null = null;

  constructor(private svc: InvoiceService, private ordersSvc: OrderService, private toast: ToastService) {
    this.reload();
    this.ordersSvc.list()
      .pipe(catchError(() => { this.toast.show('Échec chargement commandes', 'danger'); return of([]); }), finalize(() => {}))
      .subscribe(d => (this.orders = d));
  }
  reload() {
    this.svc.list()
      .pipe(catchError(() => { this.toast.show('Échec chargement factures', 'danger'); return of([]); }), finalize(() => {}))
      .subscribe(d => (this.invoices = d));
  }
  generate() {
    if (!this.selectedOrderId) return;
    this.svc.generate(this.selectedOrderId)
      .pipe(catchError(() => { this.toast.show('Échec génération facture', 'danger'); return of(null); }), finalize(() => {}))
      .subscribe(ok => { if (ok) this.reload(); });
  }
  updateStatus(inv: Invoice) {
    if (!inv.id || !inv.status) return;
    this.svc.updateStatus(inv.id, inv.status as InvoiceStatus)
      .pipe(catchError(() => { this.toast.show('Échec mise à jour facture', 'danger'); return of(inv); }), finalize(() => {}))
      .subscribe(() => this.reload());
  }
  delete(id: number) {
    this.svc.delete(id)
      .pipe(catchError(() => { this.toast.show('Échec suppression facture', 'danger'); return of(void 0); }), finalize(() => {}))
      .subscribe(() => this.reload());
  }
}
