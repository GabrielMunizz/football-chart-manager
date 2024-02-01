import { IMatches } from '../../Interfaces/IMatches';
import MatchesModel from '../models/MatchesModel';
import TeamModel from '../models/TeamsModel';

class MatchesService {
  private matches: IMatches[] = [];

  async getMatches(): Promise<IMatches[]> {
    this.matches = await MatchesModel.findAll({
      include: [
        { model: TeamModel, as: 'homeTeam', attributes: ['teamName'], foreignKey: 'home_team_id' },
        { model: TeamModel, as: 'awayTeam', attributes: ['teamName'], foreignKey: 'away_team_id' },
      ],
      attributes: {
        exclude: ['home_team_id', 'away_team_id'],
      },
    });
    return this.matches;
  }
}

export default MatchesService;
