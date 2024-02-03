import { Router } from 'express';
import HomeGamesController from '../controllers/HomeGamesController';
import AwayGamesController from '../controllers/AwayGamesController';

class LeaderBoardRouter {
  private router: Router;
  private homeGamesController: HomeGamesController;
  private awayGamesController: AwayGamesController;

  constructor() {
    this.router = Router();
    this.homeGamesController = new HomeGamesController();
    this.awayGamesController = new AwayGamesController();
    this.setupRouter();
  }

  setupRouter() {
    this.router.get(
      '/leaderboard/home',
      this.homeGamesController.getLeaderBoard.bind(this.homeGamesController),
    );
    this.router.get(
      '/leaderboard/away',
      this.awayGamesController.getLeaderBoard.bind(this.awayGamesController),
    );
  }

  getRouter() {
    return this.router;
  }
}

export default LeaderBoardRouter;
