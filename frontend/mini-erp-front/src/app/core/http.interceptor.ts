import { inject } from '@angular/core';
import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable, catchError, finalize, throwError } from 'rxjs';
import { LoadingService } from './loading.service';
import { ToastService } from './toast.service';

export function loadingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const loading = inject(LoadingService);
  const toast = inject(ToastService);
  loading.show();
  const handled$ = next(req).pipe(
      catchError(err => {
        console.error('HTTP Error Details:', err);
        let msg = 'Erreur réseau';
        if (err.status === 401) {
          msg = 'Email ou mot de passe incorrect';
        } else if (err.error?.message) {
          msg = Array.isArray(err.error.message) ? err.error.message.join(', ') : err.error.message;
        } else if (err.status) {
          msg = `Erreur ${err.status} - ${err.statusText}`;
        }
        toast.show(msg, 'danger', 'Erreur', 5000);
        return throwError(() => err);
      }),
      finalize(() => {
        loading.hide();
      })
  );
  return handled$;
}
