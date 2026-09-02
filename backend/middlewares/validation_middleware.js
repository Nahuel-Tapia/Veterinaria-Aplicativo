import { z } from 'zod';

export function validateBody(schema) {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        const issues = err.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ');
        return res.status(400).send({
          error: 'ValidationError',
          message: `Error de validación: ${issues}`,
        });
      }
      next(err);
    }
  };
}

export const schemas = {
  login: z.object({
    username: z.string().min(1, 'El nombre de usuario es obligatorio'),
    password: z.string().min(1, 'La contraseña es obligatoria'),
  }),

  register: z.object({
    username: z.string().min(3, 'El nombre de usuario debe tener al menos 3 caracteres'),
    password: z.string().min(4, 'La contraseña debe tener al menos 4 caracteres'),
    fullName: z.string().min(2, 'El nombre completo es obligatorio'),
    email: z.string().email('El correo electrónico no es válido'),
    phone: z.string().optional(),
    address: z.string().optional(),
    dni: z.string().optional(),
  }),

  pet: z.object({
    name: z.string().min(1, 'El nombre de la mascota es obligatorio'),
    species: z.string().min(1, 'La especie es obligatoria'),
    breed: z.string().optional(),
    birthDate: z.string().optional(),
    gender: z.string().optional(),
    weight: z.number().positive().optional(),
    neutered: z.boolean().optional(),
    microchip: z.string().optional(),
    photoUrl: z.string().optional(),
    notes: z.string().optional(),
    ownerUuid: z.string().optional(),
  }),

  appointment: z.object({
    petUuid: z.string().min(1, 'La mascota es obligatoria'),
    serviceUuid: z.string().min(1, 'El servicio es obligatorio'),
    date: z.string().min(1, 'La fecha y hora son obligatorias'),
    reason: z.string().optional(),
    clientUuid: z.string().optional(),
    vetUuid: z.string().optional(),
    status: z.enum(['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']).optional(),
  }),

  medicalRecord: z.object({
    petUuid: z.string().min(1, 'La mascota es obligatoria'),
    diagnosis: z.string().min(1, 'El diagnóstico es obligatorio'),
    reason: z.string().optional(),
    treatment: z.string().optional(),
    prescription: z.string().optional(),
    weight: z.number().positive().optional(),
    vaccinesApplied: z.array(z.string()).optional(),
    appointmentUuid: z.string().optional(),
    vetUuid: z.string().optional(),
  }),

  service: z.object({
    name: z.string().min(1, 'El nombre del servicio es obligatorio'),
    price: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
    description: z.string().optional(),
    durationMinutes: z.number().positive().optional(),
    active: z.boolean().optional(),
  }),
};
