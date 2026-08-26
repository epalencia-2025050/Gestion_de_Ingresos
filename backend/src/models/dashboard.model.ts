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
  mes: string; // ej: 'Jan', 'Feb', 'Mar'
  mesCompleto: string;
  ano: number;
  ingresos: number;
  gastos: number;
  ahorro: number;
  valorGrafica: number; // porcentaje o ratio para la gráfica de barras
}

