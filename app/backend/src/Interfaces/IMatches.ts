export interface IMatches {
  id: number,
  homeTeamId: number,
  homeTeamGoals: number,
  awayTeamId: number,
  awayTeamGoals: number,
  inProgress: boolean,
}

export interface UpdateScore {
  homeTeamGoals: number,
  awayTeamGoals: number,
}
