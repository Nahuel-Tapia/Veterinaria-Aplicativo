import { AppointmentService } from '../services/appointment.js';
import { UserService } from '../services/user.js';
import { ForbiddenException } from '../exceptions/forbidden_exception.js';
import { validateBody, schemas } from '../middlewares/validation_middleware.js';

export function appointment(app) {
  app.get(
    '/appointment',
    async (req, res) => {
      if (!req.session) throw new ForbiddenException('No autenticado.');

      const roles = req.session.roles || [];
      const isStaff = roles.includes('admin') || roles.includes('vet');
      const currentUser = await UserService.getSingleOrNullByUsername(req.session.username);

      let filter = {};
      if (!isStaff) {
        filter.clientUuid = currentUser.uuid;
      } else {
        if (req.query.status) filter.status = req.query.status;
        if (req.query.vetUuid) filter.vetUuid = req.query.vetUuid;
        if (req.query.clientUuid) filter.clientUuid = req.query.clientUuid;
        if (req.query.petUuid) filter.petUuid = req.query.petUuid;
      }

      const appointments = await AppointmentService.get(filter);
      res.send(appointments);
    }
  );

  app.get(
    '/appointment/:uuid',
    async (req, res) => {
      if (!req.session) throw new ForbiddenException('No autenticado.');

      const item = await AppointmentService.getSingleOrNullByUuid(req.params.uuid);
      if (!item) {
        return res.status(404).send({ message: 'Turno no encontrado.' });
      }

      const roles = req.session.roles || [];
      const isStaff = roles.includes('admin') || roles.includes('vet');
      if (!isStaff) {
        const currentUser = await UserService.getSingleOrNullByUsername(req.session.username);
        if (item.clientUuid !== currentUser?.uuid) {
          throw new ForbiddenException('Acceso no autorizado.');
        }
      }

      res.send(item);
    }
  );

  app.post(
    '/appointment',
    validateBody(schemas.appointment),
    async (req, res) => {
      if (!req.session) throw new ForbiddenException('No autenticado.');

      const roles = req.session.roles || [];
      const isStaff = roles.includes('admin') || roles.includes('vet');
      const currentUser = await UserService.getSingleOrNullByUsername(req.session.username);

      const data = { ...req.body };
      if (!isStaff || !data.clientUuid) {
        data.clientUuid = currentUser.uuid;
      }

      const newAppointment = await AppointmentService.create(data);
      res.status(201).send(newAppointment);
    }
  );

  app.patch(
    '/appointment/:uuid',
    async (req, res) => {
      if (!req.session) throw new ForbiddenException('No autenticado.');

      const item = await AppointmentService.getSingleOrNullByUuid(req.params.uuid);
      if (!item) {
        return res.status(404).send({ message: 'Turno no encontrado.' });
      }

      const roles = req.session.roles || [];
      const isStaff = roles.includes('admin') || roles.includes('vet');
      if (!isStaff) {
        const currentUser = await UserService.getSingleOrNullByUsername(req.session.username);
        if (item.clientUuid !== currentUser?.uuid) {
          throw new ForbiddenException('Acceso no autorizado.');
        }
        if (req.body.status && req.body.status !== 'cancelled') {
          throw new ForbiddenException('Los clientes solo pueden cancelar turnos.');
        }
      }

      const updated = await AppointmentService.updateByUuid(req.params.uuid, req.body);
      res.send(updated);
    }
  );

  app.delete(
    '/appointment/:uuid',
    async (req, res) => {
      if (!req.session) throw new ForbiddenException('No autenticado.');

      const item = await AppointmentService.getSingleOrNullByUuid(req.params.uuid);
      if (!item) {
        return res.status(404).send({ message: 'Turno no encontrado.' });
      }

      const roles = req.session.roles || [];
      const isStaff = roles.includes('admin') || roles.includes('vet');
      if (!isStaff) {
        const currentUser = await UserService.getSingleOrNullByUsername(req.session.username);
        if (item.clientUuid !== currentUser?.uuid) {
          throw new ForbiddenException('Acceso no autorizado.');
        }
      }

      await AppointmentService.deleteByUuid(req.params.uuid);
      res.status(204).send();
    }
  );
}
