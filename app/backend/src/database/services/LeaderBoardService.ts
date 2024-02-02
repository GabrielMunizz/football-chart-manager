import { FormattedMatch } from '../../Interfaces/IMatches';
import { Merge, Infos } from '../../Interfaces/ILeaderBoard';
import MatchesService from './MatchesService';

class LeaderBoardService {
  private matchesService: MatchesService;
  private matches: FormattedMatch[] = [];

  constructor() {
    this.matchesService = new MatchesService();
  }

  async getMatches(): Promise<FormattedMatch[]> {
    const response = await this.matchesService.matchesFilter('false');
    this.matches = response.data;
    return this.matches;
  }

  static getEfficiency(totalPoints: number, totalGames: number): number {
    const efficiency = ((totalPoints / (totalGames * 3)) * 100).toFixed(2);
    return Number(efficiency);
  }

  static getGoalsBalance(goalsFavor: number, goalsOwn: number): number {
    return goalsFavor - goalsOwn;
  }

  async calculateGames(teamName: string): Promise<number> {
    const matches = await this.allWinners();
    const games = matches.filter((match) => match.teamName === teamName);
    return games.length;
  }

  async calculateVictories(teamName: string): Promise<number> {
    const matches = await this.allWinners();
    const victories = matches
      .filter((match) => (match.teamName === teamName && match.points === 3));
    return victories.length;
  }

  async calculateLosses(teamName: string): Promise<number> {
    const matches = await this.allLosers();
    const losts = matches.filter((match) => match.teamName === teamName);
    return losts.length;
  }

  async calculateTies(teamName: string): Promise<number> {
    const matches = await this.allTies();
    const ties = matches.filter((match) => match.teamName === teamName);
    return ties.length;
  }

  async getHomeWinners() {
    const matches = await this.getMatches();
    const homeWinners = matches
      .filter((match) => match.homeTeamGoals > match.awayTeamGoals)
      .map((match) => (
        {
          teamName: match.homeTeam.teamName,
          goalsFavor: match.homeTeamGoals,
          goalsOwn: match.awayTeamGoals,
          points: 3,
        }
      ));

    return homeWinners;
  }

  async getHomeLosers() {
    const matches = await this.getMatches();
    const homelosers = matches
      .filter((match) => match.homeTeamGoals < match.awayTeamGoals)
      .map((match) => (
        {
          teamName: match.homeTeam.teamName,
        }
      ));
    return homelosers;
  }

  async getAwayWinners() {
    const matches = await this.getMatches();
    const awayWinners = matches
      .filter((match) => match.awayTeamGoals > match.homeTeamGoals)
      .map((match) => (
        {
          teamName: match.awayTeam.teamName,
          goalsFavor: match.awayTeamGoals,
          goalsOwn: match.homeTeamGoals,
          points: 3,
        }
      ));

    return awayWinners;
  }

  async getAwayLosers() {
    const matches = await this.getMatches();
    const awaylosers = matches
      .filter((match) => match.awayTeamGoals < match.homeTeamGoals)
      .map((match) => (
        {
          teamName: match.awayTeam.teamName,
        }
      ));
    return awaylosers;
  }

  async getHomeTies() {
    const matches = await this.getMatches();
    const homeTies = matches
      .filter((match) => match.awayTeamGoals === match.homeTeamGoals)
      .map((match) => ({
        teamName: match.homeTeam.teamName,
        goalsFavor: match.homeTeamGoals,
        goalsOwn: match.awayTeamGoals,
        points: 1,
      }));

    return homeTies;
  }

  async getAwayTies() {
    const matches = await this.getMatches();
    const awayTies = matches
      .filter((match) => match.awayTeamGoals === match.homeTeamGoals)
      .map((match) => ({
        teamName: match.awayTeam.teamName,
        goalsFavor: match.awayTeamGoals,
        goalsOwn: match.homeTeamGoals,
        points: 1,
      }));

    return awayTies;
  }

  async allWinners() {
    const home = await this.getHomeWinners();
    const away = await this.getAwayWinners();
    const homeTies = await this.getHomeTies();
    const awayTies = await this.getAwayTies();
    const allVictories = [...home, ...away, ...homeTies, ...awayTies];
    return allVictories;
  }

  async allLosers() {
    const homeLosers = await this.getHomeLosers();
    const awayLosers = await this.getAwayLosers();
    const allLosers = [...homeLosers, ...awayLosers];
    return allLosers;
  }

  async allTies() {
    const homeTies = await this.getHomeTies();
    const awayTies = await this.getAwayTies();
    const allTies = [...homeTies, ...awayTies];
    return allTies;
  }

  async infoReducer() {
    const infos = await this.allWinners();
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
      const totalGames = await this.calculateGames(info.name);
      const totalVictories = await this.calculateVictories(info.name);
      const totalDraws = await this.calculateTies(info.name);
      const totalLosses = await this.calculateLosses(info.name);
      const goalsBalance = LeaderBoardService.getGoalsBalance(info.goalsFavor, info.goalsOwn);
      const efficiency = LeaderBoardService.getEfficiency(info.totalPoints, totalGames);
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
}

export default LeaderBoardService;
