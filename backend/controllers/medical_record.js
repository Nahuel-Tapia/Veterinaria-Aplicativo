import { MedicalRecordService } from '../services/medical_record.js';
import { PetService } from '../services/pet.js';
import { UserService } from '../services/user.js';
import { checkForRole } from '../middlewares/authorization_middleware.js';
import { ForbiddenException } from '../exceptions/forbidden_exception.js';
import { InvalidArgumentException } from '../exceptions/invalid_argument_exception.js';
import { validateBody, schemas } from '../middlewares/validation_middleware.js';

export function medicalRecord(app) {
  app.get(
    '/medical-record',
    async (req, res) => {
      if (!req.session) throw new ForbiddenException('No autenticado.');

      const roles = req.session.roles || [];
      const isStaff = roles.includes('admin') || roles.includes('vet');
      
      let filter = {};
      if (req.query.petUuid) {
        filter.petUuid = req.query.petUuid;
      }

      if (!isStaff) {
        if (!req.query.petUuid) {
          throw new InvalidArgumentException('Falta especificar la mascota (petUuid).');
        }
        const currentUser = await UserService.getSingleOrNullByUsername(req.session.username);
        const pet = await PetService.getSingleOrNullByUuid(req.query.petUuid);
        if (!pet || pet.ownerUuid !== currentUser?.uuid) {
          throw new ForbiddenException('Acceso no autorizado.');
        }
      }

      const records = await MedicalRecordService.get(filter);
      res.send(records);
    }
  );

  app.post(
    '/medical-record',
    validateBody(schemas.medicalRecord),
    async (req, res) => {
      if (!req.session) throw new ForbiddenException('No autenticado.');
      const roles = req.session.roles || [];
      if (!roles.includes('admin') && !roles.includes('vet')) {
        throw new ForbiddenException('Solo el personal médico puede registrar consultas.');
      }

      const currentUser = await UserService.getSingleOrNullByUsername(req.session.username);
      const data = {
        ...req.body,
        vetUuid: currentUser.uuid,
      };

      const newRecord = await MedicalRecordService.create(data);
      res.status(201).send(newRecord);
    }
  );

  app.patch(
    '/medical-record/:uuid',
    async (req, res) => {
      if (!req.session) throw new ForbiddenException('No autenticado.');
      const roles = req.session.roles || [];
      if (!roles.includes('admin') && !roles.includes('vet')) {
        throw new ForbiddenException('Solo el personal médico puede modificar consultas.');
      }

      const updated = await MedicalRecordService.updateByUuid(req.params.uuid, req.body);
      res.send(updated);
    }
  );

  app.delete(
    '/medical-record/:uuid',
    checkForRole('admin'),
    async (req, res) => {
      await MedicalRecordService.deleteByUuid(req.params.uuid);
      res.status(204).send();
    }
  );
}
