import { Request, Response } from 'express';
import { ingresoService } from '../services/ingreso.service';

export class IngresoController {
  async list(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const search = req.query.search as string | undefined;
      const data = await ingresoService.getIngresos(userId, search);
      res.status(200).json({ data });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Error al obtener ingresos' });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const id = parseInt(req.params.id, 10);
      const data = await ingresoService.getIngresoById(id, userId);
      if (!data) {
        res.status(404).json({ message: 'Ingreso no encontrado' });
        return;
      }
      res.status(200).json({ data });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Error al obtener ingreso' });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { monto, descripcion, fecha, categoria, estado } = req.body;
      const data = await ingresoService.createIngreso(userId, {
        monto: Number(monto),
        descripcion,
        fecha,
        categoria,
        estado,
      });
      res.status(201).json({ message: 'Ingreso registrado exitosamente', data });
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Error al crear ingreso' });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const id = parseInt(req.params.id, 10);
      const { monto, descripcion, fecha, categoria, estado } = req.body;
      const data = await ingresoService.updateIngreso(id, userId, {
        monto: monto !== undefined ? Number(monto) : undefined,
        descripcion,
        fecha,
        categoria,
        estado,
      });
      res.status(200).json({ message: 'Ingreso actualizado exitosamente', data });
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Error al actualizar ingreso' });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const id = parseInt(req.params.id, 10);
      await ingresoService.deleteIngreso(id, userId);
      res.status(200).json({ message: 'Ingreso eliminado exitosamente' });
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Error al eliminar ingreso' });
    }
  }
}

export const ingresoController = new IngresoController();

