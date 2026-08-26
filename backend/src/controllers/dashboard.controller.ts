import { Request, Response } from 'express';
import { dashboardService } from '../services/dashboard.service';

export class DashboardController {
  async getResumen(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const data = await dashboardService.getResumen(userId);
      res.status(200).json({ data });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Error al obtener resumen de finanzas' });
    }
  }

  async getCategorias(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const data = await dashboardService.getCategorias(userId);
      res.status(200).json({ data });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Error al obtener categorías' });
    }
  }

  async getTendencia(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const months = req.query.months ? parseInt(req.query.months as string, 10) : 6;
      const data = await dashboardService.getTendencia(userId, months);
      res.status(200).json({ data });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Error al obtener tendencia mensual' });
    }
  }
}

export const dashboardController = new DashboardController();

