import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private _loading = new BehaviorSubject<number>(0);
  loading$ = this._loading.asObservable();
  private timers: number[] = [];

  show() {
    const next = this._loading.value + 1;
    this._loading.next(next);
    const id = window.setTimeout(() => this.expire(id), 15000);
    this.timers.push(id);
  }
  hide() {
    const id = this.timers.shift();
    if (id !== undefined) clearTimeout(id);
    const next = Math.max(0, this._loading.value - 1);
    this._loading.next(next);
  }
  private expire(id: number) {
    const idx = this.timers.indexOf(id);
    if (idx !== -1) {
      this.timers.splice(idx, 1);
      const next = Math.max(0, this._loading.value - 1);
      this._loading.next(next);
    }
  }
}
