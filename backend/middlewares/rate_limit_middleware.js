import rateLimit from 'express-rate-limit';

// Limita intentos de login y registro para mitigar ataques de fuerza bruta
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 15, // Máximo 15 peticiones por ventana por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'TooManyRequests',
    message: 'Demasiados intentos desde esta IP. Por favor intente más tarde.',
  },
});
