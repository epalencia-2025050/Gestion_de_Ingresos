import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Rutas protegidas por JWT
router.use(authMiddleware);

router.get('/resumen', dashboardController.getResumen);
router.get('/categorias', dashboardController.getCategorias);
router.get('/tendencia', dashboardController.getTendencia);

export default router;

