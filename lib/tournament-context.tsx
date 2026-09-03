"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Team, Match, Player, StandingRow, TeamCode, KnockoutDrawState, HighlightItem, MatchScorer, MatchPeriod } from './types';
import { TEAMS, INITIAL_MATCHES, INITIAL_PLAYERS } from './mock-data';
import { calculateStandings } from './standings';
import { createClient } from './supabase/client';

export type PortalRole = 'captain' | 'super_admin';

interface CaptainSession {
  userId: string;
  role: PortalRole;
  teamCode: TeamCode | null;
  teamId: string | null;
  name: string;
}

interface TournamentContextType {
  teams: Team[];
  matches: Match[];
  players: Player[];
  highlights: HighlightItem[];
  publishedHighlights: HighlightItem[];
  standings: StandingRow[];
  currentCaptain: CaptainSession | null;
  portalRole: PortalRole | null;
  authLoading: boolean;
  authError: string | null;
  knockoutDraw: KnockoutDrawState;
  loginAsCaptain: (teamCode: TeamCode) => void;
  logout: () => void;
  updateMatch: (matchId: string, updates: Partial<Match>) => void;
  addMatch: (match: Omit<Match, 'id'>) => void;
  removeMatch: (matchId: string) => void;
  addPlayer: (player: Omit<Player, 'id'>) => void;
  updatePlayer: (playerId: string, updates: Partial<Player>) => void;
  removePlayer: (playerId: string) => void;
  addHighlight: (highlight: Omit<HighlightItem, 'id'>) => void;
  addApprovedHighlight: (highlight: Omit<HighlightItem, 'id'>) => void;
  updateHighlight: (highlightId: string, updates: Partial<HighlightItem>) => void;
  removeHighlight: (highlightId: string) => void;
  conductKnockoutDraw: (captainName: string) => void;
  conductLeagueDraw: (captainName: string) => void;
  resetKnockoutDraw: () => void;
  resetToDefaults: () => void;
}

const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

const STORAGE_KEY_MATCHES = 'pl_matches_v2';
const STORAGE_KEY_PLAYERS = 'pl_players_v2';
const STORAGE_KEY_HIGHLIGHTS = 'pl_highlights_v1';
const STORAGE_KEY_KNOCKOUT = 'pl_knockout_v2';

const toHighlight = (row: Record<string, unknown>): HighlightItem => ({
  id: String(row.id),
  season: String(row.season || ''),
  title: String(row.title || ''),
  description: String(row.description || ''),
  caption: String(row.caption || row.description || ''),
  mediaUrl: String(row.media_url || '/assets/Logo_polyleague.png'),
  mediaType: row.media_type === 'video' ? 'video' : 'image',
  contentType: row.content_type === 'score' || row.content_type === 'video' ? row.content_type : 'article',
  scoreline: typeof row.scoreline === 'string' ? row.scoreline : undefined,
  tags: Array.isArray(row.tags) ? row.tags.map(String) : [],
  createdBy: typeof row.created_by === 'string' ? row.created_by : undefined,
  approvalStatus: row.approval_status === 'pending' || row.approval_status === 'rejected' ? row.approval_status : 'approved',
  reviewedBy: typeof row.reviewed_by === 'string' ? row.reviewed_by : undefined,
  reviewedAt: typeof row.reviewed_at === 'string' ? row.reviewed_at : undefined,
});

const toPlayer = (row: Record<string, unknown>): Player => ({
  id: String(row.id),
  teamId: String(row.team_id),
  name: String(row.name || ''),
  number: Number(row.number || 0),
  position: row.position === 'GK' || row.position === 'DEF' || row.position === 'FWD' ? row.position : 'MID',
  photoUrl: typeof row.photo_url === 'string' ? row.photo_url : undefined,
});

const toMatch = (row: Record<string, unknown>, databaseTeams: Team[]): Match | null => {
  const homeTeam = databaseTeams.find((team) => team.id === row.home_team_id);
  const awayTeam = databaseTeams.find((team) => team.id === row.away_team_id);
  if (!homeTeam || !awayTeam) return null;
  return {
    id: String(row.id), phase: row.phase as Match['phase'], matchday: typeof row.matchday === 'number' ? row.matchday : undefined,
    roundLabel: typeof row.round_label === 'string' ? row.round_label : undefined,
    homeTeamId: homeTeam.id, awayTeamId: awayTeam.id, homeTeam, awayTeam,
    scheduledAt: typeof row.scheduled_at === 'string' ? row.scheduled_at : '', venue: typeof row.venue === 'string' ? row.venue : '',
    homeScore: typeof row.home_score === 'number' ? row.home_score : null, awayScore: typeof row.away_score === 'number' ? row.away_score : null,
    status: row.status === 'live' || row.status === 'finished' ? row.status : 'scheduled',
    matchPeriod: row.match_period as MatchPeriod | undefined,
    scorers: Array.isArray(row.scorers) ? row.scorers as MatchScorer[] : [],
    lastUpdatedBy: typeof row.last_updated_by === 'string' ? row.last_updated_by : undefined,
  };
};

const matchPayload = (match: Partial<Match>) => ({
  phase: match.phase,
  matchday: match.matchday ?? null,
  round_label: match.roundLabel ?? null,
  home_team_id: match.homeTeamId,
  away_team_id: match.awayTeamId,
  scheduled_at: match.scheduledAt || null,
  venue: match.venue || '',
  home_score: match.homeScore ?? null,
  away_score: match.awayScore ?? null,
  status: match.status,
  match_period: match.matchPeriod || (match.status === 'finished' ? 'full-time' : match.status === 'live' ? 'first-half' : 'pre-match'),
  scorers: match.scorers || [],
  last_updated_by: match.lastUpdatedBy || null,
});

const playerPayload = (player: Partial<Player>) => ({
  team_id: player.teamId,
  name: player.name,
  number: player.number,
  position: player.position,
  photo_url: player.photoUrl || null,
});

const highlightPayload = (highlight: Partial<HighlightItem>, approvalStatus: HighlightItem['approvalStatus']) => ({
  season: highlight.season,
  title: highlight.title,
  description: highlight.description,
  media_url: highlight.mediaUrl,
  media_type: highlight.mediaType,
  content_type: highlight.contentType || 'article',
  scoreline: highlight.scoreline || null,
  tags: highlight.tags || [],
  approval_status: approvalStatus,
});

const upsertById = <T extends { id: string }>(items: T[], next: T) => {
  const index = items.findIndex((item) => item.id === next.id);
  if (index < 0) return [...items, next];
  return items.map((item) => item.id === next.id ? next : item);
};

export function TournamentProvider({ children }: { children: React.ReactNode }) {
  const [teams, setTeams] = useState<Team[]>(TEAMS);
  const [matches, setMatches] = useState<Match[]>(INITIAL_MATCHES);
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);
  const [highlights, setHighlights] = useState<HighlightItem[]>([]);
  const [currentCaptain, setCurrentCaptain] = useState<CaptainSession | null>(null);
  const [portalRole, setPortalRole] = useState<PortalRole | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [knockoutDraw, setKnockoutDraw] = useState<KnockoutDrawState>({ isDrawn: false });

  // Load from local storage
  useEffect(() => {
    try {
      const savedMatches = localStorage.getItem(STORAGE_KEY_MATCHES);
      if (savedMatches) setMatches(JSON.parse(savedMatches));

      const savedPlayers = localStorage.getItem(STORAGE_KEY_PLAYERS);
      if (savedPlayers) setPlayers(JSON.parse(savedPlayers));

      const savedHighlights = localStorage.getItem(STORAGE_KEY_HIGHLIGHTS);
      if (savedHighlights) setHighlights(JSON.parse(savedHighlights));

      const savedKnockout = localStorage.getItem(STORAGE_KEY_KNOCKOUT);
      if (savedKnockout) setKnockoutDraw(JSON.parse(savedKnockout));
    } catch (e) {
      console.error('Storage load error:', e);
    }
  }, []);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    const hydrate = async () => {
      const [{ data: teamRows, error: teamsError }, { data: matchRows, error: matchesError }, { data: playerRows, error: playersError }, { data: highlightRows, error: highlightsError }] = await Promise.all([
        supabase.from('teams').select('*').order('code'),
        supabase.from('matches').select('*').order('scheduled_at'),
        supabase.from('players').select('*').order('team_id').order('name'),
        supabase.from('highlights').select('*').order('created_at', { ascending: false }),
      ]);
      if (teamsError || matchesError || playersError || highlightsError) {
        setAuthError(`Supabase data could not be loaded: ${teamsError?.message || matchesError?.message || playersError?.message || highlightsError?.message}`);
        return;
      }
      const databaseTeams = (teamRows || []).map((row: Record<string, unknown>) => {
        const fallback = TEAMS.find((team) => team.code === row.code);
        return fallback ? { ...fallback, id: String(row.id), name: String(row.name || fallback.name), department: String(row.department || fallback.department), badgeUrl: String(row.badge_url || fallback.badgeUrl) } : null;
      }).filter((team): team is Team => Boolean(team));
      if (databaseTeams.length) setTeams(databaseTeams);
      setPlayers((playerRows || []).map((row: Record<string, unknown>) => toPlayer(row)));
      setMatches((matchRows || []).map((row: Record<string, unknown>) => toMatch(row, databaseTeams)).filter((match): match is Match => Boolean(match)));
      setHighlights((highlightRows || []).map((row: Record<string, unknown>) => toHighlight(row)));
    };
    void hydrate();
  }, []);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) {
      setAuthLoading(false);
      return;
    }

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        setAuthLoading(false);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, team_id, role')
        .eq('id', user.id)
        .single();
      if (profileError) {
        setAuthError(profileError.code === 'PGRST116'
          ? 'Your Supabase account exists, but it has no row in public.profiles. Add one using your Auth user UUID.'
          : `Captain profile could not be loaded: ${profileError.message}`);
        setAuthLoading(false);
        return;
      }

      const role: PortalRole = profile.role === 'super_admin' ? 'super_admin' : 'captain';
      setPortalRole(role);

      if (role === 'super_admin') {
        setCurrentCaptain({ userId: user.id, role, teamCode: null, teamId: null, name: profile.full_name || 'Super Admin' });
        setAuthLoading(false);
        return;
      }

      // Supabase team IDs are database UUIDs; the local UI uses stable team codes.
      const { data: databaseTeam, error: teamError } = await supabase
        .from('teams')
        .select('code')
        .eq('id', profile.team_id)
        .single();
      const team = teams.find((candidate) => candidate.code === databaseTeam?.code);
      if (teamError || !team) {
        setAuthError('Your captain profile is missing a valid team link. Check profiles.team_id against public.teams.id.');
      } else {
        setCurrentCaptain({ userId: user.id, role, teamCode: team.code, teamId: team.id, name: profile.full_name || team.captainName });
      }
      setAuthLoading(false);
    });
  }, [teams]);

  // Keep every open public/admin view synchronized with persisted changes.
  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    const channel = supabase.channel('realtime:tournament-data');
    channel.on('postgres_changes', { event: '*', schema: 'public', table: 'matches' }, (payload) => {
      const matchId = String((payload.new as Record<string, unknown> | undefined)?.id || (payload.old as Record<string, unknown> | undefined)?.id || '');
      if (payload.eventType === 'DELETE') setMatches((prev) => prev.filter((match) => match.id !== matchId));
      else {
        const nextMatch = toMatch(payload.new as Record<string, unknown>, teams);
        if (nextMatch) setMatches((prev) => upsertById(prev, nextMatch));
      }
    });
    channel.on('postgres_changes', { event: '*', schema: 'public', table: 'players' }, (payload) => {
      const playerId = String((payload.new as Record<string, unknown> | undefined)?.id || (payload.old as Record<string, unknown> | undefined)?.id || '');
      if (payload.eventType === 'DELETE') setPlayers((prev) => prev.filter((player) => player.id !== playerId));
      else {
        const nextPlayer = toPlayer(payload.new as Record<string, unknown>);
        setPlayers((prev) => upsertById(prev, nextPlayer));
      }
    });
    channel.on('postgres_changes', { event: '*', schema: 'public', table: 'highlights' }, (payload) => {
      const highlightId = String((payload.new as Record<string, unknown> | undefined)?.id || (payload.old as Record<string, unknown> | undefined)?.id || '');
      if (payload.eventType === 'DELETE') setHighlights((prev) => prev.filter((highlight) => highlight.id !== highlightId));
      else {
        const nextHighlight = toHighlight(payload.new as Record<string, unknown>);
        setHighlights((prev) => upsertById(prev, nextHighlight));
      }
    });
    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [teams]);

  const saveMatches = (newMatches: Match[]) => {
    setMatches(newMatches);
    try {
      localStorage.setItem(STORAGE_KEY_MATCHES, JSON.stringify(newMatches));
    } catch {}
  };

  const savePlayers = (newPlayers: Player[]) => {
    setPlayers(newPlayers);
    try {
      localStorage.setItem(STORAGE_KEY_PLAYERS, JSON.stringify(newPlayers));
    } catch {}
  };

  const saveHighlights = (newHighlights: HighlightItem[]) => {
    setHighlights(newHighlights);
    try {
      localStorage.setItem(STORAGE_KEY_HIGHLIGHTS, JSON.stringify(newHighlights));
    } catch {}
  };

  const saveKnockout = (newDraw: KnockoutDrawState) => {
    setKnockoutDraw(newDraw);
    try {
      localStorage.setItem(STORAGE_KEY_KNOCKOUT, JSON.stringify(newDraw));
    } catch {}
  };

  const loginAsCaptain = (teamCode: TeamCode) => {
    const team = TEAMS.find((t) => t.code === teamCode);
    if (!team) return;
    const session: CaptainSession = {
      userId: `local-${team.code}`,
      role: 'captain',
      teamCode: team.code,
      teamId: team.id,
      name: team.captainName,
    };
    setCurrentCaptain(session);
  };

  const logout = () => {
    const supabase = createClient();
    void supabase?.auth.signOut();
    setCurrentCaptain(null);
    setPortalRole(null);
  };

  const updateMatch = async (matchId: string, updates: Partial<Match>) => {
    const updated = matches.map((m) => {
      if (m.id === matchId) {
        const permittedUpdates = { ...updates };
        if (portalRole !== 'super_admin') {
          delete permittedUpdates.homeScore;
          delete permittedUpdates.awayScore;
          delete permittedUpdates.status;
        }
        return {
          ...m,
          ...permittedUpdates,
          lastUpdatedBy: currentCaptain ? currentCaptain.name : m.lastUpdatedBy,
        };
      }
      return m;
    });
    const supabase = createClient();
    if (supabase) {
      const current = matches.find((match) => match.id === matchId);
      if (!current) return;
      const permittedUpdates = { ...updates };
      if (portalRole !== 'super_admin') {
        delete permittedUpdates.homeScore;
        delete permittedUpdates.awayScore;
        delete permittedUpdates.status;
        delete permittedUpdates.matchPeriod;
      }
      const { data, error } = await supabase.from('matches').update(matchPayload({ ...current, ...permittedUpdates, lastUpdatedBy: currentCaptain?.name || current.lastUpdatedBy })).eq('id', matchId).select('*').single();
      if (error) { setAuthError(`Match update failed: ${error.message}`); return; }
      const nextMatch = toMatch(data as Record<string, unknown>, teams);
      if (nextMatch) setMatches((previous) => previous.map((match) => match.id === matchId ? nextMatch : match));
      return;
    }
    saveMatches(updated);
  };

  const addMatch = async (matchData: Omit<Match, 'id'>) => {
    const supabase = createClient();
    if (supabase) {
      const { data, error } = await supabase.from('matches').insert(matchPayload(matchData)).select('*').single();
      if (error) { setAuthError(`Match creation failed: ${error.message}`); return; }
      const nextMatch = toMatch(data as Record<string, unknown>, teams);
      if (nextMatch) setMatches((previous) => upsertById(previous, nextMatch));
      return;
    }
    saveMatches([...matches, { ...matchData, id: `match-${Date.now()}` }]);
  };

  const removeMatch = async (matchId: string) => {
    const supabase = createClient();
    if (supabase) {
      const { error } = await supabase.from('matches').delete().eq('id', matchId);
      if (error) { setAuthError(`Match deletion failed: ${error.message}`); return; }
      setMatches((previous) => previous.filter((match) => match.id !== matchId));
      return;
    }
    saveMatches(matches.filter((match) => match.id !== matchId));
  };

  const addPlayer = async (playerData: Omit<Player, 'id'>) => {
    const newPlayer: Player = {
      ...playerData,
      id: `p-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    const supabase = createClient();
    if (supabase) {
      const { data, error } = await supabase.from('players').insert(playerPayload(playerData)).select('*').single();
      if (error) { setAuthError(`Player creation failed: ${error.message}`); return; }
      setPlayers((previous) => upsertById(previous, toPlayer(data as Record<string, unknown>)));
      return;
    }
    savePlayers([...players, newPlayer]);
  };

  const updatePlayer = async (playerId: string, updates: Partial<Player>) => {
    const supabase = createClient();
    if (supabase) {
      const current = players.find((player) => player.id === playerId);
      if (!current) return;
      const { data, error } = await supabase.from('players').update(playerPayload({ ...current, ...updates })).eq('id', playerId).select('*').single();
      if (error) { setAuthError(`Player update failed: ${error.message}`); return; }
      const nextPlayer = toPlayer(data as Record<string, unknown>);
      setPlayers((previous) => previous.map((player) => player.id === playerId ? nextPlayer : player));
      return;
    }
    const updated = players.map((p) => (p.id === playerId ? { ...p, ...updates } : p));
    savePlayers(updated);
  };

  const removePlayer = async (playerId: string) => {
    const supabase = createClient();
    if (supabase) {
      const { error } = await supabase.from('players').delete().eq('id', playerId);
      if (error) { setAuthError(`Player deletion failed: ${error.message}`); return; }
      setPlayers((previous) => previous.filter((player) => player.id !== playerId));
      return;
    }
    const updated = players.filter((p) => p.id !== playerId);
    savePlayers(updated);
  };

  const addHighlight = async (highlight: Omit<HighlightItem, 'id'>) => {
    const supabase = createClient();
    if (supabase) {
      const { data, error } = await supabase.from('highlights').insert({ ...highlightPayload(highlight, 'pending'), created_by: currentCaptain?.userId || null }).select('*').single();
      if (error) { setAuthError(`News submission failed: ${error.message}`); return; }
      setHighlights((previous) => upsertById(previous, toHighlight(data as Record<string, unknown>)));
      return;
    }
    saveHighlights([{ ...highlight, id: `highlight-${Date.now()}`, approvalStatus: 'pending' }, ...highlights]);
  };

  const addApprovedHighlight = async (highlight: Omit<HighlightItem, 'id'>) => {
    const supabase = createClient();
    if (supabase) {
      const { data, error } = await supabase.from('highlights').insert({ ...highlightPayload(highlight, 'approved'), created_by: currentCaptain?.userId || null }).select('*').single();
      if (error) { setAuthError(`News publishing failed: ${error.message}`); return; }
      setHighlights((previous) => upsertById(previous, toHighlight(data as Record<string, unknown>)));
      return;
    }
    saveHighlights([{ ...highlight, id: `highlight-${Date.now()}`, approvalStatus: 'approved' }, ...highlights]);
  };

  const updateHighlight = async (highlightId: string, updates: Partial<HighlightItem>) => {
    const supabase = createClient();
    if (supabase) {
      const current = highlights.find((highlight) => highlight.id === highlightId);
      if (!current) return;
      const next = { ...current, ...updates };
      const { data, error } = await supabase.from('highlights').update({ ...highlightPayload(next, next.approvalStatus || 'pending'), reviewed_by: next.reviewedBy || null, reviewed_at: next.reviewedAt || null }).eq('id', highlightId).select('*').single();
      if (error) { setAuthError(`News update failed: ${error.message}`); return; }
      const nextHighlight = toHighlight(data as Record<string, unknown>);
      setHighlights((previous) => previous.map((highlight) => highlight.id === highlightId ? nextHighlight : highlight));
      return;
    }
    saveHighlights(highlights.map((highlight) => highlight.id === highlightId ? { ...highlight, ...updates } : highlight));
  };

  const removeHighlight = async (highlightId: string) => {
    const supabase = createClient();
    if (supabase) {
      const { error } = await supabase.from('highlights').delete().eq('id', highlightId);
      if (error) { setAuthError(`News deletion failed: ${error.message}`); return; }
      setHighlights((previous) => previous.filter((highlight) => highlight.id !== highlightId));
      return;
    }
    saveHighlights(highlights.filter((highlight) => highlight.id !== highlightId));
  };

  const standings = calculateStandings(teams, matches);
  const publishedHighlights = highlights.filter((highlight) => {
    const title = highlight.title.trim().toLowerCase();
    const placeholder = title === 'games draw soon' || title === 'a new format. a bigger fight.';
    return (highlight.approvalStatus || 'approved') === 'approved' && !placeholder;
  });

  // Autonomous Knockout Random Draw function
  const conductKnockoutDraw = (captainName: string) => {
    // Current standings determine playoff contenders (ranks 3 to 6) and direct qualifiers (ranks 1 & 2)
    const seed1 = standings[0]?.team || TEAMS[0];
    const seed2 = standings[1]?.team || TEAMS[1];

    // Playoff teams: seeds 3, 4, 5, 6
    const playoffPool = [
      standings[2]?.team || TEAMS[2],
      standings[3]?.team || TEAMS[3],
      standings[4]?.team || TEAMS[4],
      standings[5]?.team || TEAMS[5],
    ];

    // Random shuffle playoff teams
    const shuffled = [...playoffPool].sort(() => Math.random() - 0.5);

    const po1Home = shuffled[0];
    const po1Away = shuffled[1];
    const po2Home = shuffled[2];
    const po2Away = shuffled[3];

    const drawResult: KnockoutDrawState = {
      isDrawn: true,
      drawnAt: new Date().toISOString(),
      drawnBy: captainName,
      playOff1: {
        id: 'po-1',
        label: 'Play-off 1 (Knockout)',
        home: po1Home,
        away: po1Away,
        venue: 'Beaulieu Stadium',
        date: '2026-11-06T14:00:00Z',
        homeScore: null,
        awayScore: null,
        status: 'scheduled',
      },
      playOff2: {
        id: 'po-2',
        label: 'Play-off 2 (Knockout)',
        home: po2Home,
        away: po2Away,
        venue: 'Beaulieu Stadium',
        date: '2026-11-06T16:30:00Z',
        homeScore: null,
        awayScore: null,
        status: 'scheduled',
      },
      semiFinal1: {
        id: 'sf-1',
        label: 'Semi-Final 1',
        home: seed1,
        away: po1Home, // Placeholder until PO winner
        venue: 'Beaulieu Stadium',
        date: '2026-11-10T14:00:00Z',
        homeScore: null,
        awayScore: null,
        status: 'scheduled',
      },
      semiFinal2: {
        id: 'sf-2',
        label: 'Semi-Final 2',
        home: seed2,
        away: po2Home, // Placeholder until PO winner
        venue: 'Beaulieu Stadium',
        date: '2026-11-10T16:30:00Z',
        homeScore: null,
        awayScore: null,
        status: 'scheduled',
      },
      final: {
        id: 'fn-1',
        label: 'The Grand Final',
        home: seed1,
        away: seed2,
        venue: 'Beaulieu Stadium',
        date: '2026-11-14T17:00:00Z',
        homeScore: null,
        awayScore: null,
        status: 'scheduled',
      },
    };

    saveKnockout(drawResult);
  };

  const resetKnockoutDraw = () => {
    saveKnockout({ isDrawn: false });
  };

  const conductLeagueDraw = (captainName: string) => {
    const shuffledTeams = [...teams].sort(() => Math.random() - 0.5);
    const drawnMatches: Match[] = [];
    const rotation = [...shuffledTeams];

    for (let matchday = 1; matchday <= 4; matchday += 1) {
      for (let pairing = 0; pairing < rotation.length / 2; pairing += 1) {
        const homeTeam = rotation[pairing];
        const awayTeam = rotation[rotation.length - 1 - pairing];
        drawnMatches.push({
          id: `league-md${matchday}-${pairing + 1}`,
          phase: 'league',
          matchday,
          roundLabel: `Matchday ${matchday}`,
          homeTeamId: homeTeam.id,
          awayTeamId: awayTeam.id,
          homeTeam,
          awayTeam,
          scheduledAt: '',
          venue: '',
          homeScore: null,
          awayScore: null,
          status: 'scheduled',
          lastUpdatedBy: captainName,
        });
      }

      const fixedTeam = rotation[0];
      const rotatingTeams = rotation.slice(1);
      rotatingTeams.unshift(rotatingTeams.pop()!);
      rotation.splice(0, rotation.length, fixedTeam, ...rotatingTeams);
    }

    saveMatches(drawnMatches);
  };

  const resetToDefaults = () => {
    setMatches(INITIAL_MATCHES);
    setPlayers(INITIAL_PLAYERS);
    setHighlights([]);
    setKnockoutDraw({ isDrawn: false });
    try {
      localStorage.removeItem(STORAGE_KEY_MATCHES);
      localStorage.removeItem(STORAGE_KEY_PLAYERS);
      localStorage.removeItem(STORAGE_KEY_HIGHLIGHTS);
      localStorage.removeItem(STORAGE_KEY_KNOCKOUT);
    } catch {}
  };

  return (
    <TournamentContext.Provider
      value={{
        teams,
        matches,
        players,
        highlights,
        publishedHighlights,
        standings,
        currentCaptain,
        portalRole,
        authLoading,
        authError,
        knockoutDraw,
        loginAsCaptain,
        logout,
        updateMatch,
        addMatch,
        removeMatch,
        addPlayer,
        updatePlayer,
        removePlayer,
        addHighlight,
        addApprovedHighlight,
        updateHighlight,
        removeHighlight,
        conductKnockoutDraw,
        conductLeagueDraw,
        resetKnockoutDraw,
        resetToDefaults,
      }}
    >
      {children}
    </TournamentContext.Provider>
  );
}

export function useTournament() {
  const ctx = useContext(TournamentContext);
  if (!ctx) {
    throw new Error('useTournament must be used within a TournamentProvider');
  }
  return ctx;
}
