import { IMatches, UpdateScore } from '../../Interfaces/IMatches';
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

  static async finishMatch(id: number) {
    const finishedMatch = { inProgress: false };
    const rowCount = await MatchesModel.update(finishedMatch, {
      where: { id },
    });
    if (rowCount[0] === 0) {
      return { status: 404, data: { message: 'Match not found' } };
    }
    return { status: 200, data: { message: 'Finished' } };
  }

  static async updateMatchScore(id: number, score: UpdateScore) {
    const rowCount = await MatchesModel.update(score, {
      where: { id },
    });
    if (rowCount[0] === 0) {
      return { status: 404, data: { message: 'Match not found' } };
    }
    return { status: 200, data: { message: `Match id: ${id} score updated!` } };
  }

  static async insertMatch(matchInfo: Omit<IMatches, 'id' | 'inProgress'>) {
    const newMatch = { ...matchInfo, inProgress: true };
    const insertedMatch = await MatchesModel.create(newMatch);

    return {
      status: 201,
      data: insertedMatch,
    };
  }
}

export default MatchesService;
