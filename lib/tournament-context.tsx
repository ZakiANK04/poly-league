"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Team, Match, Player, StandingRow, TeamCode, KnockoutDrawState, HighlightItem } from './types';
import { TEAMS, INITIAL_MATCHES, INITIAL_PLAYERS, HIGHLIGHTS } from './mock-data';
import { calculateStandings } from './standings';
import { createClient } from './supabase/client';

export type PortalRole = 'captain' | 'super_admin';

interface CaptainSession {
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

export function TournamentProvider({ children }: { children: React.ReactNode }) {
  const [teams] = useState<Team[]>(TEAMS);
  const [matches, setMatches] = useState<Match[]>(INITIAL_MATCHES);
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);
  const [highlights, setHighlights] = useState<HighlightItem[]>(HIGHLIGHTS);
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
        setCurrentCaptain({ role, teamCode: null, teamId: null, name: profile.full_name || 'Super Admin' });
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
        setCurrentCaptain({ role, teamCode: team.code, teamId: team.id, name: profile.full_name || team.captainName });
      }
      setAuthLoading(false);
    });
  }, [teams]);

  // Supabase realtime listener
  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    const channel = supabase
      .channel('realtime:matches')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'matches' },
        (payload) => {
          if (payload.eventType === 'UPDATE' && payload.new) {
            setMatches((prev) =>
              prev.map((m) => (m.id === payload.new.id ? { ...m, ...payload.new } : m))
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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

  const updateMatch = (matchId: string, updates: Partial<Match>) => {
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
    saveMatches(updated);
  };

  const addMatch = (matchData: Omit<Match, 'id'>) => {
    saveMatches([...matches, { ...matchData, id: `match-${Date.now()}` }]);
  };

  const removeMatch = (matchId: string) => {
    saveMatches(matches.filter((match) => match.id !== matchId));
  };

  const addPlayer = (playerData: Omit<Player, 'id'>) => {
    const newPlayer: Player = {
      ...playerData,
      id: `p-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    const updated = [...players, newPlayer];
    savePlayers(updated);
  };

  const updatePlayer = (playerId: string, updates: Partial<Player>) => {
    const updated = players.map((p) => (p.id === playerId ? { ...p, ...updates } : p));
    savePlayers(updated);
  };

  const removePlayer = (playerId: string) => {
    const updated = players.filter((p) => p.id !== playerId);
    savePlayers(updated);
  };

  const addHighlight = (highlight: Omit<HighlightItem, 'id'>) => {
    saveHighlights([{ ...highlight, id: `highlight-${Date.now()}`, approvalStatus: 'pending' }, ...highlights]);
  };

  const updateHighlight = (highlightId: string, updates: Partial<HighlightItem>) => {
    saveHighlights(highlights.map((highlight) => highlight.id === highlightId ? { ...highlight, ...updates } : highlight));
  };

  const removeHighlight = (highlightId: string) => {
    saveHighlights(highlights.filter((highlight) => highlight.id !== highlightId));
  };

  const standings = calculateStandings(teams, matches);
  const publishedHighlights = highlights.filter((highlight) => (highlight.approvalStatus || 'approved') === 'approved');

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
    setHighlights(HIGHLIGHTS);
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
