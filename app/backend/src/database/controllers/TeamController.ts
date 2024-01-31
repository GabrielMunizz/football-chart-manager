import { Response, Request } from 'express';
import TeamService from '../services/TeamService';

class TeamController {
  private teamService: TeamService;

  constructor() {
    this.teamService = new TeamService();
  }

  async getAllTeams(_req: Request, res: Response) {
    const teams = await this.teamService.getTeams();

    return res.status(200).json(teams);
  }

  async getTeam(req: Request, res: Response) {
    const { id } = req.params;
    const team = await this.teamService.getTeamByID(Number(id));

    return res.status(200).json(team);
  }
}

export default TeamController;
