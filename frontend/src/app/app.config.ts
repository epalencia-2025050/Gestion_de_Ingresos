import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';
import { authErrorInterceptor } from './core/interceptors/auth-error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // Orden importa: jwtInterceptor adjunta el token a la peticion saliente;
    // authErrorInterceptor revisa la respuesta y reacciona si vino un 401.
    provideHttpClient(withInterceptors([jwtInterceptor, authErrorInterceptor])),
  ],
};
