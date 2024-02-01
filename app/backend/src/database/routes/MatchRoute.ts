import { Router } from 'express';
import ValidateToken from '../../middlewares/validateToken';
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
    this.router.patch(
      '/matches/:id',
      ValidateToken.validate,
      MatchesController.updateInProgressMatch.bind(this.matchesController),
    );
    this.router.patch(
      '/matches/:id/finish',
      ValidateToken.validate,
      MatchesController.updateMatch.bind(this.matchesController),
    );
    this.router.post(
      '/matches',
      ValidateToken.validate,
      this.matchesController.createMatch.bind(this.matchesController),
    );
  }

  getRouter() {
    return this.router;
  }
}

export default MatchRoute;
