
interface Match {
  id: number;
  team1: string;
  team2: string;
  sport: 'basketball' | 'football';
  actualResult?: 'team1' | 'draw' | 'team2';
}

export const basketballMatches: Match[] = [
  { id: 1, team1: 'Lakers', team2: 'Warriors', sport: 'basketball', actualResult: 'team1' },
  { id: 2, team1: 'Celtics', team2: 'Heat', sport: 'basketball', actualResult: 'team2' },
  { id: 3, team1: 'Bulls', team2: 'Nets', sport: 'basketball', actualResult: 'team1' },
  { id: 4, team1: 'Knicks', team2: 'Sixers', sport: 'basketball', actualResult: 'draw' },
  { id: 5, team1: 'Nuggets', team2: 'Clippers', sport: 'basketball', actualResult: 'team2' },
  { id: 6, team1: 'Suns', team2: 'Mavericks', sport: 'basketball', actualResult: 'team1' },
  { id: 7, team1: 'Bucks', team2: 'Hawks', sport: 'basketball', actualResult: 'team1' },
  { id: 8, team1: 'Jazz', team2: 'Blazers', sport: 'basketball', actualResult: 'team2' },
  { id: 9, team1: 'Kings', team2: 'Rockets', sport: 'basketball', actualResult: 'draw' },
  { id: 10, team1: 'Spurs', team2: 'Magic', sport: 'basketball', actualResult: 'team1' }
];

export const footballMatches: Match[] = [
  { id: 1, team1: 'Chiefs', team2: 'Bills', sport: 'football', actualResult: 'team1' },
  { id: 2, team1: 'Cowboys', team2: 'Eagles', sport: 'football', actualResult: 'team2' },
  { id: 3, team1: 'Packers', team2: 'Bears', sport: 'football', actualResult: 'team1' },
  { id: 4, team1: 'Rams', team2: 'Seahawks', sport: 'football', actualResult: 'draw' },
  { id: 5, team1: 'Patriots', team2: 'Dolphins', sport: 'football', actualResult: 'team2' },
  { id: 6, team1: 'Steelers', team2: 'Ravens', sport: 'football', actualResult: 'team1' },
  { id: 7, team1: 'Broncos', team2: 'Raiders', sport: 'football', actualResult: 'team1' },
  { id: 8, team1: 'Saints', team2: 'Falcons', sport: 'football', actualResult: 'team2' },
  { id: 9, team1: 'Vikings', team2: 'Lions', sport: 'football', actualResult: 'draw' },
  { id: 10, team1: 'Titans', team2: 'Colts', sport: 'football', actualResult: 'team1' }
];
