import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        const esPeticionDeLogin = req.url.includes('/auth/login');

        if (!esPeticionDeLogin) {
          // 1. Verificar si existía una sesión/token antes del error
          const teniaSesionActiva = !!authService.getToken(); // o localStorage.getItem('token')

          // 2. Limpiar el estado de la sesión local
          authService.logout();

          // 3. Redirigir enviando queryParams SOLO si realmente había una sesión activa que venció
          if (teniaSesionActiva) {
            router.navigate(['/login'], {
              queryParams: { sessionExpired: 'true' },
            });
          } else {
            router.navigate(['/login']);
          }
        }
      }
      return throwError(() => error);
    }),
  );
};