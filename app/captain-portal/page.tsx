"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import {
  Shield,
  Calendar,
  Plus,
  Trash2,
  Edit3,
  Check,
  LogOut,
  Shuffle,
  Trophy,
  AlertCircle,
  Newspaper,
  Video
} from 'lucide-react';
import { useTournament } from '@/lib/tournament-context';
import { MatchStatus, Match, HighlightItem } from '@/lib/types';

export default function CaptainPortalPage() {
  const {
    teams,
    matches,
    players,
    standings,
    currentCaptain,
    portalRole,
    authLoading,
    authError,
    knockoutDraw,
    logout,
    updateMatch,
    addPlayer,
    removePlayer,
    conductKnockoutDraw,
    conductLeagueDraw,
    highlights,
    addHighlight,
    updateHighlight,
    removeHighlight,
    uploadHighlightMedia,
    resetKnockoutDraw,
  } = useTournament();

  const [activeTab, setActiveTab] = useState<'squad' | 'matches' | 'draw' | 'news'>('squad');

  // Squad form state
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerNumber, setNewPlayerNumber] = useState(10);
  const [newPlayerPos, setNewPlayerPos] = useState<'GK' | 'DEF' | 'MID' | 'FWD'>('MID');
  const [squadSuccess, setSquadSuccess] = useState(false);

  // Knockout draw state
  const [isDrawing, setIsDrawing] = useState(false);
  const [leagueDrawComplete, setLeagueDrawComplete] = useState(false);
  const [highlightType, setHighlightType] = useState<'score' | 'article' | 'video'>('article');
  const [highlightTitle, setHighlightTitle] = useState('');
  const [highlightDescription, setHighlightDescription] = useState('');
  const [highlightMediaUrl, setHighlightMediaUrl] = useState('');
  const [highlightMediaFile, setHighlightMediaFile] = useState<File | null>(null);
  const [highlightScoreline, setHighlightScoreline] = useState('');
  const [editingHighlightId, setEditingHighlightId] = useState<string | null>(null);
  const canRunLeagueDraw = portalRole === 'super_admin';

  if (authLoading) {
    return <div className="min-h-[60vh] flex items-center justify-center text-pl-blue font-display text-2xl uppercase tracking-wider">Verifying captain access...</div>;
  }

  if (portalRole === 'super_admin') {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <Shield className="mx-auto mb-4 h-10 w-10 text-pl-blue" />
        <h1 className="font-display text-3xl uppercase text-pl-black">Global admin access</h1>
        <p className="mt-2 text-sm text-gray-600">This account is not assigned to a department. Use the super-admin control room to manage the whole tournament.</p>
        <a href="/super-admin" className="mt-6 inline-flex rounded-lg bg-pl-blue px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-pl-blue-accent">Open control room</a>
      </div>
    );
  }

  // Middleware authenticates the request; the profile determines which team can be edited.
  if (!currentCaptain) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3.5 bg-pl-blue text-amber-300 rounded-2xl shadow-lg mb-2 border border-white/20">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="font-display text-4xl sm:text-5xl uppercase italic text-pl-black">
            CONFIDENTIAL CAPTAIN PORTAL
          </h1>
          <p className="text-gray-600 text-sm max-w-md mx-auto leading-relaxed font-normal">
            Autonomous tournament organizer workspace. Select your department to access your squad roster editor, match schedule & live scores, and the official Knockout Draw tool.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 text-center">
            Select Your Assigned Department
          </div>

          <p className="text-center text-sm text-gray-600 leading-relaxed">{authError || 'Your authenticated account is not linked to a captain profile yet. Ask the tournament administrator to link your account to a team.'}</p>
        </div>
      </div>
    );
  }

  // Captain is logged in
  const myTeam = teams.find((t) => t.code === currentCaptain.teamCode)!;
  const myPlayers = players.filter((p) => p.teamId === myTeam.id);
  const myMatches = matches.filter(
    (m) => m.homeTeamId === myTeam.id || m.awayTeamId === myTeam.id
  );

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayerName.trim()) return;
    addPlayer({
      teamId: myTeam.id,
      name: newPlayerName.trim(),
      number: newPlayerNumber,
      position: newPlayerPos,
    });
    setNewPlayerName('');
    setSquadSuccess(true);
    setTimeout(() => setSquadSuccess(false), 2500);
  };

  const handleTriggerDraw = () => {
    setIsDrawing(true);
    setTimeout(() => {
      conductKnockoutDraw(currentCaptain.name);
      setIsDrawing(false);
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch {}
    }, 2000);
  };

  const handleLeagueDraw = () => {
    setIsDrawing(true);
    setTimeout(() => {
      conductLeagueDraw(currentCaptain.name);
      setLeagueDrawComplete(true);
      setIsDrawing(false);
      try {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      } catch {}
    }, 1200);
  };

  const resetHighlightForm = () => {
    setEditingHighlightId(null);
    setHighlightTitle('');
    setHighlightDescription('');
    setHighlightMediaUrl('');
    setHighlightMediaFile(null);
    setHighlightScoreline('');
  };

  const handleHighlightSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const uploadedUrl = highlightMediaFile ? await uploadHighlightMedia(highlightMediaFile) : null;
    const mediaUrl = uploadedUrl || highlightMediaUrl.trim();
    if ((highlightType === 'article' || highlightType === 'video') && !mediaUrl) return;
    const payload = {
      season: 'Season 2026',
      title: highlightTitle.trim(),
      description: highlightDescription.trim(),
      caption: highlightDescription.trim(),
      mediaUrl: mediaUrl || '/assets/Logo_polyleague.png',
      mediaType: highlightType === 'video' ? 'video' as const : 'image' as const,
      contentType: highlightType,
      scoreline: highlightType === 'score' ? highlightScoreline.trim() : undefined,
      tags: [highlightType === 'score' ? 'Live Score' : highlightType === 'article' ? 'News' : 'Video'],
      createdBy: currentCaptain?.name,
    };
    if (editingHighlightId) updateHighlight(editingHighlightId, payload);
    else addHighlight(payload);
    resetHighlightForm();
  };

  const editHighlight = (item: HighlightItem) => {
    setEditingHighlightId(item.id);
    setHighlightType(item.contentType || (item.mediaType === 'video' ? 'video' : 'article'));
    setHighlightTitle(item.title);
    setHighlightDescription(item.caption || item.description);
    setHighlightMediaUrl(item.mediaUrl);
    setHighlightScoreline(item.scoreline || '');
    setActiveTab('news');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Captain Profile Top Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-md border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 flex-shrink-0">
            <Image src={myTeam.badgeUrl} alt={myTeam.name} fill className="object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-3xl text-pl-black leading-none">{myTeam.code}</span>
              <span className="bg-amber-400 text-pl-black font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Official Captain
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-0.5">
              Logged in as <strong className="text-gray-900">{currentCaptain.name}</strong> • {myTeam.department}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 self-stretch sm:self-auto">
          <button
            onClick={logout}
            className="flex-1 sm:flex-none justify-center items-center gap-1.5 text-xs bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl shadow active:scale-95 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-gray-200 gap-1 pb-px scrollbar-none">
        <button
          onClick={() => setActiveTab('squad')}
          className={`shrink-0 pb-3 px-3 sm:px-4 font-display text-sm sm:text-base uppercase tracking-wide border-b-2 transition ${
            activeTab === 'squad'
              ? 'border-pl-blue text-pl-blue font-bold'
              : 'border-transparent text-gray-400 hover:text-gray-900'
          }`}
        >
          Squad Registration ({myPlayers.length})
        </button>
        <button
          onClick={() => setActiveTab('news')}
          className="shrink-0 pb-3 px-3 sm:px-4 font-display text-sm sm:text-base uppercase tracking-wide border-b-2 border-transparent text-gray-400 hover:text-gray-900 transition flex items-center gap-2"
        >
          <Newspaper className="w-4 h-4 text-amber-600" />
          <span>News &amp; Highlights ({highlights.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('matches')}
          className={`shrink-0 pb-3 px-3 sm:px-4 font-display text-sm sm:text-base uppercase tracking-wide border-b-2 transition ${
            activeTab === 'matches'
              ? 'border-pl-blue text-pl-blue font-bold'
              : 'border-transparent text-gray-400 hover:text-gray-900'
          }`}
        >
          Schedule & Match Scores ({myMatches.length})
        </button>
        <button
          onClick={() => setActiveTab('draw')}
          className={`shrink-0 pb-3 px-3 sm:px-4 font-display text-sm sm:text-base uppercase tracking-wide border-b-2 transition flex items-center gap-2 ${
            activeTab === 'draw'
              ? 'border-pl-blue text-pl-blue font-bold'
              : 'border-transparent text-gray-400 hover:text-gray-900'
          }`}
        >
          <Shuffle className="w-4 h-4 text-amber-500" />
          <span>Official Knockout Draw</span>
          {knockoutDraw.isDrawn && (
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('draw')}
          className="shrink-0 pb-3 px-3 sm:px-4 font-display text-sm sm:text-base uppercase tracking-wide border-b-2 border-transparent text-gray-400 hover:text-gray-900 transition flex items-center gap-2"
        >
          <Calendar className="w-4 h-4 text-pl-blue" />
          <span>League Draw</span>
          {matches.some((match) => match.phase === 'league') && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
        </button>
      </div>

      {/* TAB 1: SQUAD REGISTRATION */}
      {activeTab === 'squad' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Player Form */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 h-fit space-y-4">
            <div>
              <h3 className="font-display text-2xl text-pl-black uppercase italic">
                REGISTER SQUAD PLAYER
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Players registered here will immediately show up on your department page.
              </p>
            </div>

            {squadSuccess && (
              <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl text-xs font-bold border border-emerald-200 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Player registered successfully!</span>
              </div>
            )}

            <form onSubmit={handleAddPlayer} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Player Full Name</label>
                <input
                  type="text"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  placeholder="e.g. Riyad Mahrez"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-pl-blue text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Kit Number</label>
                  <input
                    type="number"
                    value={newPlayerNumber}
                    onChange={(e) => setNewPlayerNumber(parseInt(e.target.value) || 1)}
                    min={1}
                    max={99}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-pl-blue text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Position</label>
                  <select
                    value={newPlayerPos}
                    onChange={(e) => setNewPlayerPos(e.target.value as 'GK' | 'DEF' | 'MID' | 'FWD')}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-pl-blue text-sm"
                  >
                    <option value="GK">Goalkeeper (GK)</option>
                    <option value="DEF">Defender (DEF)</option>
                    <option value="MID">Midfielder (MID)</option>
                    <option value="FWD">Forward (FWD)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-pl-blue hover:bg-pl-blue-accent text-white font-bold py-3 rounded-xl uppercase tracking-wider flex items-center justify-center gap-2 shadow active:scale-95 transition mt-3"
              >
                <Plus className="w-4 h-4" />
                <span>Register to Squad</span>
              </button>
            </form>
          </div>

          {/* Current Registered Squad List */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-8 shadow-md border border-gray-200 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-display text-2xl text-pl-black uppercase italic">
                {myTeam.code} ACTIVE SQUAD ({myPlayers.length})
              </h3>
              <span className="text-xs text-gray-500 font-semibold">
                Autonomous Registration
              </span>
            </div>

            {myPlayers.length === 0 ? (
              <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300 space-y-2">
                <AlertCircle className="w-8 h-8 text-gray-400 mx-auto" />
                <p className="font-display text-xl text-gray-700 uppercase">No Players Registered Yet</p>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Use the registration form on the left to register your teammates. Once registered, your official squad list will be published live on the website.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {myPlayers.map((player) => (
                  <div key={player.id} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3.5">
                      <span className="w-8 h-8 rounded-lg bg-pl-blue text-white font-display text-sm flex items-center justify-center font-bold">
                        {player.number}
                      </span>
                      <div>
                        <span className="font-bold text-gray-900 block text-sm">
                          {player.name} {player.isCaptain && '(Captain)'}
                        </span>
                        <span className="text-gray-500 font-semibold">{player.position}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => removePlayer(player.id)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                      title="Remove player"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: MATCHES & SCORES */}
      {activeTab === 'matches' && (
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs text-amber-900 leading-relaxed">
            <strong>Autonomous Fixture Management:</strong> As captain, you can change the scheduled date, time, and venue, and record live or final scores for any fixture involving {myTeam.code}.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myMatches.map((m) => (
              <MatchEditorCard key={m.id} match={m} onUpdate={(updates) => updateMatch(m.id, updates)} canEditScore={false} />
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: OFFICIAL KNOCKOUT DRAW CEREMONY */}
      {activeTab === 'draw' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 text-pl-blue text-xs font-bold uppercase tracking-wider">
                <Calendar className="w-4 h-4" />
                League Phase Draw
              </div>
              <h2 className="font-display text-3xl uppercase italic mt-2">4 Matchdays. 32 Fixtures.</h2>
              <p className="text-xs text-gray-600 mt-1 max-w-xl leading-relaxed">Create the official four-round league schedule. Captains can then set each match&apos;s date, time, venue, and result from the schedule tab.</p>
            </div>
            <button onClick={handleLeagueDraw} disabled={isDrawing || !canRunLeagueDraw} className="shrink-0 bg-pl-blue hover:bg-pl-blue-accent disabled:opacity-50 text-white font-display text-lg uppercase px-6 py-3 rounded-xl shadow transition flex items-center gap-2" title={!canRunLeagueDraw ? 'Only the super admin can run the draw' : undefined}>
              <Shuffle className={isDrawing ? 'w-5 h-5 animate-spin' : 'w-5 h-5'} />
              {isDrawing ? 'Drawing...' : matches.some((match) => match.phase === 'league') ? 'Redraw League' : 'Run League Draw'}
            </button>
          </div>
          {leagueDrawComplete && <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl px-4 py-3 text-xs font-bold">League draw published. Open Schedule &amp; Match Scores to set venue and timing.</div>}
          <div className="bg-gradient-to-r from-pl-blue to-pl-blue-accent text-white p-6 sm:p-8 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-diagonal-pattern opacity-20 pointer-events-none" />
            <div className="relative z-10 space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <Shuffle className="w-4 h-4" />
                <span>Captains Autonomous Draw Ceremony</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl uppercase italic tracking-wider">
                RANDOMIZED KNOCKOUT DRAW
              </h2>
              <p className="text-white/85 text-xs sm:text-sm leading-relaxed">
                As per tournament rules, seeds 1 and 2 advance directly to the Semi-Finals. The 4 departments finishing 3rd to 6th in the League Standings enter a live randomized draw to establish the Play-off brackets.
              </p>
            </div>
          </div>

          {/* Current Standings Qualification Preview */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 space-y-4">
            <h3 className="font-display text-xl text-pl-black uppercase">
              Current League Qualification Standings
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-green-50 rounded-xl border border-green-200">
                <span className="text-[10px] font-bold text-green-700 uppercase block">Seed #1 (Direct SF)</span>
                <span className="font-display text-lg text-gray-900 block mt-1">{standings[0]?.team.code || 'TBD'}</span>
                <span className="text-gray-500 font-medium">{standings[0]?.points ?? 0} PTS</span>
              </div>
              <div className="p-3 bg-green-50 rounded-xl border border-green-200">
                <span className="text-[10px] font-bold text-green-700 uppercase block">Seed #2 (Direct SF)</span>
                <span className="font-display text-lg text-gray-900 block mt-1">{standings[1]?.team.code || 'TBD'}</span>
                <span className="text-gray-500 font-medium">{standings[1]?.points ?? 0} PTS</span>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 col-span-2">
                <span className="text-[10px] font-bold text-amber-700 uppercase block">Playoff Pool (Ranks 3rd - 6th)</span>
                <div className="flex items-center gap-3 mt-1 font-display text-lg text-gray-900">
                  <span>{standings[2]?.team.code || '3rd'}</span>
                  <span>•</span>
                  <span>{standings[3]?.team.code || '4th'}</span>
                  <span>•</span>
                  <span>{standings[4]?.team.code || '5th'}</span>
                  <span>•</span>
                  <span>{standings[5]?.team.code || '6th'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Draw Execution Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border border-gray-200 text-center space-y-6">
            {!knockoutDraw.isDrawn ? (
              <div className="space-y-4 max-w-md mx-auto">
                <p className="text-xs text-gray-600 leading-relaxed font-normal">
                  Click the button below to execute the live randomized draw. Framer Motion will shuffle the qualified teams and lock the Play-off pairings and Semi-Final ladders into the public website.
                </p>

                <button
                  onClick={handleTriggerDraw}
                  disabled={isDrawing}
                  className="bg-amber-400 hover:bg-amber-300 text-pl-black font-display text-xl uppercase px-8 py-3.5 rounded-xl font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2.5 mx-auto disabled:opacity-50"
                >
                  <Shuffle className={`w-5 h-5 ${isDrawing ? 'animate-spin' : ''}`} />
                  <span>{isDrawing ? 'Shuffling Qualified Teams...' : 'Conduct Official Knockout Draw'}</span>
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-emerald-50 text-emerald-900 p-4 rounded-xl border border-emerald-300 max-w-lg mx-auto">
                  <span className="font-display text-xl uppercase block">Draw Successfully Completed & Published!</span>
                  <p className="text-xs text-emerald-800 mt-1">
                    Drawn by Captain <strong>{knockoutDraw.drawnBy}</strong> on {new Date(knockoutDraw.drawnAt!).toLocaleString()}. The public bracket at <code className="bg-emerald-100 px-1 py-0.5 rounded">/bracket</code> is now updated.
                  </p>
                </div>

                {/* Display Drawn Fixtures */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-3xl mx-auto text-xs">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
                    <span className="font-display text-base text-pl-blue uppercase block">Play-off 1 Matchup</span>
                    <div className="flex items-center justify-between font-display text-lg">
                      <span>{knockoutDraw.playOff1?.home.code}</span>
                      <span className="text-pl-blue-accent">VS</span>
                      <span>{knockoutDraw.playOff1?.away.code}</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
                    <span className="font-display text-base text-pl-blue uppercase block">Play-off 2 Matchup</span>
                    <div className="flex items-center justify-between font-display text-lg">
                      <span>{knockoutDraw.playOff2?.home.code}</span>
                      <span className="text-pl-blue-accent">VS</span>
                      <span>{knockoutDraw.playOff2?.away.code}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-center gap-3">
                  <button
                    onClick={handleTriggerDraw}
                    className="text-xs bg-pl-blue text-white px-4 py-2 rounded-xl font-bold hover:bg-pl-blue-accent transition"
                  >
                    Re-draw / Shuffle Again
                  </button>
                  <button
                    onClick={resetKnockoutDraw}
                    className="text-xs bg-red-100 text-red-700 px-4 py-2 rounded-xl font-bold hover:bg-red-200 transition"
                  >
                    Reset Draw to Pending
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'news' && (
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] gap-8">
          <form onSubmit={handleHighlightSubmit} className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 space-y-4 h-fit">
            <div>
              <div className="flex items-center gap-2 text-pl-blue text-xs font-bold uppercase tracking-wider"><Newspaper className="w-4 h-4" /> Publisher desk</div>
              <h2 className="font-display text-3xl uppercase italic mt-2">{editingHighlightId ? 'Edit update' : 'Publish update'}</h2>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">Publish a live score, a photo news story, or a video highlight. Changes appear immediately on the public Highlights page.</p>
            </div>
            <label className="block text-xs font-bold text-gray-700">Content type
              <select value={highlightType} onChange={(event) => setHighlightType(event.target.value as typeof highlightType)} className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm">
                <option value="score">Live score</option><option value="article">Photo news article</option><option value="video">Highlight video</option>
              </select>
            </label>
            <label className="block text-xs font-bold text-gray-700">Title
              <input required value={highlightTitle} onChange={(event) => setHighlightTitle(event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm" placeholder="Matchday update" />
            </label>
            {highlightType === 'score' && <label className="block text-xs font-bold text-gray-700">Scoreline
              <input required value={highlightScoreline} onChange={(event) => setHighlightScoreline(event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm" placeholder="AUTO 2 - 1 DATA" />
            </label>}
            {highlightType !== 'score' && <><label className="block text-xs font-bold text-gray-700">{highlightType === 'article' ? 'Photo URL (optional when attaching a photo)' : 'Video link (YouTube, TikTok, or MP4)'}
              <input value={highlightMediaUrl} onChange={(event) => setHighlightMediaUrl(event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm" placeholder={highlightType === 'video' ? 'https://youtube.com/... or https://tiktok.com/...' : 'https://...'} />
            </label><label className="block text-xs font-bold text-gray-700">Attach {highlightType === 'article' ? 'a photo' : 'a video'} (optional)
              <input type="file" accept={highlightType === 'article' ? 'image/*' : 'video/*'} onChange={(event) => setHighlightMediaFile(event.target.files?.[0] || null)} className="mt-1.5 block w-full text-xs text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-xs file:font-bold file:text-pl-blue hover:file:bg-blue-100" />
              <span className="mt-1 block text-[10px] font-normal text-gray-500">Maximum 25 MB. Attach a file or provide a link.</span>
            </label></>}
            <label className="block text-xs font-bold text-gray-700">{highlightType === 'article' ? 'Caption' : 'Description'}
              <textarea required value={highlightDescription} onChange={(event) => setHighlightDescription(event.target.value)} rows={4} className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm resize-y" placeholder="Tell supporters what happened..." />
            </label>
            <div className="flex gap-2"><button className="flex-1 rounded-lg bg-pl-blue py-3 text-white font-bold uppercase text-xs hover:bg-pl-blue-accent transition">{editingHighlightId ? 'Save changes' : 'Publish update'}</button>{editingHighlightId && <button type="button" onClick={resetHighlightForm} className="rounded-lg border border-gray-300 px-4 text-xs font-bold">Cancel</button>}</div>
          </form>

          <div className="space-y-3">
            {highlights.map((item) => <div key={item.id} className="bg-white rounded-xl p-4 border border-gray-200 flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg bg-pl-blue/10 flex items-center justify-center text-pl-blue shrink-0">{item.contentType === 'video' ? <Video className="w-5 h-5" /> : item.contentType === 'score' ? <Trophy className="w-5 h-5" /> : <Newspaper className="w-5 h-5" />}</div>
              <div className="min-w-0 flex-1"><p className="text-[10px] font-bold uppercase tracking-wider text-pl-blue">{item.contentType || 'article'}</p><h3 className="font-display text-xl uppercase truncate">{item.title}</h3><p className="text-xs text-gray-500 truncate">{item.caption || item.description}</p></div>
              <button onClick={() => editHighlight(item)} className="p-2 text-pl-blue hover:bg-blue-50 rounded-lg" title="Edit update"><Edit3 className="w-4 h-4" /></button>
              <button onClick={() => removeHighlight(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Delete update"><Trash2 className="w-4 h-4" /></button>
            </div>)}
          </div>
        </div>
      )}
    </div>
  );
}

function MatchEditorCard({
  match,
  onUpdate,
  canEditScore,
}: {
  match: Match;
  onUpdate: (updates: Partial<Match>) => void;
  canEditScore: boolean;
}) {
  const [homeScore, setHomeScore] = useState<number>(match.homeScore ?? 0);
  const [awayScore, setAwayScore] = useState<number>(match.awayScore ?? 0);
  const [status, setStatus] = useState<MatchStatus>(match.status);
  const [venue, setVenue] = useState<string>(match.venue);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onUpdate({
      ...(canEditScore ? {
        homeScore: status === 'scheduled' ? null : homeScore,
        awayScore: status === 'scheduled' ? null : awayScore,
        status,
      } : {}),
      venue,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-200 space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-2 text-xs">
        <span className="font-display text-base text-pl-blue uppercase">{match.roundLabel || `Matchday ${match.matchday}`}</span>
        {match.lastUpdatedBy && (
          <span className="text-[10px] text-gray-400">Last updated by {match.lastUpdatedBy}</span>
        )}
      </div>

      <div className="flex items-center justify-between gap-2">
        {/* Home */}
        <div className="flex items-center gap-2 flex-1">
          <div className="relative w-10 h-10 flex-shrink-0">
            <Image src={match.homeTeam.badgeUrl} alt={match.homeTeam.name} fill className="object-contain" />
          </div>
          <span className="font-display text-xl">{match.homeTeam.code}</span>
        </div>

        {/* Scores */}
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={homeScore}
            onChange={(e) => setHomeScore(parseInt(e.target.value) || 0)}
            min={0}
            className="w-12 py-1.5 text-center font-display text-2xl border rounded-lg"
            disabled={!canEditScore || status === 'scheduled'}
          />
          <span className="font-display text-lg text-gray-400">:</span>
          <input
            type="number"
            value={awayScore}
            onChange={(e) => setAwayScore(parseInt(e.target.value) || 0)}
            min={0}
            className="w-12 py-1.5 text-center font-display text-2xl border rounded-lg"
            disabled={!canEditScore || status === 'scheduled'}
          />
        </div>

        {/* Away */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          <span className="font-display text-xl">{match.awayTeam.code}</span>
          <div className="relative w-10 h-10 flex-shrink-0">
            <Image src={match.awayTeam.badgeUrl} alt={match.awayTeam.name} fill className="object-contain" />
          </div>
        </div>
      </div>

      {/* Status & Venue controls */}
      <div className="grid grid-cols-2 gap-3 text-xs pt-1">
        <div>
          <label className="block text-gray-500 font-bold mb-1">Match Status</label>
          {canEditScore ? <select
            value={status}
            onChange={(e) => setStatus(e.target.value as MatchStatus)}
            className="w-full px-2 py-2 border rounded-lg font-semibold"
          >
            <option value="scheduled">Scheduled</option>
            <option value="live">LIVE</option>
            <option value="finished">Finished (Full Time)</option>
          </select> : <div className="w-full px-2 py-2 border rounded-lg bg-gray-50 font-semibold text-gray-600">{match.status}</div>}
        </div>
        <div>
          <label className="block text-gray-500 font-bold mb-1">Venue</label>
          <input
            type="text"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            placeholder="Leave blank to remove venue"
            className="w-full px-2 py-2 border rounded-lg font-semibold"
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition ${
          saved
            ? 'bg-emerald-600 text-white'
            : 'bg-pl-blue hover:bg-pl-blue-accent text-white shadow'
        }`}
      >
        {saved ? <Check className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
        <span>{saved ? 'Changes Saved!' : 'Save Match Updates'}</span>
      </button>
    </div>
  );
}
