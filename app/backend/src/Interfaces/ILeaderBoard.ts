export interface ILeaderBoard {
  name: string,
  totalPoints: number,
  totalGames: number,
  totalVictories: number,
  totalDraws: number,
  totalLosses: number,
  goalsFavor: number,
  goalsOwn: number,
  goalsBalance: number,
  efficiency: number,
}

export interface Merge {
  [teamName: string]: {
    name: string,
    goalsFavor: number,
    goalsOwn: number,
    totalPoints: number,
  },
}

export interface Infos {
  name: string,
  goalsFavor: number,
  goalsOwn: number,
  totalPoints: number,
}
