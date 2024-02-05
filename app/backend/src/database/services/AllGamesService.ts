import { Merge, Infos } from '../../Interfaces/ILeaderBoard';
import AwayGamesService from './AwayGamesService';
import HomeGamesService from './HomeGamesService';

class AllGamesService {
  private homeGamesServices: HomeGamesService;
  private awayGamesServices: AwayGamesService;

  constructor() {
    this.homeGamesServices = new HomeGamesService();
    this.awayGamesServices = new AwayGamesService();
  }

  // CALCULATORS

  static getEfficiency(totalPoints: number, totalGames: number): number {
    const efficiency = ((totalPoints / (totalGames * 3)) * 100).toFixed(2);
    return Number(efficiency);
  }

  static getGoalsBalance(goalsFavor: number, goalsOwn: number): number {
    return goalsFavor - goalsOwn;
  }

  async calculateAllGames(teamName: string): Promise<number> {
    const awayWin = await this.getAllWinners();
    const awayTies = await this.getAllTies();
    const awayLosses = await this.getAllLosers();
    const matches = [...awayWin, ...awayTies, ...awayLosses];
    const games = matches.filter((match) => match.teamName === teamName);
    return games.length;
  }

  async calculateAllVictories(teamName: string): Promise<number> {
    const matches = await this.getAllWinners();
    const victories = matches
      .filter((match) => (match.points === 3))
      .filter((match) => match.teamName === teamName);
    return victories.length;
  }

  async calculateAllLosses(teamName: string): Promise<number> {
    const matches = await this.getAllLosers();
    const teamLosses = matches.filter((match) => match.teamName === teamName);

    return teamLosses.length;
  }

  async calculateAllTies(teamName: string): Promise<number> {
    const matches = await this.getAllTies();
    const ties = matches.filter((match) => match.teamName === teamName);
    return ties.length;
  }

  // ALLGAMES

  async getAllWinners() {
    const homeWinners = await this.homeGamesServices.getHomeWinners();
    const awayWinners = await this.awayGamesServices.getAwayWinners();
    return [...homeWinners, ...awayWinners];
  }

  async getAllLosers() {
    const homeLosers = await this.homeGamesServices.getHomeLosses();
    const awayLosers = await this.awayGamesServices.getAwayLosses();

    return [...homeLosers, ...awayLosers];
  }

  async getAllTies() {
    const homeTies = await this.homeGamesServices.getHomeTies();
    const awayTies = await this.awayGamesServices.getAwayTies();

    return [...homeTies, ...awayTies];
  }

  async allGames() {
    const allWin = await this.getAllWinners();
    const allTies = await this.getAllTies();
    const allLosses = await this.getAllLosers();
    const total = [...allWin, ...allTies, ...allLosses];
    return total;
  }

  // LEADERBOARD BUILDERS

  async infoReducer() {
    const infos = await this.allGames();
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
      const totalGames = await this.calculateAllGames(info.name);
      const totalVictories = await this.calculateAllVictories(info.name);
      const totalDraws = await this.calculateAllTies(info.name);
      const totalLosses = await this.calculateAllLosses(info.name);
      const goalsBalance = AllGamesService.getGoalsBalance(info.goalsFavor, info.goalsOwn);
      const efficiency = AllGamesService.getEfficiency(info.totalPoints, totalGames);
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

export default AllGamesService;
