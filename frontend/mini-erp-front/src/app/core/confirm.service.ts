import { Injectable } from '@angular/core';
import { ConfirmModalComponent } from '../shared/confirm-modal.component';

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  private modalRef?: ConfirmModalComponent;

  register(ref: ConfirmModalComponent) {
    this.modalRef = ref;
  }

  confirm(title: string, message: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.modalRef?.open({ title, message, resolve });
    });
  }
}
