import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';

export function validate(rules: ValidationChain[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(rules.map((rule) => rule.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({
        message: 'Error de validacion',
        errors: errors.array().map((e) => ({
          campo: 'path' in e ? (e as any).path : undefined,
          mensaje: e.msg,
        })),
      });
      return;
    }
    next();
  };
}
