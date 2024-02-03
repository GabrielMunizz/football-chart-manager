import { FormattedMatch } from '../../Interfaces/IMatches';
import { Merge, Infos } from '../../Interfaces/ILeaderBoard';
import MatchesService from './MatchesService';

class HomeGamesService {
  private matchesService: MatchesService;
  private matches: FormattedMatch[] = [];

  constructor() {
    this.matchesService = new MatchesService();
  }

  // FINISHED MATCHES

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

  async calculateHomeGames(teamName: string): Promise<number> {
    const homeMatches = await this.getHomeWinners();
    const homeTies = await this.getHomeTies();
    const homeLosses = await this.getHomeLosses();
    const matches = [...homeMatches, ...homeTies, ...homeLosses];
    const games = matches.filter((match) => match.teamName === teamName);
    return games.length;
  }

  async calculateHomeVictories(teamName: string): Promise<number> {
    const matches = await this.getHomeWinners();
    const victories = matches
      .filter((match) => (match.points === 3))
      .filter((match) => match.teamName === teamName);
    return victories.length;
  }

  async calculateHomeLosses(teamName: string): Promise<number> {
    const matches = await this.getHomeLosses();
    const teamLosses = matches.filter((match) => match.teamName === teamName);

    return teamLosses.length;
  }

  async calculateHomeTies(teamName: string): Promise<number> {
    const matches = await this.getHomeTies();
    const ties = matches.filter((match) => match.teamName === teamName);
    return ties.length;
  }

  // HOMEGAMES

  async getHomeWinners() {
    const matches = await this.getMatches();
    const homeWinners = matches
      .filter((match) => match.homeTeamGoals > match.awayTeamGoals)
      .map((match) => (
        {
          teamName: match.homeTeam.teamName,
          loser: match.awayTeam.teamName,
          goalsFavor: match.homeTeamGoals,
          goalsOwn: match.awayTeamGoals,
          points: 3,
        }
      ));

    return homeWinners;
  }

  async getHomeTies() {
    const matches = await this.getMatches();
    const homeTies = matches
      .filter((match) => match.homeTeamGoals === match.awayTeamGoals)
      .map((match) => ({
        matchId: match.id,
        teamName: match.homeTeam.teamName,
        goalsFavor: match.homeTeamGoals,
        goalsOwn: match.awayTeamGoals,
        points: 1,
      }));

    return homeTies;
  }

  async getHomeLosses() {
    const matches = await this.getMatches();
    const losses = matches.filter((match) => match.homeTeamGoals < match.awayTeamGoals)
      .map((match) => ({
        teamName: match.homeTeam.teamName,
        goalsFavor: match.homeTeamGoals,
        goalsOwn: match.awayTeamGoals,
        points: 0,
      }));
    return losses;
  }

  async allHomeGames() {
    const home = await this.getHomeWinners();
    const homeTies = await this.getHomeTies();
    const homeLosses = await this.getHomeLosses();
    const total = [...home, ...homeTies, ...homeLosses];
    return total;
  }

  // LEADERBOARD BUILDERS

  async infoReducer() {
    const infos = await this.allHomeGames();
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

  async leaderBoardPromiseBuilder(infos: Infos[]) {
    const leaderBoardPromise = infos.map(async (info) => {
      const totalGames = await this.calculateHomeGames(info.name);
      const totalVictories = await this.calculateHomeVictories(info.name);
      const totalDraws = await this.calculateHomeTies(info.name);
      const totalLosses = await this.calculateHomeLosses(info.name);
      const goalsBalance = HomeGamesService.getGoalsBalance(info.goalsFavor, info.goalsOwn);
      const efficiency = HomeGamesService.getEfficiency(info.totalPoints, totalGames);
      return {
        ...info,
        totalGames,
        totalVictories,
        totalDraws,
        totalLosses,
        goalsBalance,
        efficiency,
      };
    });
    return leaderBoardPromise;
  }

  async leaderBoardGenerator() {
    const infos = await this.infoReducer();
    const leaderBoard = await this.leaderBoardPromiseBuilder(infos);
    const finalLeaderBoard = Promise.all(leaderBoard);
    return finalLeaderBoard;
  }

  // SORTER

  async sortTeams() {
    const teams = await this.leaderBoardGenerator();
    const sortedTeams = teams.sort((a, b) => {
      if (b.totalPoints !== a.totalPoints) {
        return b.totalPoints - a.totalPoints;
      }

      if (b.totalVictories !== a.totalVictories) {
        return b.totalVictories - a.totalVictories;
      }

      if (b.goalsBalance !== a.goalsBalance) {
        return b.goalsBalance - a.goalsBalance;
      }

      return b.goalsFavor - a.goalsFavor;
    });
    return sortedTeams;
  }
}

export default HomeGamesService;
