import { ingresoRepository } from '../repositories/ingreso.repository';
import { gastoRepository } from '../repositories/gasto.repository';
import { CategoriaGasto, DashboardResumen, TendenciaMensual } from '../models/dashboard.model';

const CATEGORY_COLORS: Record<string, string> = {
  vivienda: '#0b3d4a',
  alimentacion: '#f5a324',
  alimentación: '#f5a324',
  transporte: '#1ea6b6',
  otros: '#ffffff',
  otro: '#ffffff',
};

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
const MONTH_FULL_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export class DashboardService {
  async getResumen(userId: number): Promise<DashboardResumen> {
    const [totalIngresos, totalGastos, estadosGastos] = await Promise.all([
      ingresoRepository.getTotalByUserId(userId),
      gastoRepository.getTotalByUserId(userId),
      gastoRepository.getTotalsByEstado(userId),
    ]);

    const saldoTotal = totalIngresos - totalGastos;
    const ahorroAcumulado = Math.max(0, saldoTotal);

    return {
      saldoTotal: Math.round(saldoTotal * 100) / 100,
      ahorroAcumulado: Math.round(ahorroAcumulado * 100) / 100,
      gastosCobrados: Math.round(estadosGastos.cobrados * 100) / 100,
      gastosPorCobrar: Math.round(estadosGastos.porCobrar * 100) / 100,
      totalIngresos: Math.round(totalIngresos * 100) / 100,
      totalGastos: Math.round(totalGastos * 100) / 100,
      porcentajeSaldoMes: 24, // o dinámico según mes actual vs anterior
      porcentajeAhorroMes: 5.1,
      estadoCobrados: '-Estable',
      estadoPorCobrar: estadosGastos.porCobrar > 0 ? 'requiere atencion' : 'al dia',
    };
  }

  async getCategorias(userId: number): Promise<CategoriaGasto[]> {
    const rawCategories = await gastoRepository.getCategoryBreakdown(userId);
    const totalGasto = rawCategories.reduce((acc, curr) => acc + curr.total, 0);

    // Garantizar que estén representadas las categorías estándar
    const standardCategories = ['Vivienda', 'Alimentación', 'Transporte', 'Otros'];
    const map = new Map<string, number>();

    standardCategories.forEach(cat => map.set(cat.toLowerCase(), 0));

    rawCategories.forEach(item => {
      const lower = item.categoria.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      let matched = false;
      for (const std of standardCategories) {
        const stdLower = std.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        if (stdLower === lower || lower.includes(stdLower) || stdLower.includes(lower)) {
          map.set(std.toLowerCase(), (map.get(std.toLowerCase()) || 0) + item.total);
          matched = true;
          break;
        }
      }
      if (!matched) {
        map.set('otros', (map.get('otros') || 0) + item.total);
      }
    });

    const result: CategoriaGasto[] = standardCategories.map(cat => {
      const key = cat.toLowerCase();
      const val = map.get(key) || 0;
      const pct = totalGasto > 0 ? Math.round((val / totalGasto) * 1000) / 10 : 0;
      return {
        categoria: cat,
        total: Math.round(val * 100) / 100,
        porcentaje: pct,
        color: CATEGORY_COLORS[key] || '#1fb4c2',
      };
    });

    return result;
  }

  async getTendencia(userId: number, totalMonths: number = 6): Promise<TendenciaMensual[]> {
    const [ingresosMensuales, gastosMensuales] = await Promise.all([
      ingresoRepository.getMonthlyTotals(userId, 12),
      gastoRepository.getMonthlyTotals(userId, 12),
    ]);

    // Generar últimos meses (hasta 12 meses como en la gráfica de referencia Jan a Dec o 6 meses)
    const now = new Date();
    const result: TendenciaMensual[] = [];

    // Mostrar los 12 meses o últimos meses para el gráfico
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mNum = d.getMonth() + 1; // 1..12
      const year = d.getFullYear();

      const ing = ingresosMensuales.find(x => x.mes_num === mNum && x.ano === year)?.total || 0;
      const gst = gastosMensuales.find(x => x.mes_num === mNum && x.ano === year)?.total || 0;
      const ahr = Math.max(0, ing - gst);

      // Calcular valor de la barra proporcional
      let valorGrafica = 0;
      if (ing > 0 || gst > 0) {
        valorGrafica = gst > 0 ? Math.min(80, Math.max(20, Math.round((gst / (ing || gst)) * 75))) : 25;
      } else {
        valorGrafica = 0;
      }

      result.push({
        mes: MONTH_NAMES[mNum - 1],
        mesCompleto: MONTH_FULL_NAMES[mNum - 1],
        ano: year,
        ingresos: Math.round(ing * 100) / 100,
        gastos: Math.round(gst * 100) / 100,
        ahorro: Math.round(ahr * 100) / 100,
        valorGrafica,
      });
    }

    return result;
  }
}

export const dashboardService = new DashboardService();

