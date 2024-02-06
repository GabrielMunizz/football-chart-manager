import { Request, Response } from 'express';
import LeaderBoardService from '../services/LeaderBoardService';

class LeaderBoardController {
  private leaderBoardService: LeaderBoardService;

  constructor() {
    this.leaderBoardService = new LeaderBoardService();
  }

  async getHomeLeaderBoard(_req: Request, res: Response) {
    const leaderBoard = await this.leaderBoardService.sortTeams('home');
    return res.status(200).json(leaderBoard);
  }

  async getAwayLeaderBoard(_req: Request, res: Response) {
    const leaderBoard = await this.leaderBoardService.sortTeams('away');
    return res.status(200).json(leaderBoard);
  }

  async getLeaderBoard(_req: Request, res: Response) {
    const leaderBoard = await this.leaderBoardService.sortAll();
    return res.status(200).json(leaderBoard);
  }
}

export default LeaderBoardController;
