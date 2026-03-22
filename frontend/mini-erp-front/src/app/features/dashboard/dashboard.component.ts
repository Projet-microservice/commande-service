import { Component, signal, computed, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceService } from '../../core/invoice.service';
import { OrderService } from '../../core/order.service';
import { InvoiceStatus, Product } from '../../core/models';
import Chart from 'chart.js/auto';
import { catchError, finalize, of } from 'rxjs';
import { ProductService } from '../../core/product.service';
import { CustomerService } from '../../core/customer.service';
import { PRODUCT_API } from '../../core/api';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit, OnDestroy {
  private orders = signal<number>(0);
  private totalAwaiting = signal<number>(0);
  private totalPayee = signal<number>(0);
  totalClients = 0;
  totalProducts = 0;
  recentOrders: any[] = [];
  latestProducts: Product[] = [];
  @ViewChild('salesChart') salesChartRef?: ElementRef<HTMLCanvasElement>;
  private chart?: Chart;

  ordersCount = computed(() => this.orders());
  totalPending = computed(() => this.totalAwaiting());
  totalPaid = computed(() => this.totalPayee());

  constructor(
    private invoices: InvoiceService, 
    private ordersSvc: OrderService, 
    private productSvc: ProductService,
    private customerSvc: CustomerService
  ) {
    this.ordersSvc.list()
      .pipe(
        catchError(() => of([])),
        finalize(() => {})
      )
      .subscribe(list => {
        this.orders.set((list as any[]).length);
        this.recentOrders = [...(list as any[])].slice(-5).reverse();
      });

    this.productSvc.list().subscribe(ps => {
      this.totalProducts = ps.length;
      // Adapter le modèle pour l'affichage
      this.latestProducts = (ps || []).slice(0, 8).map((x: any) => ({
        ...x,
        nom: x.name || x.nom,
        prix: x.price || x.prix,
        quantiteDisponible: x.stock || x.quantiteDisponible
      }));
    });

    this.customerSvc.list().subscribe(cs => {
      this.totalClients = cs.length;
    });

    this.invoices
      .totalByStatus('EN_ATTENTE')
      .pipe(
        catchError(() => of({ total: 0 })),
        finalize(() => {})
      )
      .subscribe(r => this.totalAwaiting.set((r as any).total || 0));
    this.invoices
      .totalByStatus('PAYEE')
      .pipe(
        catchError(() => of({ total: 0 })),
        finalize(() => {})
      )
      .subscribe(r => this.totalPayee.set((r as any).total || 0));
  }
  imageSrc(p: Product) {
    return p.imageUrl ? `${PRODUCT_API}${p.imageUrl}` : `https://picsum.photos/seed/${p.id || p.nom}/300/200`;
  }

  ngAfterViewInit(): void {
    const canvas = this.salesChartRef?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    if (this.chart) {
      this.chart.destroy();
    }
    const labels = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'];
    const data = [1200, 1800, 900, 2000, 2300, 1900];
    if (!labels.length || !data.length) return;
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Ventes',
            data,
            fill: true,
            tension: 0.35,
            borderColor: '#0d6efd',
            backgroundColor: 'rgba(13,110,253,.1)',
            pointRadius: 3
          }
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = undefined;
    }
  }

  statusClass(status: string) {
    switch (status) {
      case 'EN_COURS': return 'badge bg-warning-subtle text-warning';
      case 'VALIDEE': return 'badge bg-info-subtle text-info';
      case 'LIVREE': return 'badge bg-success-subtle text-success';
      default: return 'badge bg-secondary-subtle text-secondary';
    }
  }
}
