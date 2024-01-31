import { Router } from 'express';
import TeamController from '../controllers/TeamController';

class TeamRoute {
  private router: Router;
  private teamController: TeamController;

  constructor() {
    this.router = Router();
    this.teamController = new TeamController();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.get('/teams', this.teamController.getAllTeams.bind(this.teamController));
    this.router.get('/teams/:id', this.teamController.getTeam.bind(this.teamController));
  }

  getRouter() {
    return this.router;
  }
}

export default TeamRoute;
