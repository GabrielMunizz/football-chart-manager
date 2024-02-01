import { Request, Response } from 'express';
import MatchesService from '../services/MatchesService';

class MatchesController {
  private matchesService: MatchesService;

  constructor() {
    this.matchesService = new MatchesService();
  }

  async getAllMatches(_req: Request, res: Response) {
    const matches = await this.matchesService.getMatches();

    return res.status(200).json(matches);
  }
}

export default MatchesController;
