import 'dotenv/config';
import { createApp } from './app';
import { env } from './config/env';
import { checkDatabaseConnection } from './config/database';

async function bootstrap(): Promise<void> {
  try {
    await checkDatabaseConnection();

    const app = createApp();
    app.listen(env.port, () => {
      // eslint-disable-next-line no-console
      console.log(`🚀 Servidor escuchando en http://localhost:${env.port}`);
      // eslint-disable-next-line no-console
      console.log(`   Entorno: ${env.nodeEnv}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ No se pudo iniciar el servidor:', error);
    process.exit(1);
  }
}

bootstrap();
