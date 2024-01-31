import { ITeams } from '../../Interfaces/ITeams';
import TeamModel from '../models/TeamsModel';

class TeamService {
  private teams: ITeams[] = [];

  async getTeams(): Promise<ITeams[]> {
    this.teams = await TeamModel.findAll();
    return this.teams;
  }
}

export default TeamService;
