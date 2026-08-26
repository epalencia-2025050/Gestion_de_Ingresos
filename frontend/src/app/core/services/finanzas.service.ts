import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AppNotification,
  CategoriaGasto,
  CreateGastoPayload,
  CreateIngresoPayload,
  DashboardResumen,
  Gasto,
  Ingreso,
  TendenciaMensual,
} from '../models/finanzas.model';

@Injectable({
  providedIn: 'root',
})
export class FinanzasService {
  private readonly apiUrl = environment.apiUrl;

  // Signals para estado global reactivo
  readonly resumen = signal<DashboardResumen>({
    saldoTotal: 0,
    ahorroAcumulado: 0,
    gastosCobrados: 0,
    gastosPorCobrar: 0,
    totalIngresos: 0,
    totalGastos: 0,
    porcentajeSaldoMes: 24,
    porcentajeAhorroMes: 5.1,
    estadoCobrados: '-Estable',
    estadoPorCobrar: 'requiere atencion',
  });

  readonly categorias = signal<CategoriaGasto[]>([]);
  readonly tendencia = signal<TendenciaMensual[]>([]);
  readonly ingresos = signal<Ingreso[]>([]);
  readonly gastos = signal<Gasto[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  // Notificaciones en tiempo real
  readonly notifications = signal<AppNotification[]>([
    {
      id: 'init-1',
      tipo: 'sistema',
      mensaje: 'Bienvenido al Sistema de Gestión de Ingresos',
      fecha: new Date(),
      leida: false,
    },
  ]);

  // Avatar personalizado del usuario
  readonly userAvatar = signal<string>(
    localStorage.getItem('gi_user_avatar') ||
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=120&auto=format&fit=crop&q=80'
  );

  constructor(private readonly http: HttpClient) {}

  setAvatar(newAvatarUrl: string): void {
    localStorage.setItem('gi_user_avatar', newAvatarUrl);
    this.userAvatar.set(newAvatarUrl);
    this.addNotification({
      tipo: 'sistema',
      mensaje: 'Foto de perfil actualizada exitosamente',
    });
  }

  addNotification(notif: { tipo: 'ingreso' | 'gasto' | 'sistema'; mensaje: string; monto?: number }): void {
    const newNotif: AppNotification = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 4),
      tipo: notif.tipo,
      mensaje: notif.mensaje,
      monto: notif.monto,
      fecha: new Date(),
      leida: false,
    };
    this.notifications.update((list) => [newNotif, ...list.slice(0, 19)]);
  }

  markNotificationsAsRead(): void {
    this.notifications.update((list) => list.map((n) => ({ ...n, leida: true })));
  }

  clearNotifications(): void {
    this.notifications.set([]);
  }

  /** Carga inicial completa de datos */
  loadAll(): void {
    this.loading.set(true);
    this.error.set(null);

    this.loadResumen();
    this.loadCategorias();
    this.loadTendencia();
    this.loadIngresos();
    this.loadGastos();
  }

  loadResumen(): void {
    this.http.get<{ data: DashboardResumen }>(`${this.apiUrl}/dashboard/resumen`).subscribe({
      next: (res) => this.resumen.set(res.data),
      error: (err) => this.handleError(err, 'Error al cargar resumen'),
    });
  }

  loadCategorias(): void {
    this.http.get<{ data: CategoriaGasto[] }>(`${this.apiUrl}/dashboard/categorias`).subscribe({
      next: (res) => this.categorias.set(res.data),
      error: (err) => this.handleError(err, 'Error al cargar categorías'),
    });
  }

  loadTendencia(months: number = 6): void {
    this.http.get<{ data: TendenciaMensual[] }>(`${this.apiUrl}/dashboard/tendencia?months=${months}`).subscribe({
      next: (res) => this.tendencia.set(res.data),
      error: (err) => this.handleError(err, 'Error al cargar tendencia'),
    });
  }

  loadIngresos(search?: string): void {
    let params = new HttpParams();
    if (search && search.trim()) {
      params = params.set('search', search.trim());
    }
    this.http.get<{ data: Ingreso[] }>(`${this.apiUrl}/ingresos`, { params }).subscribe({
      next: (res) => {
        this.ingresos.set(res.data);
        this.loading.set(false);
      },
      error: (err) => this.handleError(err, 'Error al cargar ingresos'),
    });
  }

  loadGastos(search?: string): void {
    let params = new HttpParams();
    if (search && search.trim()) {
      params = params.set('search', search.trim());
    }
    this.http.get<{ data: Gasto[] }>(`${this.apiUrl}/gastos`, { params }).subscribe({
      next: (res) => {
        this.gastos.set(res.data);
        this.loading.set(false);
      },
      error: (err) => this.handleError(err, 'Error al cargar gastos'),
    });
  }

  // --- CRUD Ingresos ---
  createIngreso(payload: CreateIngresoPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/ingresos`, payload).pipe(
      tap(() => {
        this.addNotification({
          tipo: 'ingreso',
          mensaje: `Nuevo ingreso: ${payload.descripcion}`,
          monto: payload.monto,
        });
        this.refreshDashboard();
      }),
    );
  }

  updateIngreso(id: number, payload: Partial<CreateIngresoPayload>): Observable<any> {
    return this.http.put(`${this.apiUrl}/ingresos/${id}`, payload).pipe(
      tap(() => {
        this.addNotification({
          tipo: 'ingreso',
          mensaje: `Ingreso actualizado #${id}`,
          monto: payload.monto,
        });
        this.refreshDashboard();
      }),
    );
  }

  deleteIngreso(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/ingresos/${id}`).pipe(
      tap(() => {
        this.addNotification({
          tipo: 'sistema',
          mensaje: `Ingreso #${id} eliminado`,
        });
        this.refreshDashboard();
      }),
    );
  }

  // --- CRUD Gastos ---
  createGasto(payload: CreateGastoPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/gastos`, payload).pipe(
      tap(() => {
        this.addNotification({
          tipo: 'gasto',
          mensaje: `Nuevo gasto registrado (${payload.categoria}): ${payload.descripcion}`,
          monto: payload.monto,
        });
        this.refreshDashboard();
      }),
    );
  }

  updateGasto(id: number, payload: Partial<CreateGastoPayload>): Observable<any> {
    return this.http.put(`${this.apiUrl}/gastos/${id}`, payload).pipe(
      tap(() => {
        this.addNotification({
          tipo: 'gasto',
          mensaje: `Gasto actualizado #${id}`,
          monto: payload.monto,
        });
        this.refreshDashboard();
      }),
    );
  }

  deleteGasto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/gastos/${id}`).pipe(
      tap(() => {
        this.addNotification({
          tipo: 'sistema',
          mensaje: `Gasto #${id} eliminado`,
        });
        this.refreshDashboard();
      }),
    );
  }

  /** Refresca todo el estado financiero en tiempo real tras cualquier cambio */
  refreshDashboard(): void {
    this.loadResumen();
    this.loadCategorias();
    this.loadTendencia();
    this.loadIngresos();
    this.loadGastos();
  }

  private handleError(err: any, defaultMsg: string): void {
    this.loading.set(false);
    const msg = err?.error?.message || defaultMsg;
    this.error.set(msg);
  }
}
