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

  async matchesFilter(query: string | undefined) {
    const matches = await this.getMatches();
    if (query === 'true') {
      const inProgress = matches.filter((match) => match.inProgress === true);
      return { status: 200, data: inProgress };
    }
    if (query === 'false') {
      const finished = matches.filter((match) => match.inProgress === false);
      return { status: 200, data: finished };
    }
    return { status: 200, data: matches };
  }
}

export default MatchesService;
