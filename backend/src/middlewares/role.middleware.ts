import { Request, Response, NextFunction } from 'express';
import { Role } from '../models/user.model';

export function roleMiddleware(allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userRole = req.userRole;

    if (!userRole) {
      res.status(401).json({ message: 'No autenticado' });
      return;
    }

    if (!allowedRoles.includes(userRole)) {
      res.status(403).json({ message: 'No tienes permisos para acceder a este recurso' });
      return;
    }

    next();
  };
}
