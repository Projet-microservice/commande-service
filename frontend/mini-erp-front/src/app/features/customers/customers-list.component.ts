import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../core/customer.service';
import { ConfirmService } from '../../core/confirm.service';
import { ToastService } from '../../core/toast.service';
import { Customer } from '../../core/models';
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'app-customers-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.css']
})
export class CustomersListComponent {
  customers: Customer[] = [];
  form: Customer = { nom: '', email: '', telephone: '', adresse: '' };
  search = '';
  createOpen = false;

  constructor(private svc: CustomerService, private confirm: ConfirmService, private toast: ToastService) {
    this.reload();
  }
  reload() {
    this.svc.list()
      .pipe(
        catchError(() => {
          this.toast.show('Échec du chargement des clients', 'danger');
          return of([]);
        }),
        finalize(() => {})
      )
      .subscribe(d => (this.customers = d));
  }
  create() {
    if (!this.form.nom) return;
    this.svc.create(this.form)
      .pipe(
        catchError(() => {
          this.toast.show('Échec de création du client', 'danger');
          return of(null);
        }),
        finalize(() => {})
      )
      .subscribe(ok => {
        if (!ok) return;
        this.form = { nom: '', email: '', telephone: '', adresse: '' };
        this.reload();
        this.createOpen = false;
        this.toast.show('Client ajouté', 'success');
      });
  }
  async delete(id: number) {
    const ok = await this.confirm.confirm('Suppression', 'Confirmer la suppression du client ?');
    if (!ok) return;
    this.svc.delete(id)
      .pipe(
        catchError(() => {
          this.toast.show('Échec de suppression du client', 'danger');
          return of(void 0);
        }),
        finalize(() => {})
      )
      .subscribe(() => {
        this.reload();
        this.toast.show('Client supprimé', 'success');
      });
  }
  filtered() {
    const q = (this.search || '').toLowerCase();
    return this.customers.filter(c =>
      [c.nom, c.email, c.telephone, c.adresse].filter(Boolean).some(v => (v || '').toLowerCase().includes(q))
    );
  }
  toggleCreate() { this.createOpen = !this.createOpen; }
}
