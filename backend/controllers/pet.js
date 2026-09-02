import { PetService } from '../services/pet.js';
import { UserService } from '../services/user.js';
import { ForbiddenException } from '../exceptions/forbidden_exception.js';
import { validateBody, schemas } from '../middlewares/validation_middleware.js';

export function pet(app) {
  app.get(
    '/pet',
    async (req, res) => {
      if (!req.session) {
        throw new ForbiddenException('No autenticado.');
      }

      const roles = req.session.roles || [];
      const isStaff = roles.includes('admin') || roles.includes('vet');
      
      let filter = {};
      if (!isStaff) {
        const currentUser = await UserService.getSingleOrNullByUsername(req.session.username);
        if (!currentUser) throw new ForbiddenException();
        filter.ownerUuid = currentUser.uuid;
      } else if (req.query.ownerUuid) {
        filter.ownerUuid = req.query.ownerUuid;
      }

      const pets = await PetService.get(filter);
      res.send(pets);
    }
  );

  app.get(
    '/pet/:uuid',
    async (req, res) => {
      if (!req.session) throw new ForbiddenException('No autenticado.');
      const pet = await PetService.getSingleOrNullByUuid(req.params.uuid);
      if (!pet) {
        return res.status(404).send({ message: 'Mascota no encontrada' });
      }

      const roles = req.session.roles || [];
      const isStaff = roles.includes('admin') || roles.includes('vet');
      if (!isStaff) {
        const currentUser = await UserService.getSingleOrNullByUsername(req.session.username);
        if (pet.ownerUuid !== currentUser?.uuid) {
          throw new ForbiddenException('Acceso no autorizado.');
        }
      }

      res.send(pet);
    }
  );

  app.post(
    '/pet',
    validateBody(schemas.pet),
    async (req, res) => {
      if (!req.session) throw new ForbiddenException('No autenticado.');

      const roles = req.session.roles || [];
      const isStaff = roles.includes('admin') || roles.includes('vet');
      const currentUser = await UserService.getSingleOrNullByUsername(req.session.username);

      const petData = { ...req.body };
      if (!isStaff || !petData.ownerUuid) {
        petData.ownerUuid = currentUser.uuid;
      }

      const newPet = await PetService.create(petData);
      res.status(201).send(newPet);
    }
  );

  app.patch(
    '/pet/:uuid',
    async (req, res) => {
      if (!req.session) throw new ForbiddenException('No autenticado.');
      const pet = await PetService.getSingleOrNullByUuid(req.params.uuid);
      if (!pet) {
        return res.status(404).send({ message: 'Mascota no encontrada' });
      }

      const roles = req.session.roles || [];
      const isStaff = roles.includes('admin') || roles.includes('vet');
      if (!isStaff) {
        const currentUser = await UserService.getSingleOrNullByUsername(req.session.username);
        if (pet.ownerUuid !== currentUser?.uuid) {
          throw new ForbiddenException('Acceso no autorizado.');
        }
      }

      const updated = await PetService.updateByUuid(req.params.uuid, req.body);
      res.send(updated);
    }
  );

  app.delete(
    '/pet/:uuid',
    async (req, res) => {
      if (!req.session) throw new ForbiddenException('No autenticado.');
      const pet = await PetService.getSingleOrNullByUuid(req.params.uuid);
      if (!pet) {
        return res.status(404).send({ message: 'Mascota no encontrada' });
      }

      const roles = req.session.roles || [];
      const isStaff = roles.includes('admin') || roles.includes('vet');
      if (!isStaff) {
        const currentUser = await UserService.getSingleOrNullByUsername(req.session.username);
        if (pet.ownerUuid !== currentUser?.uuid) {
          throw new ForbiddenException('Acceso no autorizado.');
        }
      }

      await PetService.deleteByUuid(req.params.uuid);
      res.status(204).send();
    }
  );
}
