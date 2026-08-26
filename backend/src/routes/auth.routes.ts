import { Router } from 'express';
import { body } from 'express-validator';
import { authController } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';

const router = Router();

router.post(
  '/login',
  validate([
    body('email').isEmail().withMessage('Debe ser un email valido').normalizeEmail(),
    body('password').isString().notEmpty().withMessage('La contrasena es requerida'),
  ]),
  authController.login,
);

router.post(
  '/register',
  validate([
    body('nombre').isString().trim().isLength({ min: 2 }).withMessage('Nombre invalido'),
    body('email').isEmail().withMessage('Debe ser un email valido').normalizeEmail(),
    body('password')
      .isString()
      .isLength({ min: 8 })
      .withMessage('La contrasena debe tener al menos 8 caracteres'),
  ]),
  authController.register,
);

router.get('/me', authMiddleware, authController.me);

router.get('/users', authMiddleware, roleMiddleware(['admin']), authController.listUsers);

export default router;
