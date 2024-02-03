// import { FormattedMatch } from '../../Interfaces/IMatches';
// // import { Merge, Infos } from '../../Interfaces/ILeaderBoard';
// import MatchesService from './MatchesService';

// class AwayGamesService {
//   private matchesService: MatchesService;
//   private matches: FormattedMatch[] = [];

//   constructor() {
//     this.matchesService = new MatchesService();
//   }

//   async getMatches(): Promise<FormattedMatch[]> {
//     const response = await this.matchesService.matchesFilter('false');
//     this.matches = response.data;
//     return this.matches;
//   }

//   static getEfficiency(totalPoints: number, totalGames: number): number {
//     const efficiency = ((totalPoints / (totalGames * 3)) * 100).toFixed(2);
//     return Number(efficiency);
//   }

//   static getGoalsBalance(goalsFavor: number, goalsOwn: number): number {
//     return goalsFavor - goalsOwn;
//   }

//   async getAwayWinners() {
//     const matches = await this.getMatches();
//     const awayWinners = matches
//       .filter((match) => match.awayTeamGoals > match.homeTeamGoals)
//       .map((match) => (
//         {
//           teamName: match.awayTeam.teamName,
//           loser: match.homeTeam.teamName,
//           goalsFavor: match.awayTeamGoals,
//           goalsOwn: match.homeTeamGoals,
//           points: 3,
//         }
//       ));

//     return awayWinners;
//   }

//   async getAwayTies() {
//     const matches = await this.getMatches();
//     const awayTies = matches
//       .filter((match) => match.awayTeamGoals === match.homeTeamGoals)
//       .map((match) => ({
//         matchId: match.id,
//         teamName: match.awayTeam.teamName,
//         goalsFavor: match.awayTeamGoals,
//         goalsOwn: match.homeTeamGoals,
//         points: 1,
//       }));

//     return awayTies;
//   }
// }

// export default AwayGamesService;
