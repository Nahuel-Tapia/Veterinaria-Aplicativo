import { login } from './login.js';
import { user } from './user.js';
import { pet } from './pet.js';
import { service } from './service.js';
import { appointment } from './appointment.js';
import { medicalRecord } from './medical_record.js';

export function controllers(app) {
  login(app);
  user(app);
  pet(app);
  service(app);
  appointment(app);
  medicalRecord(app);
}