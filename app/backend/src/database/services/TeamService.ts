import { ITeams } from '../../Interfaces/ITeams';
import TeamModel from '../models/TeamsModel';

class TeamService {
  private teams: ITeams[] = [];
  private teamById: ITeams | null = null;

  async getTeams(): Promise<ITeams[]> {
    this.teams = await TeamModel.findAll();
    return this.teams;
  }

  async getTeamByID(id: number): Promise<ITeams | null> {
    this.teamById = await TeamModel.findByPk(id);
    return this.teamById;
  }
}

export default TeamService;
