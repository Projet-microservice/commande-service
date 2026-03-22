import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { OrdersListComponent } from './features/orders/orders-list.component';
import { InvoicesListComponent } from './features/invoices/invoices-list.component';
import { CustomersListComponent } from './features/customers/customers-list.component';
import { ProductsListComponent } from './features/products/products-list.component';
import { CartComponent } from './features/cart/cart.component';
import { InvoicePrintComponent } from './features/invoices/invoice-print.component';
import { HomeComponent } from './features/home/home.component';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { FavoritesComponent } from './features/favorites/favorites.component';
import { LoginComponent } from './features/auth/login.component';
import { RegisterComponent } from './features/auth/register.component';
import { authGuard } from './core/auth.guard';
import { adminGuard } from './core/admin.guard';
import { guestGuard } from './core/guest.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },

  // Dashboard et autres routes admin en premier pour éviter le conflit de layout
  {
    path: 'dashboard',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [{ path: '', component: DashboardComponent }]
  },
  {
    path: 'orders',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [{ path: '', component: OrdersListComponent }]
  },
  {
    path: 'invoices',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [{ path: '', component: InvoicesListComponent }]
  },
  {
    path: 'invoice/:id/print',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [{ path: '', component: InvoicePrintComponent }]
  },
  {
    path: 'customers',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [{ path: '', component: CustomersListComponent }]
  },
  {
    path: 'products',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [{ path: '', component: ProductsListComponent }]
  },

  // Routes publiques
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'cart', component: CartComponent },
      { path: 'favorites', component: FavoritesComponent },
    ]
  },

  { path: '**', redirectTo: 'home' }
];
