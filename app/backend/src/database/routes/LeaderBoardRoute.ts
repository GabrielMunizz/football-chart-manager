import { Router } from 'express';
import HomeGamesController from '../controllers/HomeGamesController';

class LeaderBoardRouter {
  private router: Router;
  private homeGamesController: HomeGamesController;

  constructor() {
    this.router = Router();
    this.homeGamesController = new HomeGamesController();
    this.setupRouter();
  }

  setupRouter() {
    this.router.get(
      '/leaderboard/home',
      this.homeGamesController.getLeaderBoard.bind(this.homeGamesController),
    );
  }

  getRouter() {
    return this.router;
  }
}

export default LeaderBoardRouter;
