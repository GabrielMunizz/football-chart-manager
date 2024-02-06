import { CategoryType, ILeaderBoard, Infos } from '../../Interfaces/ILeaderBoard';
import LeaderBoardBuilder from '../../utils/leaderboardBuilder';

class LeaderBoardService {
  private builder: LeaderBoardBuilder;

  constructor() {
    this.builder = new LeaderBoardBuilder();
  }

  async sortTeams(category: CategoryType) {
    const teams = await this.leaderBoardGenerator(category);
    const sortedTeams = LeaderBoardService.sort(teams);
    return sortedTeams;
  }

  async sortAll() {
    const teams = await this.leaderBoardGenerator(undefined);
    const sortedTeams = LeaderBoardService.sort(teams);
    return sortedTeams;
  }

  async calculate(category: CategoryType | undefined, info: Infos) {
    if (category) {
      const totalGames = await this.builder.calculateGames(category, info.name);
      const totalVictories = await this.builder.calculateVictories(category, info.name);
      const totalDraws = await this.builder.calculateTies(category, info.name);
      const totalLosses = await this.builder.calculateLosses(category, info.name);
      return { totalGames, totalVictories, totalDraws, totalLosses };
    }
    const totalGames = await this.builder.calculateGames(undefined, info.name);
    const totalVictories = await this.builder.calculateVictories(undefined, info.name);
    const totalDraws = await this.builder.calculateTies(undefined, info.name);
    const totalLosses = await this.builder.calculateLosses(undefined, info.name);
    return { totalGames, totalVictories, totalDraws, totalLosses };
  }

  async leaderBoardPromiseBuilder(category: CategoryType | undefined, infos: Infos[]) {
    if (category) {
      const leaderBoardPromise = infos.map(async (info) => {
        const calculate = await this.calculate(category, info);
        const goalsBalance = LeaderBoardBuilder.getGoalsBalance(info.goalsFavor, info.goalsOwn);
        const efficiency = LeaderBoardBuilder.getEfficiency(info.totalPoints, calculate.totalGames);
        return { ...info, ...calculate, goalsBalance, efficiency };
      });
      return leaderBoardPromise;
    }
    const leaderBoardPromise = infos.map(async (info) => {
      const calculate = await this.calculate(undefined, info);
      const goalsBalance = LeaderBoardBuilder.getGoalsBalance(info.goalsFavor, info.goalsOwn);
      const efficiency = LeaderBoardBuilder.getEfficiency(info.totalPoints, calculate.totalGames);
      return { ...info, ...calculate, goalsBalance, efficiency };
    });
    return leaderBoardPromise;
  }

  async leaderBoardGenerator(category: CategoryType | undefined) {
    if (category) {
      const infos = await this.builder.getInfo(category);
      const leaderBoard = await this.leaderBoardPromiseBuilder(category, infos);
      const finalLeaderBoard = Promise.all(leaderBoard);
      return finalLeaderBoard;
    }
    const infos = await this.builder.getInfo(undefined);
    const leaderBoard = await this.leaderBoardPromiseBuilder(undefined, infos);
    const finalLeaderBoard = Promise.all(leaderBoard);
    return finalLeaderBoard;
  }

  // SORTER

  static async sort(teams: ILeaderBoard[]) {
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

export default LeaderBoardService;
