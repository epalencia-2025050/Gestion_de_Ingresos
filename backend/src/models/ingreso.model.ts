export interface IngresoEntity {
  id: number;
  usuario_id: number;
  monto: string | number;
  descripcion: string;
  fecha: string;
  categoria: string;
  estado: string;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
}

export interface Ingreso {
  id: number;
  usuarioId: number;
  monto: number;
  descripcion: string;
  fecha: string;
  categoria: string;
  estado: string;
  fechaCreacion?: Date;
}

export interface CreateIngresoDto {
  monto: number;
  descripcion: string;
  fecha: string;
  categoria?: string;
  estado?: string;
}

export interface UpdateIngresoDto {
  monto?: number;
  descripcion?: string;
  fecha?: string;
  categoria?: string;
  estado?: string;
}

export function toIngresoDto(entity: IngresoEntity): Ingreso {
  return {
    id: entity.id,
    usuarioId: entity.usuario_id,
    monto: Number(entity.monto),
    descripcion: entity.descripcion,
    fecha: entity.fecha ? (typeof entity.fecha === 'string' ? entity.fecha.split('T')[0] : (entity.fecha as any).toISOString().split('T')[0]) : '',
    categoria: entity.categoria,
    estado: entity.estado,
    fechaCreacion: entity.fecha_creacion,
  };
}
