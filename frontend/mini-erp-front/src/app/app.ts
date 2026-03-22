import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoaderComponent } from './shared/loader.component';
import { ToastContainerComponent } from './shared/toast-container.component';
import { ConfirmModalComponent } from './shared/confirm-modal.component';
import { ViewChild } from '@angular/core';
import { ConfirmService } from './core/confirm.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoaderComponent, ToastContainerComponent, ConfirmModalComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('mini-erp-front');
  @ViewChild(ConfirmModalComponent) confirmModal?: ConfirmModalComponent;
  constructor(private confirm: ConfirmService) {}
  ngAfterViewInit() {
    if (this.confirmModal) this.confirm.register(this.confirmModal);
  }
}
