import { ingresoRepository } from '../repositories/ingreso.repository';
import { CreateIngresoDto, Ingreso, toIngresoDto, UpdateIngresoDto } from '../models/ingreso.model';

export class IngresoService {
  async getIngresos(userId: number, search?: string): Promise<Ingreso[]> {
    const rows = await ingresoRepository.findByUserId(userId, search);
    return rows.map(toIngresoDto);
  }

  async getIngresoById(id: number, userId: number): Promise<Ingreso | null> {
    const row = await ingresoRepository.findByIdAndUserId(id, userId);
    return row ? toIngresoDto(row) : null;
  }

  async createIngreso(userId: number, dto: CreateIngresoDto): Promise<Ingreso> {
    if (!dto.descripcion || dto.descripcion.trim() === '') {
      throw new Error('La descripción es requerida');
    }
    if (dto.monto === undefined || dto.monto <= 0) {
      throw new Error('El monto debe ser mayor a 0');
    }
    const created = await ingresoRepository.create(userId, dto);
    return toIngresoDto(created);
  }

  async updateIngreso(id: number, userId: number, dto: UpdateIngresoDto): Promise<Ingreso> {
    if (dto.monto !== undefined && dto.monto <= 0) {
      throw new Error('El monto debe ser mayor a 0');
    }
    const updated = await ingresoRepository.update(id, userId, dto);
    if (!updated) {
      throw new Error('Ingreso no encontrado o no tiene permisos');
    }
    return toIngresoDto(updated);
  }

  async deleteIngreso(id: number, userId: number): Promise<boolean> {
    const success = await ingresoRepository.delete(id, userId);
    if (!success) {
      throw new Error('Ingreso no encontrado o no tiene permisos');
    }
    return true;
  }
}

export const ingresoService = new IngresoService();

