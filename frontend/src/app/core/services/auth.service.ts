import { Injectable, computed, signal, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, Role, User } from '../models/user.model';

const TOKEN_KEY = 'gi_token';
const USER_KEY = 'gi_user';

/** Forma minima del payload de un JWT que nos interesa leer en el cliente. */
interface DecodedJwtPayload {
  sub?: number;
  email?: string;
  rol?: Role;
  exp?: number; // timestamp en SEGUNDOS (no milisegundos) de expiracion
}

@Injectable({ providedIn: 'root' })
export class AuthService implements OnDestroy {
  // Signal privada con el usuario actual (null si no hay sesion)
  private readonly currentUserSignal = signal<User | null>(this.loadUserFromStorage());

  // Exponemos version de solo lectura hacia afuera
  readonly currentUser = this.currentUserSignal.asReadonly();

  // Signal derivada: true/false segun si hay usuario autenticado
  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);

  // Signal derivada: true si el usuario autenticado tiene rol 'admin'
  readonly isAdmin = computed(() => this.currentUserSignal()?.rol === 'admin');

  // Signal para almacenar el mensaje de expiración de sesión
  readonly sessionExpiredMessage = signal<string | null>(null);

  /** Handle del setTimeout para poder cancelarlo en logout o al destruir */
  private expiryTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
  ) {
    // Al arrancar la app, si ya había una sesión guardada, programa el cierre automático
    this.scheduleTokenExpiry();
  }

  ngOnDestroy(): void {
    this.cancelTokenExpiry();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(
        tap((response) => {
          this.sessionExpiredMessage.set(null);
          this.setSession(response.data.token, response.data.user);
        }),
      );
  }

  logout(sessionExpired: boolean = false): void {
    this.cancelTokenExpiry();
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUserSignal.set(null);

    if (sessionExpired) {
      this.sessionExpiredMessage.set('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      this.router.navigate(['/login'], {
        queryParams: { sessionExpired: 'true' },
      });
    } else {
      this.sessionExpiredMessage.set(null);
      this.router.navigate(['/login']);
    }
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  /**
   * Util para chequear roles especificos en templates o guards,
   * por ejemplo: authService.hasRole(['admin', 'user'])
   */
  hasRole(roles: Role[]): boolean {
    const rol = this.currentUserSignal()?.rol;
    return rol !== undefined && roles.includes(rol);
  }

  /**
   * Revisa la expiracion del JWT SIN llamar al backend, decodificando
   * directamente el token guardado en localStorage. Util para reaccionar
   * de forma inmediata (ej. al hacer click) sin esperar un 401 del servidor.
   *
   * Nota: esto NO reemplaza la validacion del backend (auth.middleware.ts),
   * que sigue siendo la unica fuente de verdad real. Esto es solo para
   * mejorar la experiencia del usuario en el frontend.
   */
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) {
      return false; // sin token no hay "sesion expirada", simplemente no hay sesion
    }

    const payload = this.decodeToken(token);
    if (!payload?.exp) {
      // Token malformado o sin campo exp: lo tratamos como invalido/expirado
      return true;
    }

    const nowInSeconds = Math.floor(Date.now() / 1000);
    return payload.exp < nowInSeconds;
  }

  /**
   * Programa un setTimeout que llama a logout() exactamente cuando
   * el token expire. Se cancela si el usuario hace logout manual antes.
   *
   * El maximo de setTimeout es ~24.8 dias (2^31 ms). Para tokens con
   * expiracion mayor se puede usar setInterval, pero con JWT_EXPIRES_IN=24h
   * este valor es siempre seguro.
   */
  scheduleTokenExpiry(): void {
    this.cancelTokenExpiry(); // limpiar timer previo si existia

    const token = this.getToken();
    if (!token) return;

    const payload = this.decodeToken(token);
    if (!payload?.exp) return;

    const nowMs = Date.now();
    const expiryMs = payload.exp * 1000; // convertir segundos a milisegundos
    const msUntilExpiry = expiryMs - nowMs;

    if (msUntilExpiry <= 0) {
      // Ya expiró: cerrar sesión inmediatamente notificando expiración
      this.logout(true);
      return;
    }

    this.expiryTimer = setTimeout(() => {
      this.logout(true);
    }, msUntilExpiry);
  }

  /** Cancela el timer de expiración si existe. */
  private cancelTokenExpiry(): void {
    if (this.expiryTimer !== null) {
      clearTimeout(this.expiryTimer);
      this.expiryTimer = null;
    }
  }

  /**
   * Decodifica la parte "payload" de un JWT (segunda seccion, separada por
   * puntos) sin verificar la firma. Verificar la firma es responsabilidad
   * exclusiva del backend; aqui solo queremos LEER datos publicos como "exp".
   */
  private decodeToken(token: string): DecodedJwtPayload | null {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    try {
      const base64Payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64Payload)
          .split('')
          .map((char) => '%' + char.charCodeAt(0).toString(16).padStart(2, '0'))
          .join(''),
      );
      return JSON.parse(jsonPayload) as DecodedJwtPayload;
    } catch {
      return null;
    }
  }

  private setSession(token: string, user: User): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.currentUserSignal.set(user);
    // Programar el cierre automático en cuanto guardamos la nueva sesión
    this.scheduleTokenExpiry();
  }

  private loadUserFromStorage(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }
}
