import { UserService } from '../services/user.js';
import { checkForRole } from '../middlewares/authorization_middleware.js';
import { ForbiddenException } from '../exceptions/forbidden_exception.js';

export function user(app) {
  // Obtener perfil del usuario autenticado
  app.get(
    '/user/me',
    async (req, res) => {
      if (!req.session?.username) {
        throw new ForbiddenException('No autenticado.');
      }
      const user = await UserService.getSingleOrNullByUsername(req.session.username);
      if (!user) {
        throw new ForbiddenException('Usuario no encontrado.');
      }
      res.send({
        uuid: user.uuid,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        dni: user.dni,
        roles: user.roles,
      });
    }
  );

  // Listar usuarios (Admin o Vet)
  app.get(
    '/user',
    async (req, res) => {
      if (!req.session?.roles?.some(r => ['admin', 'vet'].includes(r))) {
        throw new ForbiddenException();
      }
      const query = req.query || {};
      const users = await UserService.get(query);
      const result = users.map(u => ({
        uuid: u.uuid,
        username: u.username,
        fullName: u.fullName,
        email: u.email,
        phone: u.phone,
        address: u.address,
        dni: u.dni,
        roles: u.roles,
      }));
    
      res.send(result);
    }
  );

  // Crear usuario desde el panel (Admin)
  app.post(
    '/user',
    checkForRole('admin'),
    async (req, res) => {
      const newUser = await UserService.create(req.body);
      res.status(201).send({
        uuid: newUser.uuid,
        username: newUser.username,
        fullName: newUser.fullName,
        email: newUser.email,
        roles: newUser.roles,
      });
    } 
  );

  // Eliminar usuario (Admin)
  app.delete(
    '/user/:uuid',
    checkForRole('admin'),
    async (req, res) => {
      await UserService.deleteByUuid(req.params.uuid);
      res.status(204).send();
    }
  );

  // Actualizar usuario (Admin o el propio usuario)
  app.patch(
    '/user/:uuid',
    async (req, res) => {
      const isSelf = req.session?.userId && req.session.userId === req.params.uuid;
      const isAdmin = req.session?.roles?.includes('admin');
      
      if (!isSelf && !isAdmin) {
        throw new ForbiddenException();
      }

      await UserService.updateByUuid(req.params.uuid, req.body);
      res.status(204).send();
    }
  );
}