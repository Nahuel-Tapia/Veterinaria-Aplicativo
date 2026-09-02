let configLocal = {};
try {
  const local = await import('./config.local.js');
  configLocal = local.default || {};
} catch (_) {
  // En producción (Vercel) config.local.js no existe y se usan variables de entorno (process.env)
}

const config = {
  port: process.env.PORT || configLocal.port || 3000,
  dbConnection: process.env.dbConnection || configLocal.dbConnection,
  jwtKey: process.env.jwtKey || configLocal.jwtKey,
  cors: process.env.cors !== undefined ? process.env.cors : (configLocal.cors ?? true),
};

export default config;