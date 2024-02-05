import { Router } from 'express';
import HomeGamesController from '../controllers/HomeGamesController';
import AwayGamesController from '../controllers/AwayGamesController';
import AllGamesController from '../controllers/AllGamesController';

class LeaderBoardRouter {
  private router: Router;
  private homeGamesController: HomeGamesController;
  private awayGamesController: AwayGamesController;
  private allGamesController: AllGamesController;

  constructor() {
    this.router = Router();
    this.allGamesController = new AllGamesController();
    this.homeGamesController = new HomeGamesController();
    this.awayGamesController = new AwayGamesController();
    this.setupRouter();
  }

  setupRouter() {
    this.router.get(
      '/home',
      this.homeGamesController.getLeaderBoard.bind(this.homeGamesController),
    );
    this.router.get(
      '/away',
      this.awayGamesController.getLeaderBoard.bind(this.awayGamesController),
    );
    this.router.get(
      '/',
      this.allGamesController.getAllLeaderboard.bind(this.allGamesController),
      // (req, res) => {
      //   this.allGamesController.getAllLeaderboard(req, res);
      // },
    );
  }

  getRouter() {
    return this.router;
  }
}

export default LeaderBoardRouter;
