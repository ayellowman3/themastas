'use client';

import { useEffect, useRef, useState } from 'react';

import type { ScorecardData } from '../lib/tournament';

interface ScorecardProps {
  pairingId?: string;
  courseName: string;
  data: ScorecardData;
  format?: 'best-ball' | 'scramble';
  printCompact?: boolean;
  printCompactMatchup?: string;
  team1Players?: string[];
  team2Players?: string[];
  team1PlayerHandicaps?: Record<string, number>;
  team2PlayerHandicaps?: Record<string, number>;
  initialTeam1Scores?: Record<number, string>;
  initialTeam2Scores?: Record<number, string>;
  initialTeam1PlayerScores?: Record<string, Record<number, string>>;
  initialTeam2PlayerScores?: Record<string, Record<number, string>>;
}

export default function Scorecard({
  pairingId,
  courseName,
  data,
  format = 'scramble',
  printCompact = false,
  printCompactMatchup,
  team1Players = [],
  team2Players = [],
  team1PlayerHandicaps = {},
  team2PlayerHandicaps = {},
  initialTeam1Scores = {},
  initialTeam2Scores = {},
  initialTeam1PlayerScores = {},
  initialTeam2PlayerScores = {},
}: ScorecardProps) {
  const isScramble = format === 'scramble';
  const [team1Scores, setTeam1Scores] = useState<Record<number, string>>(initialTeam1Scores);
  const [team2Scores, setTeam2Scores] = useState<Record<number, string>>(initialTeam2Scores);
  const [team1PlayerScores, setTeam1PlayerScores] = useState<Record<string, Record<number, string>>>(initialTeam1PlayerScores);
  const [team2PlayerScores, setTeam2PlayerScores] = useState<Record<string, Record<number, string>>>(initialTeam2PlayerScores);
  const [hasLoadedInitialScores, setHasLoadedInitialScores] = useState(false);
  const [loadState, setLoadState] = useState<'idle' | 'loading' | 'loaded' | 'error'>('idle');
  const [loadErrorMessage, setLoadErrorMessage] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);
  const saveResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSingleNine = data.holes.length <= 9;

  useEffect(() => {
    if (!pairingId || hasLoadedInitialScores) return;

    let isCancelled = false;

    const loadScores = async () => {
      setLoadState('loading');
      try {
        const response = await fetch(`/api/scorecards?pairingId=${encodeURIComponent(pairingId)}`, {
          method: 'GET',
          cache: 'no-store',
        });

        if (!response.ok) {
          const errorPayload = await response.json().catch(() => null);
          throw new Error(errorPayload?.error || 'Failed to load saved scores');
        }

        const payload = await response.json();

        if (isCancelled) return;

        setTeam1Scores(payload.team1Scores || {});
        setTeam2Scores(payload.team2Scores || {});
        setTeam1PlayerScores(payload.team1PlayerScores || {});
        setTeam2PlayerScores(payload.team2PlayerScores || {});
        setHasLoadedInitialScores(true);
        setLoadState('loaded');
        setLoadErrorMessage(null);
      } catch (error) {
        if (!isCancelled) {
          setLoadState('error');
          setLoadErrorMessage(error instanceof Error ? error.message : 'Unknown load error');
        }
      }
    };

    loadScores();

    return () => {
      isCancelled = true;
    };
  }, [hasLoadedInitialScores, pairingId]);

  const queueScoreSave = async (payload: {
    side: 'team1' | 'team2';
    hole: number;
    score: string;
    playerName?: string;
  }) => {
    if (!pairingId) return;

    setSaveState('saving');
    try {
      const parsedScore = payload.score.trim() === '' ? null : Number(payload.score);

      const response = await fetch('/api/scorecards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pairingId,
          side: payload.side,
          hole: payload.hole,
          playerName: payload.playerName ?? null,
          score: Number.isFinite(parsedScore) ? parsedScore : null,
        }),
      });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => null);
        throw new Error(errorPayload?.error || 'Save failed');
      }

      setSaveState('saved');
      setSaveErrorMessage(null);
      if (saveResetRef.current) clearTimeout(saveResetRef.current);
      saveResetRef.current = setTimeout(() => setSaveState('idle'), 1500);
    } catch (error) {
      setSaveState('error');
      setSaveErrorMessage(error instanceof Error ? error.message : 'Unknown save error');
    }
  };

  const handleTeam1ScoreChange = (hole: number, value: string) => {
    const normalizedValue = normalizeScoreValue(value, hole);
    setTeam1Scores({ ...team1Scores, [hole]: normalizedValue });
    queueScoreSave({ side: 'team1', hole, score: normalizedValue });
  };

  const handleTeam2ScoreChange = (hole: number, value: string) => {
    const normalizedValue = normalizeScoreValue(value, hole);
    setTeam2Scores({ ...team2Scores, [hole]: normalizedValue });
    queueScoreSave({ side: 'team2', hole, score: normalizedValue });
  };

  const handleTeam1PlayerScoreChange = (playerName: string, hole: number, value: string) => {
    const normalizedValue = normalizeScoreValue(value, hole, playerName);
    setTeam1PlayerScores({
      ...team1PlayerScores,
      [playerName]: { ...(team1PlayerScores[playerName] || {}), [hole]: normalizedValue },
    });
    queueScoreSave({ side: 'team1', hole, score: normalizedValue, playerName });
  };

  const handleTeam2PlayerScoreChange = (playerName: string, hole: number, value: string) => {
    const normalizedValue = normalizeScoreValue(value, hole, playerName);
    setTeam2PlayerScores({
      ...team2PlayerScores,
      [playerName]: { ...(team2PlayerScores[playerName] || {}), [hole]: normalizedValue },
    });
    queueScoreSave({ side: 'team2', hole, score: normalizedValue, playerName });
  };

  const frontNine = {
    holes: data.holes.slice(0, 9),
    tees: data.tees?.slice(0, 9),
    yds: data.yds.slice(0, 9),
    par: data.par.slice(0, 9),
    hcp: data.hcp.slice(0, 9),
  };

  const backNine = {
    holes: data.holes.slice(9, 18),
    tees: data.tees?.slice(9, 18),
    yds: data.yds.slice(9, 18),
    par: data.par.slice(9, 18),
    hcp: data.hcp.slice(9, 18),
  };

  const frontTotal = frontNine.par.reduce((a, b) => a + b, 0);
  const backTotal = backNine.par.reduce((a, b) => a + b, 0);
  const totalPar = frontTotal + backTotal;

  const frontYards = frontNine.yds.reduce((a, b) => a + b, 0);
  const backYards = backNine.yds.reduce((a, b) => a + b, 0);
  const totalYards = frontYards + backYards;

  const inputClassName =
    'h-7 w-9 rounded-md border border-white/70 bg-white/90 text-center text-[11px] font-semibold text-slate-700 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 sm:h-8 sm:w-10 sm:rounded-lg sm:text-xs dark:border-slate-600 dark:bg-slate-800/90 dark:text-slate-100 dark:focus:border-emerald-500 dark:focus:ring-emerald-900';
  const labelBaseClassName =
    'sticky left-0 z-10 border px-2 py-2 text-left text-[10px] font-semibold uppercase tracking-[0.14em] sm:text-[11px] sm:tracking-[0.18em]';
  const team1LabelClassName = `${labelBaseClassName} bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-200`;
  const team2LabelClassName = `${labelBaseClassName} bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-200`;
  const statCellClassName =
    'border px-1.5 py-2 text-center text-[10px] font-semibold text-slate-600 sm:px-2 sm:text-[11px] dark:text-slate-300';
  const summaryOutClassName = 'border px-1.5 py-2 text-center text-[10px] font-semibold bg-sky-50 text-sky-700 sm:px-2 sm:text-[11px] dark:bg-sky-950/70 dark:text-sky-200';
  const summaryInClassName = 'border px-1.5 py-2 text-center text-[10px] font-semibold bg-emerald-50 text-emerald-700 sm:px-2 sm:text-[11px] dark:bg-emerald-950/70 dark:text-emerald-200';
  const summaryTotalClassName = 'border px-1.5 py-2 text-center text-[10px] font-semibold bg-amber-50 text-amber-700 sm:px-2 sm:text-[11px] dark:bg-amber-950/70 dark:text-amber-200';
  const emptySummaryClassName = 'border px-1.5 py-2 bg-slate-50 sm:px-2 dark:bg-slate-800/80';
  const allPlayerHandicaps = [...team1Players, ...team2Players]
    .map((player) => team1PlayerHandicaps[player] ?? team2PlayerHandicaps[player])
    .filter((handicap): handicap is number => handicap !== undefined);
  const lowestMatchHandicap = allPlayerHandicaps.length > 0 ? Math.min(...allPlayerHandicaps) : 0;
  const pointsPerSideForTie = team1Players.length === 1 && team2Players.length === 1 ? 0.25 : 0.5;

  const getSectionTitle = (isBack: boolean) => {
    if (isSingleNine) return courseName;
    return isBack ? `${courseName} · Back Nine` : `${courseName} · Front Nine`;
  };

  const getHoleStrokeRanks = (nine: typeof frontNine) => {
    const sortedHcp = [...nine.hcp].sort((a, b) => a - b);
    const rankMap = new Map<number, number>();
    sortedHcp.forEach((hcp, index) => {
      rankMap.set(hcp, index + 1);
    });
    return rankMap;
  };

  const getPlayerHandicap = (playerName: string) => team1PlayerHandicaps[playerName] ?? team2PlayerHandicaps[playerName];

  const getStrokesReceived = (playerName: string) => {
    const handicap = getPlayerHandicap(playerName);
    if (handicap === undefined) return 0;
    return Math.max(0, handicap - lowestMatchHandicap);
  };

  const getMatchHoleStrokeRanks = () => {
    const sortedHcp = [...data.hcp].sort((a, b) => a - b);
    const rankMap = new Map<number, number>();
    sortedHcp.forEach((hcp, index) => {
      rankMap.set(hcp, index + 1);
    });
    return rankMap;
  };

  const matchHoleStrokeRanks = getMatchHoleStrokeRanks();

  const playerGetsStrokeOnHole = (playerName: string, hole: number) => {
    const strokesReceived = getStrokesReceived(playerName);
    const holeIndex = data.holes.indexOf(hole);
    if (holeIndex === -1) return false;

    const strokeRank = matchHoleStrokeRanks.get(data.hcp[holeIndex]) ?? 99;
    return strokesReceived >= strokeRank;
  };

  const getHoleIndex = (hole: number) => data.holes.indexOf(hole);

  const getMaxGrossScoreForHole = (hole: number, playerName?: string) => {
    const holeIndex = getHoleIndex(hole);
    if (holeIndex === -1) return 13;

    const par = data.par[holeIndex];
    if (isScramble) {
      return par + 3;
    }

    const handicapStrokes = playerName && playerGetsStrokeOnHole(playerName, hole) ? 1 : 0;
    return par + 3 + handicapStrokes;
  };

  const normalizeScoreValue = (value: string, hole: number, playerName?: string) => {
    if (value.trim() === '') return '';

    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return value;

    return String(Math.min(parsed, getMaxGrossScoreForHole(hole, playerName)));
  };

  const parseScore = (value: string | undefined) => {
    if (!value) return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const getScrambleHoleScore = (scores: Record<number, string>, hole: number) => parseScore(scores[hole]);

  const getBestBallHoleScore = (players: string[], scoresByPlayer: Record<string, Record<number, string>>, hole: number) => {
    if (players.length === 0) return null;

    const scores = players
      .map((player) => {
        const grossScore = parseScore(scoresByPlayer[player]?.[hole]);
        if (grossScore === null) return null;

        const netAdjustment = playerGetsStrokeOnHole(player, hole) ? 1 : 0;
        return grossScore - netAdjustment;
      })
      .filter((score): score is number => score !== null);

    if (scores.length !== players.length) return null;
    return Math.min(...scores);
  };

  const getTeamHoleScore = (side: 'team1' | 'team2', hole: number) => {
    if (isScramble) {
      return side === 'team1'
        ? getScrambleHoleScore(team1Scores, hole)
        : getScrambleHoleScore(team2Scores, hole);
    }

    return side === 'team1'
      ? getBestBallHoleScore(team1Players, team1PlayerScores, hole)
      : getBestBallHoleScore(team2Players, team2PlayerScores, hole);
  };

  const matchHoles = data.holes;
  const holeOutcomes = matchHoles.map((hole) => {
    const team1Score = getTeamHoleScore('team1', hole);
    const team2Score = getTeamHoleScore('team2', hole);

    if (team1Score === null || team2Score === null) {
      return 'pending' as const;
    }

    if (team1Score < team2Score) return 'team1' as const;
    if (team2Score < team1Score) return 'team2' as const;
    return 'halve' as const;
  });

  const completedHoleCount = holeOutcomes.filter((outcome) => outcome !== 'pending').length;
  const team1HoleWins = holeOutcomes.filter((outcome) => outcome === 'team1').length;
  const team2HoleWins = holeOutcomes.filter((outcome) => outcome === 'team2').length;
  const halvedHoles = holeOutcomes.filter((outcome) => outcome === 'halve').length;
  const holeMargin = Math.abs(team1HoleWins - team2HoleWins);
  const allMatchHolesComplete = completedHoleCount === matchHoles.length;
  const leadingTeamLabel = team1HoleWins > team2HoleWins ? 'Team 1' : team2HoleWins > team1HoleWins ? 'Team 2' : null;

  const matchResultLabel = allMatchHolesComplete
    ? team1HoleWins === team2HoleWins
      ? 'Match halved'
      : `${leadingTeamLabel} wins ${holeMargin}UP`
    : completedHoleCount === 0
      ? 'Awaiting scores'
      : team1HoleWins === team2HoleWins
        ? `All square thru ${completedHoleCount}`
        : `${leadingTeamLabel} ${holeMargin}UP thru ${completedHoleCount}`;

  const tournamentPointsLabel = allMatchHolesComplete
    ? team1HoleWins === team2HoleWins
      ? `Each team earns ${pointsPerSideForTie} tournament points`
      : `${leadingTeamLabel} earns 1 tournament point`
    : 'Tournament points pending until all 9 holes are complete';

  const renderScoreField = (value: string | undefined) => {
    if (printCompact) {
      return (
        <div className="print-score-slot">
          {value ? <span>{value}</span> : null}
        </div>
      );
    }

    return null;
  };

  const renderNine = (nine: typeof frontNine, isBack: boolean = false) => {
    const scoreColumnLabel = isSingleNine ? 'Tot' : isBack ? 'In' : 'Out';
    const holeStrokeRanks = getHoleStrokeRanks(nine);

    return (
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/60">
        <div className="flex flex-col gap-2 border-b border-slate-200/70 bg-gradient-to-r from-slate-50 via-white to-emerald-50 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4 dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/40">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{getSectionTitle(isBack)}</p>
            {!printCompactMatchup && (
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{isScramble ? 'Team scoring' : 'Player scoring'}</p>
            )}
          </div>
          {printCompact && printCompactMatchup && (
            <div className="text-center text-[10px] font-semibold text-slate-700 dark:text-slate-200">
              {printCompactMatchup}
            </div>
          )}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {pairingId && !printCompact && (
              <span
                className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${
                  loadState === 'error' || saveState === 'error'
                    ? 'text-rose-500 dark:text-rose-300'
                    : saveState === 'saved'
                      ? 'text-emerald-600 dark:text-emerald-300'
                      : 'text-slate-400'
                }`}
              >
                {loadState === 'loading'
                  ? 'Loading'
                  : loadState === 'error'
                    ? 'Load failed'
                    : saveState === 'saving'
                      ? 'Saving'
                      : saveState === 'saved'
                        ? 'Saved'
                        : saveState === 'error'
                          ? 'Save failed'
                          : 'Auto save'}
              </span>
            )}
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 sm:hidden">
              Swipe table
            </span>
            <div className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white dark:bg-slate-100 dark:text-slate-900">
            {isScramble ? 'Scramble' : 'Best Ball'}
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-xs sm:min-w-[760px]">
        <thead>
          <tr className="bg-slate-100/90 text-slate-600 dark:bg-slate-800 dark:text-slate-200">
            <th className="sticky left-0 z-20 min-w-[88px] border bg-slate-100/95 px-2 py-2 text-left text-[10px] uppercase tracking-[0.14em] sm:min-w-[110px] sm:text-[11px] sm:tracking-[0.18em] dark:bg-slate-800/95">Hole</th>
            {nine.holes.map((hole) => (
              <th key={hole} className="border px-1.5 py-2 text-center text-[10px] sm:px-2 sm:text-[11px]">{hole}</th>
            ))}
            {!printCompact && <th className={isSingleNine ? summaryTotalClassName : isBack ? summaryInClassName : summaryOutClassName}>{scoreColumnLabel}</th>}
            {!printCompact && isBack && <th className={summaryTotalClassName}>Tot</th>}
          </tr>
        </thead>
        <tbody className="bg-white/90 dark:bg-slate-900/70">
          {nine.tees && (
            <tr>
              <td className={statCellClassName}>Tee</td>
              {nine.tees.map((tee, idx) => (
                <td key={idx} className={statCellClassName}>
                  <span className={`inline-flex rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] sm:text-[10px] ${
                    tee === 'Blue'
                      ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/70 dark:text-sky-200'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-200'
                  }`}>
                    {tee}
                  </span>
                </td>
              ))}
              {!printCompact && <td className={isSingleNine ? summaryTotalClassName : isBack ? emptySummaryClassName : emptySummaryClassName}></td>}
              {!printCompact && isBack && <td className={emptySummaryClassName}></td>}
            </tr>
          )}
          <tr>
            <td className={statCellClassName}>Yards</td>
            {nine.yds.map((yds, idx) => (
              <td key={idx} className={statCellClassName}>{yds}</td>
            ))}
            {!printCompact && <td className={isSingleNine ? summaryTotalClassName : isBack ? summaryInClassName : summaryOutClassName}>{isSingleNine ? frontYards : isBack ? backYards : frontYards}</td>}
            {!printCompact && isBack && <td className={summaryTotalClassName}>{totalYards}</td>}
          </tr>
          <tr>
            <td className={statCellClassName}>Par</td>
            {nine.par.map((par, idx) => (
              <td key={idx} className={statCellClassName}>{par}</td>
            ))}
            {!printCompact && <td className={isSingleNine ? summaryTotalClassName : isBack ? summaryInClassName : summaryOutClassName}>{isSingleNine ? frontTotal : isBack ? backTotal : frontTotal}</td>}
            {!printCompact && isBack && <td className={summaryTotalClassName}>{totalPar}</td>}
          </tr>
          
          {isScramble ? (
            <>
              <tr>
                <td className={team1LabelClassName}>Team 1</td>
                {nine.holes.map((hole, idx) => (
                  <td key={idx} className="border px-2 py-2 text-center text-xs">
                    {printCompact ? (
                      renderScoreField(team1Scores[hole])
                    ) : (
                      <input
                        type="number"
                        min="0"
                        max={getMaxGrossScoreForHole(hole)}
                        value={team1Scores[hole] || ''}
                        onChange={(e) => handleTeam1ScoreChange(hole, e.target.value)}
                        className={inputClassName}
                        placeholder={String(getMaxGrossScoreForHole(hole))}
                      />
                    )}
                  </td>
                ))}
                {!printCompact && <td className={isSingleNine ? summaryTotalClassName : isBack ? summaryInClassName : summaryOutClassName}>{(isSingleNine ? nine.holes : isBack ? backNine.holes : frontNine.holes).reduce((sum, h) => sum + (parseInt(team1Scores[h] || '0') || 0), 0) || '-'}</td>}
                {!printCompact && isBack && <td className={summaryTotalClassName}>{(frontNine.holes.reduce((sum, h) => sum + (parseInt(team1Scores[h] || '0') || 0), 0) + backNine.holes.reduce((sum, h) => sum + (parseInt(team1Scores[h] || '0') || 0), 0)) || '-'}</td>}
              </tr>
              <tr>
                <td className={team2LabelClassName}>Team 2</td>
                {nine.holes.map((hole, idx) => (
                  <td key={idx} className="border px-2 py-2 text-center text-xs">
                    {printCompact ? (
                      renderScoreField(team2Scores[hole])
                    ) : (
                      <input
                        type="number"
                        min="0"
                        max={getMaxGrossScoreForHole(hole)}
                        value={team2Scores[hole] || ''}
                        onChange={(e) => handleTeam2ScoreChange(hole, e.target.value)}
                        className={inputClassName}
                        placeholder={String(getMaxGrossScoreForHole(hole))}
                      />
                    )}
                  </td>
                ))}
                {!printCompact && <td className={isSingleNine ? summaryTotalClassName : isBack ? summaryInClassName : summaryOutClassName}>{(isSingleNine ? nine.holes : isBack ? backNine.holes : frontNine.holes).reduce((sum, h) => sum + (parseInt(team2Scores[h] || '0') || 0), 0) || '-'}</td>}
                {!printCompact && isBack && <td className={summaryTotalClassName}>{(frontNine.holes.reduce((sum, h) => sum + (parseInt(team2Scores[h] || '0') || 0), 0) + backNine.holes.reduce((sum, h) => sum + (parseInt(team2Scores[h] || '0') || 0), 0)) || '-'}</td>}
              </tr>
            </>
          ) : (
            <>
              {team1Players.map((player) => (
                <tr key={`t1-${player}`}>
                  <td className={team1LabelClassName}>
                    {printCompact ? (
                      <span className="block">
                        {`${player}-${getPlayerHandicap(player) ?? '-'}`}
                        {!isScramble && getStrokesReceived(player) > 0 && (
                          <span className="ml-1 inline-block h-2 w-2 rounded-full bg-sky-500 align-middle dark:bg-sky-300" />
                        )}
                      </span>
                    ) : (
                      <span className="block">{player}</span>
                    )}
                    {!isScramble && !printCompact && (
                      <span className="mt-1 block text-[10px] normal-case tracking-normal text-sky-700/80 dark:text-sky-200/80">
                        HCP {getPlayerHandicap(player) ?? '-'}{printCompact ? '' : ` · Gets ${getStrokesReceived(player)}`}
                      </span>
                    )}
                  </td>
                  {nine.holes.map((hole, idx) => (
                    <td
                      key={idx}
                      className={`border px-2 py-2 text-center text-xs ${
                        !isScramble && getStrokesReceived(player) >= (holeStrokeRanks.get(nine.hcp[idx]) ?? 99)
                          ? 'bg-sky-50/80 dark:bg-sky-950/40'
                          : ''
                      }`}
                    >
                      {!isScramble && getStrokesReceived(player) >= (holeStrokeRanks.get(nine.hcp[idx]) ?? 99) && (
                        <div className="mb-1 flex justify-center">
                          <span className="h-2 w-2 rounded-full bg-sky-500 dark:bg-sky-300" />
                        </div>
                      )}
                      {printCompact ? (
                        renderScoreField(team1PlayerScores[player]?.[hole])
                      ) : (
                        <input
                          type="number"
                          min="0"
                          max={getMaxGrossScoreForHole(hole, player)}
                          value={team1PlayerScores[player]?.[hole] || ''}
                          onChange={(e) => handleTeam1PlayerScoreChange(player, hole, e.target.value)}
                          className={inputClassName}
                          placeholder={String(getMaxGrossScoreForHole(hole, player))}
                        />
                      )}
                    </td>
                  ))}
                  {!printCompact && <td className={isSingleNine ? summaryTotalClassName : isBack ? summaryInClassName : summaryOutClassName}>{((isSingleNine ? nine.holes : isBack ? backNine.holes : frontNine.holes).reduce((sum, h) => sum + (parseInt(team1PlayerScores[player]?.[h] || '0') || 0), 0)) || '-'}</td>}
                  {!printCompact && isBack && <td className={summaryTotalClassName}>{(frontNine.holes.reduce((sum, h) => sum + (parseInt(team1PlayerScores[player]?.[h] || '0') || 0), 0) + backNine.holes.reduce((sum, h) => sum + (parseInt(team1PlayerScores[player]?.[h] || '0') || 0), 0)) || '-'}</td>}
                </tr>
              ))}
              {team2Players.map((player) => (
                <tr key={`t2-${player}`}>
                  <td className={team2LabelClassName}>
                    {printCompact ? (
                      <span className="block">
                        {`${player}-${getPlayerHandicap(player) ?? '-'}`}
                        {!isScramble && getStrokesReceived(player) > 0 && (
                          <span className="ml-1 inline-block h-2 w-2 rounded-full bg-emerald-500 align-middle dark:bg-emerald-300" />
                        )}
                      </span>
                    ) : (
                      <span className="block">{player}</span>
                    )}
                    {!isScramble && !printCompact && (
                      <span className="mt-1 block text-[10px] normal-case tracking-normal text-emerald-700/80 dark:text-emerald-200/80">
                        HCP {getPlayerHandicap(player) ?? '-'}{printCompact ? '' : ` · Gets ${getStrokesReceived(player)}`}
                      </span>
                    )}
                  </td>
                  {nine.holes.map((hole, idx) => (
                    <td
                      key={idx}
                      className={`border px-2 py-2 text-center text-xs ${
                        !isScramble && getStrokesReceived(player) >= (holeStrokeRanks.get(nine.hcp[idx]) ?? 99)
                          ? 'bg-emerald-50/80 dark:bg-emerald-950/40'
                          : ''
                      }`}
                    >
                      {!isScramble && getStrokesReceived(player) >= (holeStrokeRanks.get(nine.hcp[idx]) ?? 99) && (
                        <div className="mb-1 flex justify-center">
                          <span className="h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-300" />
                        </div>
                      )}
                      {printCompact ? (
                        renderScoreField(team2PlayerScores[player]?.[hole])
                      ) : (
                        <input
                          type="number"
                          min="0"
                          max={getMaxGrossScoreForHole(hole, player)}
                          value={team2PlayerScores[player]?.[hole] || ''}
                          onChange={(e) => handleTeam2PlayerScoreChange(player, hole, e.target.value)}
                          className={inputClassName}
                          placeholder={String(getMaxGrossScoreForHole(hole, player))}
                        />
                      )}
                    </td>
                  ))}
                  {!printCompact && <td className={isSingleNine ? summaryTotalClassName : isBack ? summaryInClassName : summaryOutClassName}>{((isSingleNine ? nine.holes : isBack ? backNine.holes : frontNine.holes).reduce((sum, h) => sum + (parseInt(team2PlayerScores[player]?.[h] || '0') || 0), 0)) || '-'}</td>}
                  {!printCompact && isBack && <td className={summaryTotalClassName}>{(frontNine.holes.reduce((sum, h) => sum + (parseInt(team2PlayerScores[player]?.[h] || '0') || 0), 0) + backNine.holes.reduce((sum, h) => sum + (parseInt(team2PlayerScores[player]?.[h] || '0') || 0), 0)) || '-'}</td>}
                </tr>
              ))}
            </>
          )}

          {!printCompact && (
            <tr>
              <td className={statCellClassName}>HCP</td>
              {nine.hcp.map((hcp, idx) => (
                <td key={idx} className={statCellClassName}>
                  <span className="block">{hcp}</span>
                  {!isScramble && (
                    <span className="mt-1 block text-[10px] text-slate-400">
                      {holeStrokeRanks.get(hcp)}
                    </span>
                  )}
                </td>
              ))}
              <td className={isSingleNine ? summaryTotalClassName : isBack ? emptySummaryClassName : emptySummaryClassName}></td>
              {isBack && <td className={emptySummaryClassName}></td>}
            </tr>
          )}
        </tbody>
      </table>
      </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {!printCompact && (
      <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-r from-slate-50 to-white px-4 py-3 dark:border-slate-700 dark:from-slate-900 dark:to-slate-950">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Match Play Result</p>
            <p className="mt-1 text-base font-semibold text-slate-900 dark:text-white">{matchResultLabel}</p>
          </div>
          <div className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white dark:bg-slate-100 dark:text-slate-900">
            {team1HoleWins}-{team2HoleWins}-{halvedHoles}
          </div>
        </div>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{tournamentPointsLabel}</p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Max score per hole: {isScramble ? 'triple bogey' : 'net triple bogey'}.
        </p>
        {!isScramble && (
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Hole winners are determined by net score. Enter gross scores; handicap strokes are applied automatically.
          </p>
        )}
        {loadErrorMessage && (
          <p className="mt-2 text-xs text-rose-600 dark:text-rose-300">Load error: {loadErrorMessage}</p>
        )}
        {saveErrorMessage && (
          <p className="mt-1 text-xs text-rose-600 dark:text-rose-300">Save error: {saveErrorMessage}</p>
        )}
      </div>
      )}
      {!isSingleNine && (
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{courseName}</h3>
      )}
      <div className="overflow-x-auto">
        {renderNine(frontNine, false)}
      </div>
      {!isSingleNine && (
        <div className="overflow-x-auto">
          {renderNine(backNine, true)}
        </div>
      )}
    </div>
  );
}
