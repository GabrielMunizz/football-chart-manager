import { Router } from 'express';
import ValidateToken from '../../middlewares/validateToken';
import UserController from '../controllers/UserController';

class LoginRoute {
  private router: Router;
  private userController: UserController;

  constructor() {
    this.router = Router();
    this.userController = new UserController();
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.get(
      '/login/role',
      ValidateToken.validate,
      this.userController.getRole.bind(this.userController),
    );
    this.router.post(
      '/login',
      this.userController.validateUser.bind(this.userController),
    );
  }

  getRouter() {
    return this.router;
  }
}

export default LoginRoute;
