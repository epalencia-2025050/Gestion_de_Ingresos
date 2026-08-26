import { Component, HostListener } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class AppComponent {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  /**
   * Escucha CUALQUIER click en el documento (component raiz = vive en
   * toda la app, asi que este listener cubre absolutamente toda la UI).
   * En cada click, verifica si el token ya expiro y, si es asi, cierra
   * sesion y redirige al login de inmediato, sin esperar una peticion HTTP.
   */
  @HostListener('document:click')
  onDocumentClick(): void {
    this.checkSessionExpiration();
  }

  private checkSessionExpiration(): void {
    // Si no hay sesion activa, no hay nada que verificar.
    if (!this.authService.isAuthenticated()) {
      return;
    }

    if (!this.authService.isTokenExpired()) {
      return;
    }

    // logout() ya limpia localStorage y el signal del usuario.
    this.authService.logout();
    this.router.navigate(['/login'], {
      queryParams: { sessionExpired: 'true' },
    });
  }
}
