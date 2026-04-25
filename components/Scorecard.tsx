'use client';

import { useRef, useState } from 'react';

import type { ScorecardData } from '../lib/tournament';

interface ScorecardProps {
  pairingId?: string;
  courseName: string;
  data: ScorecardData;
  format?: 'best-ball' | 'scramble';
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
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSingleNine = data.holes.length <= 9;

  const queueScoreSave = (payload: {
    side: 'team1' | 'team2';
    hole: number;
    score: string;
    playerName?: string;
  }) => {
    if (!pairingId) return;

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    setSaveState('saving');
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const parsedScore = payload.score.trim() === '' ? null : Number(payload.score);

        await fetch('/api/scorecards', {
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

        setSaveState('saved');
        if (saveResetRef.current) clearTimeout(saveResetRef.current);
        saveResetRef.current = setTimeout(() => setSaveState('idle'), 1500);
      } catch {
        setSaveState('error');
      }
    }, 250);
  };

  const handleTeam1ScoreChange = (hole: number, value: string) => {
    setTeam1Scores({ ...team1Scores, [hole]: value });
    queueScoreSave({ side: 'team1', hole, score: value });
  };

  const handleTeam2ScoreChange = (hole: number, value: string) => {
    setTeam2Scores({ ...team2Scores, [hole]: value });
    queueScoreSave({ side: 'team2', hole, score: value });
  };

  const handleTeam1PlayerScoreChange = (playerName: string, hole: number, value: string) => {
    setTeam1PlayerScores({
      ...team1PlayerScores,
      [playerName]: { ...(team1PlayerScores[playerName] || {}), [hole]: value },
    });
    queueScoreSave({ side: 'team1', hole, score: value, playerName });
  };

  const handleTeam2PlayerScoreChange = (playerName: string, hole: number, value: string) => {
    setTeam2PlayerScores({
      ...team2PlayerScores,
      [playerName]: { ...(team2PlayerScores[playerName] || {}), [hole]: value },
    });
    queueScoreSave({ side: 'team2', hole, score: value, playerName });
  };

  const frontNine = {
    holes: data.holes.slice(0, 9),
    yds: data.yds.slice(0, 9),
    par: data.par.slice(0, 9),
    hcp: data.hcp.slice(0, 9),
  };

  const backNine = {
    holes: data.holes.slice(9, 18),
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

  const renderNine = (nine: typeof frontNine, isBack: boolean = false) => {
    const scoreColumnLabel = isSingleNine ? 'Tot' : isBack ? 'In' : 'Out';
    const holeStrokeRanks = getHoleStrokeRanks(nine);

    return (
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/60">
        <div className="flex flex-col gap-2 border-b border-slate-200/70 bg-gradient-to-r from-slate-50 via-white to-emerald-50 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4 dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/40">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{getSectionTitle(isBack)}</p>
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{isScramble ? 'Team scoring' : 'Player scoring'}</p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {pairingId && (
              <span
                className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${
                  saveState === 'error'
                    ? 'text-rose-500 dark:text-rose-300'
                    : saveState === 'saved'
                      ? 'text-emerald-600 dark:text-emerald-300'
                      : 'text-slate-400'
                }`}
              >
                {saveState === 'saving' ? 'Saving' : saveState === 'saved' ? 'Saved' : saveState === 'error' ? 'Save failed' : 'Auto save'}
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
            <th className={isSingleNine ? summaryTotalClassName : isBack ? summaryInClassName : summaryOutClassName}>{scoreColumnLabel}</th>
            {isBack && <th className={summaryTotalClassName}>Tot</th>}
          </tr>
        </thead>
        <tbody className="bg-white/90 dark:bg-slate-900/70">
          <tr>
            <td className={statCellClassName}>Yards</td>
            {nine.yds.map((yds, idx) => (
              <td key={idx} className={statCellClassName}>{yds}</td>
            ))}
            <td className={isSingleNine ? summaryTotalClassName : isBack ? summaryInClassName : summaryOutClassName}>{isSingleNine ? frontYards : isBack ? backYards : frontYards}</td>
            {isBack && <td className={summaryTotalClassName}>{totalYards}</td>}
          </tr>
          <tr>
            <td className={statCellClassName}>Par</td>
            {nine.par.map((par, idx) => (
              <td key={idx} className={statCellClassName}>{par}</td>
            ))}
            <td className={isSingleNine ? summaryTotalClassName : isBack ? summaryInClassName : summaryOutClassName}>{isSingleNine ? frontTotal : isBack ? backTotal : frontTotal}</td>
            {isBack && <td className={summaryTotalClassName}>{totalPar}</td>}
          </tr>
          
          {isScramble ? (
            <>
              <tr>
                <td className={team1LabelClassName}>Team 1</td>
                {nine.holes.map((hole, idx) => (
                  <td key={idx} className="border px-2 py-2 text-center text-xs">
                    <input
                      type="number"
                      min="0"
                      max="13"
                      value={team1Scores[hole] || ''}
                      onChange={(e) => handleTeam1ScoreChange(hole, e.target.value)}
                      className={inputClassName}
                      placeholder="-"
                    />
                  </td>
                ))}
                <td className={isSingleNine ? summaryTotalClassName : isBack ? summaryInClassName : summaryOutClassName}>{(isSingleNine ? nine.holes : isBack ? backNine.holes : frontNine.holes).reduce((sum, h) => sum + (parseInt(team1Scores[h] || '0') || 0), 0) || '-'}</td>
                {isBack && <td className={summaryTotalClassName}>{(frontNine.holes.reduce((sum, h) => sum + (parseInt(team1Scores[h] || '0') || 0), 0) + backNine.holes.reduce((sum, h) => sum + (parseInt(team1Scores[h] || '0') || 0), 0)) || '-'}</td>}
              </tr>
              <tr>
                <td className={team2LabelClassName}>Team 2</td>
                {nine.holes.map((hole, idx) => (
                  <td key={idx} className="border px-2 py-2 text-center text-xs">
                    <input
                      type="number"
                      min="0"
                      max="13"
                      value={team2Scores[hole] || ''}
                      onChange={(e) => handleTeam2ScoreChange(hole, e.target.value)}
                      className={inputClassName}
                      placeholder="-"
                    />
                  </td>
                ))}
                <td className={isSingleNine ? summaryTotalClassName : isBack ? summaryInClassName : summaryOutClassName}>{(isSingleNine ? nine.holes : isBack ? backNine.holes : frontNine.holes).reduce((sum, h) => sum + (parseInt(team2Scores[h] || '0') || 0), 0) || '-'}</td>
                {isBack && <td className={summaryTotalClassName}>{(frontNine.holes.reduce((sum, h) => sum + (parseInt(team2Scores[h] || '0') || 0), 0) + backNine.holes.reduce((sum, h) => sum + (parseInt(team2Scores[h] || '0') || 0), 0)) || '-'}</td>}
              </tr>
            </>
          ) : (
            <>
              {team1Players.map((player) => (
                <tr key={`t1-${player}`}>
                  <td className={team1LabelClassName}>
                    <span className="block">{player}</span>
                    {!isScramble && (
                      <span className="mt-1 block text-[10px] normal-case tracking-normal text-sky-700/80 dark:text-sky-200/80">
                        9HCP {getPlayerHandicap(player) ?? '-'} · Gets {getStrokesReceived(player)}
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
                      <input
                        type="number"
                        min="0"
                        max="13"
                        value={team1PlayerScores[player]?.[hole] || ''}
                        onChange={(e) => handleTeam1PlayerScoreChange(player, hole, e.target.value)}
                        className={inputClassName}
                        placeholder="-"
                      />
                    </td>
                  ))}
                  <td className={isSingleNine ? summaryTotalClassName : isBack ? summaryInClassName : summaryOutClassName}>{((isSingleNine ? nine.holes : isBack ? backNine.holes : frontNine.holes).reduce((sum, h) => sum + (parseInt(team1PlayerScores[player]?.[h] || '0') || 0), 0)) || '-'}</td>
                  {isBack && <td className={summaryTotalClassName}>{(frontNine.holes.reduce((sum, h) => sum + (parseInt(team1PlayerScores[player]?.[h] || '0') || 0), 0) + backNine.holes.reduce((sum, h) => sum + (parseInt(team1PlayerScores[player]?.[h] || '0') || 0), 0)) || '-'}</td>}
                </tr>
              ))}
              {team2Players.map((player) => (
                <tr key={`t2-${player}`}>
                  <td className={team2LabelClassName}>
                    <span className="block">{player}</span>
                    {!isScramble && (
                      <span className="mt-1 block text-[10px] normal-case tracking-normal text-emerald-700/80 dark:text-emerald-200/80">
                        9HCP {getPlayerHandicap(player) ?? '-'} · Gets {getStrokesReceived(player)}
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
                      <input
                        type="number"
                        min="0"
                        max="13"
                        value={team2PlayerScores[player]?.[hole] || ''}
                        onChange={(e) => handleTeam2PlayerScoreChange(player, hole, e.target.value)}
                        className={inputClassName}
                        placeholder="-"
                      />
                    </td>
                  ))}
                  <td className={isSingleNine ? summaryTotalClassName : isBack ? summaryInClassName : summaryOutClassName}>{((isSingleNine ? nine.holes : isBack ? backNine.holes : frontNine.holes).reduce((sum, h) => sum + (parseInt(team2PlayerScores[player]?.[h] || '0') || 0), 0)) || '-'}</td>
                  {isBack && <td className={summaryTotalClassName}>{(frontNine.holes.reduce((sum, h) => sum + (parseInt(team2PlayerScores[player]?.[h] || '0') || 0), 0) + backNine.holes.reduce((sum, h) => sum + (parseInt(team2PlayerScores[player]?.[h] || '0') || 0), 0)) || '-'}</td>}
                </tr>
              ))}
            </>
          )}

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
        </tbody>
      </table>
      </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
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
