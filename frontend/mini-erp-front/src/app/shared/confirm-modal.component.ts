import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

declare const bootstrap: any;

export interface ConfirmPayload {
  title?: string;
  message?: string;
  resolve?: (v: boolean) => void;
}

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal fade" tabindex="-1" id="confirmModal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ payload?.title || 'Confirmation' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p class="mb-0">{{ payload?.message || 'Confirmez-vous cette action ?' }}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Annuler</button>
            <button type="button" class="btn btn-danger" (click)="confirm()">Confirmer</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ConfirmModalComponent {
  payload?: ConfirmPayload;
  private modal?: any;
  open(payload: ConfirmPayload) {
    this.payload = payload;
    const el = document.getElementById('confirmModal');
    if (!el) return;
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
  }
  confirm() {
    this.payload?.resolve?.(true);
    this.modal?.hide();
  }
}
