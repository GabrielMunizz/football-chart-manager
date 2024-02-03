import { Request, Response } from 'express';
import HomeGamesService from '../services/HomeGamesService';

class HomeGamesController {
  private homeGamesService: HomeGamesService;

  constructor() {
    this.homeGamesService = new HomeGamesService();
  }

  async getLeaderBoard(req: Request, res: Response) {
    const leaderBoard = await this.homeGamesService.sortTeams();

    return res.status(200).json(leaderBoard);
  }
}

export default HomeGamesController;
