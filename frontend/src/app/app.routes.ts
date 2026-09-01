import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'admin/users',
    // authGuard primero (¿hay sesion?), adminGuard despues (¿es admin?)
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./features/admin/pages/users/users.component').then((m) => m.AdminUsersComponent),
  },
  { path: '**', redirectTo: 'login' },
];
