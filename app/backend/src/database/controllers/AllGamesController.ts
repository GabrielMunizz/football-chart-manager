import { Request, Response } from 'express';
import AllGamesService from '../services/AllGamesService';

class AllGamesController {
  private allGamesService: AllGamesService;

  constructor() {
    this.allGamesService = new AllGamesService();
  }

  async getAllLeaderboard(req:Request, res: Response) {
    const leaderBoard = await this.allGamesService.sortTeams();
    return res.status(200).json(leaderBoard);
  }
}

export default AllGamesController;
