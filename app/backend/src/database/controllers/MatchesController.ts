import { Request, Response } from 'express';
import MatchesService from '../services/MatchesService';

class MatchesController {
  private matchesService: MatchesService;

  constructor() {
    this.matchesService = new MatchesService();
  }

  async getAllMatches(req: Request, res: Response) {
    const { query } = req;
    const { inProgress } = query;

    const { status, data } = await this.matchesService.matchesFilter(inProgress as string);

    return res.status(status).json(data);
  }

  static async updateMatch(req: Request, res: Response) {
    const { id } = req.params;
    const match = await MatchesService.finishMatch(Number(id));

    return res.status(match.status).json(match.data);
  }
}

export default MatchesController;
