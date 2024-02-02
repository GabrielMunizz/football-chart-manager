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
      '/leaderboard/home',
      this.leaderBoardController.getLeaderBoard.bind(this.leaderBoardController),
    );
  }

  getRouter() {
    return this.router;
  }
}

export default LeaderBoardRouter;
