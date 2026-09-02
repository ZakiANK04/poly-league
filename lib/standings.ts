import { Match, StandingRow, Team } from './types';

export function calculateStandings(teams: Team[], matches: Match[]): StandingRow[] {
  const table: Record<string, StandingRow> = {};

  teams.forEach(team => {
    table[team.id] = {
      rank: 0,
      team,
      mp: 0,
      w: 0,
      d: 0,
      l: 0,
      gf: 0,
      ga: 0,
      gd: 0,
      points: 0,
      zone: 'playoff',
    };
  });

  // Only calculate from finished or live league matches
  const leagueMatches = matches.filter(m => m.phase === 'league' && (m.status === 'finished' || m.status === 'live'));

  leagueMatches.forEach(match => {
    const home = table[match.homeTeamId];
    const away = table[match.awayTeamId];
    if (!home || !away) return;

    const hs = match.homeScore ?? 0;
    const as = match.awayScore ?? 0;

    home.mp += 1;
    away.mp += 1;
    home.gf += hs;
    home.ga += as;
    away.gf += as;
    away.ga += hs;
    home.gd = home.gf - home.ga;
    away.gd = away.gf - away.ga;

    if (hs > as) {
      home.w += 1;
      home.points += 3;
      away.l += 1;
    } else if (hs < as) {
      away.w += 1;
      away.points += 3;
      home.l += 1;
    } else {
      home.d += 1;
      away.d += 1;
      home.points += 1;
      away.points += 1;
    }
  });

  const sorted = Object.values(table).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.gd !== a.gd) return b.gd - a.gd;
    if (b.gf !== a.gf) return b.gf - a.gf;
    return a.team.name.localeCompare(b.team.name);
  });

  return sorted.map((row, index) => {
    const rank = index + 1;
    let zone: 'direct' | 'playoff' | 'eliminated' = 'playoff';
    if (rank <= 2) zone = 'direct';
    else if (rank >= 7) zone = 'eliminated';

    return {
      ...row,
      rank,
      zone,
    };
  });
}
