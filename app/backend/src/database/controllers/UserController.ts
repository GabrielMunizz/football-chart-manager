import { Response, Request } from 'express';
import UserService from '../services/UserService';

class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async validateUser(req: Request, res: Response) {
    const { email, password } = req.body;
    const login = await this.userService.logUser({ email, password });

    return res.status(login.status).json(login.data);
  }
}

export default UserController;
