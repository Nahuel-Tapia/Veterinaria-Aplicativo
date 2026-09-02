import { addDependency } from './libs/dependencies.js';
import { UserService } from './services/user.js';
import { LoginService } from './services/login.js';
import { PetService } from './services/pet.js';
import { ServiceCatalogService } from './services/service.js';
import { AppointmentService } from './services/appointment.js';
import { MedicalRecordService } from './services/medical_record.js';

import UserModel from './models/user.js';
import PetModel from './models/pet.js';
import ServiceModel from './models/service.js';
import AppointmentModel from './models/appointment.js';
import MedicalRecordModel from './models/medical_record.js';

export default function configureDependencies() {
  // Services
  addDependency('UserService', UserService);
  addDependency('LoginService', LoginService);
  addDependency('PetService', PetService);
  addDependency('ServiceCatalogService', ServiceCatalogService);
  addDependency('AppointmentService', AppointmentService);
  addDependency('MedicalRecordService', MedicalRecordService);

  // Models
  addDependency('UserModel', UserModel);
  addDependency('PetModel', PetModel);
  addDependency('ServiceModel', ServiceModel);
  addDependency('AppointmentModel', AppointmentModel);
  addDependency('MedicalRecordModel', MedicalRecordModel);
}
