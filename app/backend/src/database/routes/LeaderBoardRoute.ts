import { Router } from 'express';
import LeaderBoardController from '../controllers/LeaderBoardController';

class LeaderBoardRouter {
  private router: Router;
  private leaderBoardController: LeaderBoardController;

  constructor() {
    this.router = Router();
    this.leaderBoardController = new LeaderBoardController();

    this.setupRouter();
  }

  setupRouter() {
    this.router.get(
      '/home',
      this.leaderBoardController.getHomeLeaderBoard.bind(this.leaderBoardController),
    );
    this.router.get(
      '/away',
      this.leaderBoardController.getAwayLeaderBoard.bind(this.leaderBoardController),
    );
    this.router.get(
      '/',
      this.leaderBoardController.getLeaderBoard.bind(this.leaderBoardController),
    );
  }

  getRouter() {
    return this.router;
  }
}

export default LeaderBoardRouter;
