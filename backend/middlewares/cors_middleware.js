import cors from 'cors';

export const corsMiddleware = cors({
  origin: '*', // Permite todos los orígenes en desarrollo
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: false
});