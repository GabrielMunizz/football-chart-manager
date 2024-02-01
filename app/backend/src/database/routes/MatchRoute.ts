import { Router } from 'express';
import MatchesController from '../controllers/MatchesController';

class MatchRoute {
  private router: Router;
  private matchesController: MatchesController;

  constructor() {
    this.router = Router();
    this.matchesController = new MatchesController();
    this.setupRoutes();
  }

  setupRoutes() {
    this.router.get('/matches', this.matchesController.getAllMatches.bind(this.matchesController));
    this.router.patch('/matches/:id/finish');
  }

  getRouter() {
    return this.router;
  }
}

export default MatchRoute;
