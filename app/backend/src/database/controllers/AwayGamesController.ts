import { Request, Response } from 'express';
import AwayGamesService from '../services/AwayGamesService';

class AwayGamesController {
  private awayGamesController: AwayGamesService;

  constructor() {
    this.awayGamesController = new AwayGamesService();
  }

  async getLeaderBoard(req: Request, res: Response) {
    const leaderBoard = await this.awayGamesController.sortTeams();

    return res.status(200).json(leaderBoard);
  }
}

export default AwayGamesController;
