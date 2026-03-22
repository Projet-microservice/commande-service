import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../core/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 2100">
      <div class="toast show mb-2" *ngFor="let t of toasts" [ngClass]="typeClass(t.type)">
        <div class="toast-header">
          <strong class="me-auto">{{ t.title || 'Notification' }}</strong>
          <button type="button" class="btn-close" aria-label="Close" (click)="close(t.id)"></button>
        </div>
        <div class="toast-body">
          {{ t.message }}
        </div>
      </div>
    </div>
  `
})
export class ToastContainerComponent {
  toasts: any[] = [];
  constructor(private svc: ToastService) {
    this.svc.list$.subscribe(l => this.toasts = l);
  }
  close(id: number) { this.svc.dismiss(id); }
  typeClass(type?: string) {
    switch (type) {
      case 'success': return 'text-bg-success';
      case 'warning': return 'text-bg-warning';
      case 'danger': return 'text-bg-danger';
      default: return 'text-bg-primary';
    }
  }
}
