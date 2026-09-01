import { Role } from '../models/user.model';

/**
 * Extiende el tipo Request de Express para que TypeScript conozca
 * los campos que authMiddleware inyecta tras validar el JWT.
 * Evita el uso de "as any" en controllers y middlewares.
 */
declare global {
  namespace Express {
    interface Request {
      userId?: number;
      userEmail?: string;
      userRole?: Role;
    }
  }
}

export {};
