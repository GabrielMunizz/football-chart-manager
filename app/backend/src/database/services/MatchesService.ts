import { IMatches, UpdateScore, FormattedMatch } from '../../Interfaces/IMatches';
import MatchesModel from '../models/MatchesModel';
import TeamModel from '../models/TeamsModel';
import TeamService from './TeamService';

class MatchesService {
  private matches: IMatches[] = [];
  private teamService: TeamService;

  constructor() {
    this.teamService = new TeamService();
  }

  async getMatches(): Promise<FormattedMatch[]> {
    this.matches = await MatchesModel.findAll({
      include: [
        { model: TeamModel, as: 'homeTeam', attributes: ['teamName'], foreignKey: 'home_team_id' },
        { model: TeamModel, as: 'awayTeam', attributes: ['teamName'], foreignKey: 'away_team_id' },
      ],
      attributes: {
        exclude: ['home_team_id', 'away_team_id'],
      },
    });
    return this.matches as FormattedMatch[];
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

  async insertMatch(matchInfo: Omit<IMatches, 'id' | 'inProgress'>) {
    const invalidMatchInfo = await this.validateMatchInfo(matchInfo);
    if (invalidMatchInfo) {
      const { status, data } = invalidMatchInfo;
      return { status, data };
    }
    const newMatch = { ...matchInfo, inProgress: true };
    const insertedMatch = await MatchesModel.create(newMatch);

    return {
      status: 201,
      data: insertedMatch,
    };
  }

  async validateMatchInfo(matchInfo: Omit<IMatches, 'id' | 'inProgress'>) {
    const { homeTeamId, awayTeamId } = matchInfo;
    if (awayTeamId === homeTeamId) {
      return {
        status: 422,
        data: {
          message: 'It is not possible to create a match with two equal teams',
        },
      };
    }

    const findHomeTeam = await this.teamService.getTeamByID(homeTeamId);
    const findAwayTeam = await this.teamService.getTeamByID(awayTeamId);

    if (!findHomeTeam || !findAwayTeam) {
      return {
        status: 404,
        data: { message: 'There is no team with such id!' },
      };
    }

    return false;
  }
}

export default MatchesService;
