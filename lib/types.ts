export type TeamCode = 'AUTO' | 'DATA' | 'ELN' | 'ELT' | 'INDUS' | 'MECA' | 'MTRX' | 'QHSE';

export interface Team {
  id: string;
  code: TeamCode;
  name: string;
  department: string;
  badgeUrl: string;
  captainName: string;
  captainId?: string;
  played?: number;
  won?: number;
  drawn?: number;
  lost?: number;
  gf?: number;
  ga?: number;
  gd?: number;
  points?: number;
}

export interface Player {
  id: string;
  teamId: string;
  name: string;
  number: number;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  photoUrl?: string;
  isCaptain?: boolean;
}

export type MatchPhase = 'league' | 'playoff' | 'semifinal' | 'final';
export type MatchStatus = 'scheduled' | 'live' | 'finished';
export type MatchPeriod = 'pre-match' | 'first-half' | 'second-half' | 'full-time';

export interface MatchScorer {
  playerId: string;
  playerName: string;
  teamId: string;
  minute?: number;
}

export interface Match {
  id: string;
  phase: MatchPhase;
  matchday?: number;
  roundLabel?: string;
  homeTeamId: string;
  awayTeamId: string;
  homeTeam: Team;
  awayTeam: Team;
  scheduledAt: string;
  venue: string;
  homeScore?: number | null;
  awayScore?: number | null;
  status: MatchStatus;
  matchPeriod?: MatchPeriod;
  scorers?: MatchScorer[];
  lastUpdatedBy?: string;
}

export interface StandingRow {
  rank: number;
  team: Team;
  mp: number;
  w: number;
  d: number;
  l: number;
  gf: number;
  ga: number;
  gd: number;
  points: number;
  zone: 'direct' | 'playoff' | 'eliminated';
}

export interface AnnouncementSlide {
  id: string;
  tag: string;
  title: string;
  subtitle?: string;
  content: string;
  date: string;
  badgeCode?: TeamCode;
}

export interface HighlightItem {
  id: string;
  season: string;
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  tags: string[];
  contentType?: 'score' | 'article' | 'video';
  scoreline?: string;
  caption?: string;
  createdBy?: string;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface KnockoutPairing {
  id: string;
  label: string;
  home: Team;
  away: Team;
  venue: string;
  date: string;
  homeScore?: number | null;
  awayScore?: number | null;
  status: MatchStatus;
}

export interface KnockoutDrawState {
  isDrawn: boolean;
  drawnAt?: string;
  drawnBy?: string;
  playOff1?: KnockoutPairing;
  playOff2?: KnockoutPairing;
  semiFinal1?: KnockoutPairing;
  semiFinal2?: KnockoutPairing;
  final?: KnockoutPairing;
}
