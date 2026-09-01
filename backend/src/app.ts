import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import routes from './routes/index.routes';
import { errorMiddleware, notFoundMiddleware } from './middlewares/error.middleware';

export function createApp(): Application {
  const app = express();

  // Seguridad de cabeceras HTTP
  app.use(helmet());

  // CORS: solo permite peticiones desde el origen configurado (Angular)
  app.use(
    cors({
      origin: env.corsOrigin,
      credentials: true,
    }),
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Todas las rutas de la API viven bajo /api
  app.use('/api', routes);

  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}
