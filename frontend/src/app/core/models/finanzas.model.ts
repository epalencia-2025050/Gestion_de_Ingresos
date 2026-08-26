export interface Ingreso {
  id: number;
  usuarioId: number;
  monto: number;
  descripcion: string;
  fecha: string;
  categoria: string;
  estado: string;
  fechaCreacion?: string;
}

export interface Gasto {
  id: number;
  usuarioId: number;
  monto: number;
  descripcion: string;
  fecha: string;
  categoria: string;
  estado: string; // 'pagado' (cobrado) | 'pendiente' (por cobrar)
  fechaCreacion?: string;
}

export interface DashboardResumen {
  saldoTotal: number;
  ahorroAcumulado: number;
  gastosCobrados: number;
  gastosPorCobrar: number;
  totalIngresos: number;
  totalGastos: number;
  porcentajeSaldoMes: number;
  porcentajeAhorroMes: number;
  estadoCobrados: string;
  estadoPorCobrar: string;
}

export interface CategoriaGasto {
  categoria: string;
  total: number;
  porcentaje: number;
  color?: string;
}

export interface TendenciaMensual {
  mes: string;
  mesCompleto: string;
  ano: number;
  ingresos: number;
  gastos: number;
  ahorro: number;
  valorGrafica: number;
}

export interface AppNotification {
  id: string;
  tipo: 'ingreso' | 'gasto' | 'sistema';
  mensaje: string;
  monto?: number;
  fecha: Date;
  leida: boolean;
}

export interface CreateIngresoPayload {
  monto: number;
  descripcion: string;
  fecha: string;
  categoria: string;
  estado: string;
}

export interface CreateGastoPayload {
  monto: number;
  descripcion: string;
  fecha: string;
  categoria: string;
  estado: string;
}

