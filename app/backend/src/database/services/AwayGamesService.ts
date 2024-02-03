import { Infos, Merge } from '../../Interfaces/ILeaderBoard';
import { FormattedMatch } from '../../Interfaces/IMatches';
// import { Merge, Infos } from '../../Interfaces/ILeaderBoard';
import MatchesService from './MatchesService';

class AwayGamesService {
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

  async calculateAwayGames(teamName: string): Promise<number> {
    const awayWin = await this.getAwayWinners();
    const awayTies = await this.getAwayTies();
    const awayLosses = await this.getAwayLosses();
    const matches = [...awayWin, ...awayTies, ...awayLosses];
    const games = matches.filter((match) => match.teamName === teamName);
    return games.length;
  }

  async calculateAwayVictories(teamName: string): Promise<number> {
    const matches = await this.getAwayWinners();
    const victories = matches
      .filter((match) => (match.points === 3))
      .filter((match) => match.teamName === teamName);
    return victories.length;
  }

  async calculateAwayLosses(teamName: string): Promise<number> {
    const matches = await this.getAwayLosses();
    const teamLosses = matches.filter((match) => match.teamName === teamName);

    return teamLosses.length;
  }

  async calculateAwayTies(teamName: string): Promise<number> {
    const matches = await this.getAwayTies();
    const ties = matches.filter((match) => match.teamName === teamName);
    return ties.length;
  }

  // AWAYGAMES

  async getAwayWinners() {
    const matches = await this.getMatches();
    const awayWinners = matches
      .filter((match) => match.awayTeamGoals > match.homeTeamGoals)
      .map((match) => (
        {
          teamName: match.awayTeam.teamName,
          loser: match.homeTeam.teamName,
          goalsFavor: match.awayTeamGoals,
          goalsOwn: match.homeTeamGoals,
          points: 3,
        }
      ));

    return awayWinners;
  }

  async getAwayTies() {
    const matches = await this.getMatches();
    const awayTies = matches
      .filter((match) => match.awayTeamGoals === match.homeTeamGoals)
      .map((match) => ({
        matchId: match.id,
        teamName: match.awayTeam.teamName,
        goalsFavor: match.awayTeamGoals,
        goalsOwn: match.homeTeamGoals,
        points: 1,
      }));

    return awayTies;
  }

  async getAwayLosses() {
    const matches = await this.getMatches();
    const losses = matches.filter((match) => match.awayTeamGoals < match.homeTeamGoals)
      .map((match) => ({
        teamName: match.awayTeam.teamName,
        goalsFavor: match.awayTeamGoals,
        goalsOwn: match.homeTeamGoals,
        points: 0,
      }));
    return losses;
  }

  async allAwayGames() {
    const awayWin = await this.getAwayWinners();
    const awayTies = await this.getAwayTies();
    const awayLosses = await this.getAwayLosses();
    const total = [...awayWin, ...awayTies, ...awayLosses];
    return total;
  }

  // LEADERBOARD BUILDERS

  async infoReducer() {
    const infos = await this.allAwayGames();
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
      const totalGames = await this.calculateAwayGames(info.name);
      const totalVictories = await this.calculateAwayVictories(info.name);
      const totalDraws = await this.calculateAwayTies(info.name);
      const totalLosses = await this.calculateAwayLosses(info.name);
      const goalsBalance = AwayGamesService.getGoalsBalance(info.goalsFavor, info.goalsOwn);
      const efficiency = AwayGamesService.getEfficiency(info.totalPoints, totalGames);
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

export default AwayGamesService;
