import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CatalogoComponent } from './catalogo/catalogo.component';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'catalogo', component: CatalogoComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];
