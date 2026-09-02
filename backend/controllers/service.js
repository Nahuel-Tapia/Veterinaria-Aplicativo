import { ServiceCatalogService } from '../services/service.js';
import { checkForRole } from '../middlewares/authorization_middleware.js';
import { validateBody, schemas } from '../middlewares/validation_middleware.js';

export function service(app) {
  app.get(
    '/service',
    async (req, res) => {
      const roles = req.session?.roles || [];
      const isStaff = roles.includes('admin') || roles.includes('vet');
      
      let filter = {};
      if (!isStaff) {
        filter.active = true;
      }

      const services = await ServiceCatalogService.get(filter);
      res.send(services);
    }
  );

  app.get(
    '/service/:uuid',
    async (req, res) => {
      const service = await ServiceCatalogService.getSingleOrNullByUuid(req.params.uuid);
      if (!service) {
        return res.status(404).send({ message: 'Servicio no encontrado' });
      }
      res.send(service);
    }
  );

  app.post(
    '/service',
    checkForRole('admin'),
    validateBody(schemas.service),
    async (req, res) => {
      const newService = await ServiceCatalogService.create(req.body);
      res.status(201).send(newService);
    }
  );

  app.patch(
    '/service/:uuid',
    checkForRole('admin'),
    async (req, res) => {
      const updated = await ServiceCatalogService.updateByUuid(req.params.uuid, req.body);
      res.send(updated);
    }
  );

  app.delete(
    '/service/:uuid',
    checkForRole('admin'),
    async (req, res) => {
      await ServiceCatalogService.deleteByUuid(req.params.uuid);
      res.status(204).send();
    }
  );
}
