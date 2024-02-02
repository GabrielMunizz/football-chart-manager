import { Request, Response } from 'express';
import LeaderBoardService from '../services/LeaderBoardService';

class LeaderBoardController {
  private leaderBoardService: LeaderBoardService;

  constructor() {
    this.leaderBoardService = new LeaderBoardService();
  }

  async getLeaderBoard(req: Request, res: Response) {
    const leaderBoard = await this.leaderBoardService.leaderBoardGenerator();

    return res.status(200).json(leaderBoard);
  }
}

export default LeaderBoardController;
