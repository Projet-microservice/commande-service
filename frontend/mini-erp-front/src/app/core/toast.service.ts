import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: number;
  title?: string;
  message: string;
  type?: 'success' | 'info' | 'warning' | 'danger';
  timeout?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private _list = new BehaviorSubject<Toast[]>([]);
  list$ = this._list.asObservable();
  private seq = 1;

  show(message: string, type: Toast['type'] = 'info', title?: string, timeout = 3000) {
    const toast: Toast = { id: this.seq++, message, type, title, timeout };
    const list = [...this._list.value, toast];
    this._list.next(list);
    if (timeout > 0) setTimeout(() => this.dismiss(toast.id), timeout);
  }
  dismiss(id: number) {
    this._list.next(this._list.value.filter(t => t.id !== id));
  }
}
