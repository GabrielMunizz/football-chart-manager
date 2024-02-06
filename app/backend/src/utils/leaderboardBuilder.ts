import { CategoryType, Infos, Merge } from '../Interfaces/ILeaderBoard';
import { FormattedMatch } from '../Interfaces/IMatches';
import MatchesService from '../database/services/MatchesService';

class LeaderBoardBuilder {
  private matches: FormattedMatch[] = [];
  private matchesService: MatchesService;

  constructor() {
    this.matchesService = new MatchesService();
  }

  async getMatches(): Promise<FormattedMatch[]> {
    const response = await this.matchesService.matchesFilter('false');
    this.matches = response.data;
    return this.matches;
  }

  // CALCULATORS:

  static getEfficiency(totalPoints: number, totalGames: number): number {
    const efficiency = ((totalPoints / (totalGames * 3)) * 100).toFixed(2);
    return Number(efficiency);
  }

  static getGoalsBalance(goalsFavor: number, goalsOwn: number): number {
    return goalsFavor - goalsOwn;
  }

  async calculateGames(category: CategoryType | undefined, teamName: string): Promise<number> {
    if (category) {
      const matches = await this.allGamesByCategory(category);
      const games = matches.filter((match) => match.teamName === teamName);
      return games.length;
    }
    const matches = await this.allGames();
    const games = matches.filter((match) => match.teamName === teamName);
    return games.length;
  }

  async calculateVictories(category: CategoryType | undefined, teamName: string): Promise<number> {
    if (category) {
      const matches = await this.getWinners(category);
      const victories = matches
        .filter((match) => match.teamName === teamName);
      return victories.length;
    }
    const matches = await this.getAllWinners();
    const victories = matches.filter((match) => match.teamName === teamName);
    return victories.length;
  }

  async calculateLosses(category: CategoryType | undefined, teamName: string): Promise<number> {
    if (category) {
      const matches = await this.getLosses(category);
      const teamLosses = matches.filter((match) => match.teamName === teamName);
      return teamLosses.length;
    }
    const matches = await this.getAllLosers();
    const teamLosses = matches.filter((match) => match.teamName === teamName);
    return teamLosses.length;
  }

  async calculateTies(category: CategoryType | undefined, teamName: string): Promise<number> {
    if (category) {
      const matches = await this.getTies(category);
      const ties = matches.filter((match) => match.teamName === teamName);
      return ties.length;
    }
    const matches = await this.getAllTies();
    const ties = matches.filter((match) => match.teamName === teamName);
    return ties.length;
  }

  // FORMATTER

  static infoFormatter(category: CategoryType, match: FormattedMatch) {
    if (category !== 'away') {
      return {
        teamName: match.homeTeam.teamName,
        goalsFavor: match.homeTeamGoals,
        goalsOwn: match.awayTeamGoals,
      };
    }
    return {
      teamName: match.awayTeam.teamName,
      goalsFavor: match.awayTeamGoals,
      goalsOwn: match.homeTeamGoals,
    };
  }

  // WINNERS

  async getWinners(category: CategoryType) {
    await this.getMatches();
    if (category !== 'away') {
      const homeWinners = this.matches
        .filter((match) => match.homeTeamGoals > match.awayTeamGoals)
        .map((match) => {
          const winInfo = LeaderBoardBuilder.infoFormatter('home', match);
          return { ...winInfo, points: 3 };
        });
      return homeWinners;
    }
    const awayWinners = this.matches
      .filter((match) => match.awayTeamGoals > match.homeTeamGoals)
      .map((match) => {
        const winInfo = LeaderBoardBuilder.infoFormatter('away', match);
        return { ...winInfo, points: 3 };
      });
    return awayWinners;
  }

  async getAllWinners() {
    const homeWinners = await this.getWinners('home');
    const awayWinners = await this.getWinners('away');
    return [...homeWinners, ...awayWinners];
  }

  // LOSERS

  async getLosses(category: CategoryType) {
    const matches = await this.getMatches();
    if (category !== 'away') {
      const losses = matches.filter((match) => match.homeTeamGoals < match.awayTeamGoals)
        .map((match) => {
          const loserInfo = LeaderBoardBuilder.infoFormatter('home', match);
          return { ...loserInfo, points: 0 };
        });
      return losses;
    }
    const losses = matches.filter((match) => match.awayTeamGoals < match.homeTeamGoals)
      .map((match) => {
        const loserInfo = LeaderBoardBuilder.infoFormatter('away', match);
        return { ...loserInfo, points: 0 };
      });
    return losses;
  }

  async getAllLosers() {
    const homeLosers = await this.getLosses('home');
    const awayLosers = await this.getLosses('away');
    return [...homeLosers, ...awayLosers];
  }

  // TIES

  async getTies(category: CategoryType) {
    const matches = await this.getMatches();
    if (category !== 'away') {
      const homeTies = matches.filter((match) => match.homeTeamGoals === match.awayTeamGoals)
        .map((match) => {
          const tieInfo = LeaderBoardBuilder.infoFormatter('home', match);
          return { ...tieInfo, points: 1 };
        });
      return homeTies;
    }
    const awayTies = matches
      .filter((match) => match.awayTeamGoals === match.homeTeamGoals)
      .map((match) => {
        const tieInfo = LeaderBoardBuilder.infoFormatter('away', match);
        return { ...tieInfo, points: 1 };
      });

    return awayTies;
  }

  async getAllTies() {
    const homeTies = await this.getTies('home');
    const awayTies = await this.getTies('away');
    return [...homeTies, ...awayTies];
  }

  // ALL GAMES

  async allGamesByCategory(category: CategoryType) {
    const wins = await this.getWinners(category);
    const ties = await this.getTies(category);
    const losses = await this.getLosses(category);
    const total = [...wins, ...ties, ...losses];
    return total;
  }

  async allGames() {
    const home = await this.allGamesByCategory('home');
    const away = await this.allGamesByCategory('away');
    return [...home, ...away];
  }

  // BUILDERS

  static async infoReducer(infos: any[]) {
    const merge = infos.reduce((acc, current) => {
      const { teamName } = current;
      if (!acc[teamName]) {
        acc[teamName] = {
          name: teamName,
          goalsFavor: 0,
          goalsOwn: 0,
          totalPoints: 0,
        };
      }

      acc[teamName].goalsFavor += current.goalsFavor;
      acc[teamName].goalsOwn += current.goalsOwn;
      acc[teamName].totalPoints += current.points;

      return acc;
    }, {} as Merge);
    return Object.values(merge);
  }

  async getInfo(category: CategoryType | undefined) {
    if (category) {
      const infos = await this.allGamesByCategory(category);
      const merge = await LeaderBoardBuilder.infoReducer(infos);
      return merge as Infos[];
    }
    const infos = await this.allGames();
    const merge = await LeaderBoardBuilder.infoReducer(infos);
    return merge as Infos[];
  }
}

export default LeaderBoardBuilder;
