import { LoginService } from '../services/login.js';
import { UserService } from '../services/user.js';
import { authRateLimiter } from '../middlewares/rate_limit_middleware.js';
import { validateBody, schemas } from '../middlewares/validation_middleware.js';

export function login(app) {
  app.post(
    '/login',
    authRateLimiter,
    validateBody(schemas.login),
    async (req, res) => res.send(await LoginService.login(req.body))
  );

  app.post(
    '/register',
    authRateLimiter,
    validateBody(schemas.register),
    async (req, res) => {
      const user = await UserService.create({
        ...req.body,
        roles: ['client'],
      });
      res.status(201).send({
        uuid: user.uuid,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        roles: user.roles,
      });
    }
  );
}