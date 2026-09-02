import express from 'express';
import config from './config.js';
import mongoose from 'mongoose';
import configureDependencies from './configure_dependencies.js';
import configureMiddlewares from './middlewares/configure_middlewares.js';

if (config.dbConnection) {
  mongoose.connect(config.dbConnection)
    .then(() => console.log('Conexión exitosa a MongoDB'))
    .catch(error => console.error('Error al conectar a MongoDB:', error));
}

const app = express();
const router = express.Router();
app.use('/api', router);

configureMiddlewares(router);
configureDependencies();

// En entornos locales se inicia app.listen, en Vercel Serverless se exporta app
if (process.env.VERCEL !== '1') {
  app.listen(
    config.port,
    () => {
      console.log(`Servidor corriendo en http://localhost:${config.port}`);
    }
  );
}

export default app;
