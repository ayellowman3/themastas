'use client';

import { useState } from 'react';

interface ScorecardData {
  holes: number[];
  yds: number[];
  par: number[];
  hcp: number[];
}

interface ScorecardProps {
  courseName: string;
  data: ScorecardData;
  format?: 'best-ball' | 'scramble';
  team1Players?: string[];
  team2Players?: string[];
}

export default function Scorecard({ courseName, data, format = 'scramble', team1Players = [], team2Players = [] }: ScorecardProps) {
  const isScramble = format === 'scramble';
  const [team1Scores, setTeam1Scores] = useState<Record<number, string>>({});
  const [team2Scores, setTeam2Scores] = useState<Record<number, string>>({});
  const [team1PlayerScores, setTeam1PlayerScores] = useState<Record<string, Record<number, string>>>({});
  const [team2PlayerScores, setTeam2PlayerScores] = useState<Record<string, Record<number, string>>>({});
  const isSingleNine = data.holes.length <= 9;

  const handleTeam1ScoreChange = (hole: number, value: string) => {
    setTeam1Scores({ ...team1Scores, [hole]: value });
  };

  const handleTeam2ScoreChange = (hole: number, value: string) => {
    setTeam2Scores({ ...team2Scores, [hole]: value });
  };

  const handleTeam1PlayerScoreChange = (playerName: string, hole: number, value: string) => {
    setTeam1PlayerScores({
      ...team1PlayerScores,
      [playerName]: { ...(team1PlayerScores[playerName] || {}), [hole]: value },
    });
  };

  const handleTeam2PlayerScoreChange = (playerName: string, hole: number, value: string) => {
    setTeam2PlayerScores({
      ...team2PlayerScores,
      [playerName]: { ...(team2PlayerScores[playerName] || {}), [hole]: value },
    });
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
    'h-8 w-10 rounded-lg border border-white/70 bg-white/90 text-center text-xs font-semibold text-slate-700 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 dark:border-slate-600 dark:bg-slate-800/90 dark:text-slate-100 dark:focus:border-emerald-500 dark:focus:ring-emerald-900';
  const labelBaseClassName =
    'border px-2 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.18em]';
  const team1LabelClassName = `${labelBaseClassName} bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-200`;
  const team2LabelClassName = `${labelBaseClassName} bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-200`;
  const statCellClassName =
    'border px-2 py-2 text-center text-[11px] font-semibold text-slate-600 dark:text-slate-300';
  const summaryOutClassName = 'border px-2 py-2 text-center text-[11px] font-semibold bg-sky-50 text-sky-700 dark:bg-sky-950/70 dark:text-sky-200';
  const summaryInClassName = 'border px-2 py-2 text-center text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-200';
  const summaryTotalClassName = 'border px-2 py-2 text-center text-[11px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-200';
  const emptySummaryClassName = 'border px-2 py-2 bg-slate-50 dark:bg-slate-800/80';

  const getSectionTitle = (isBack: boolean) => {
    if (isSingleNine) return courseName;
    return isBack ? `${courseName} · Back Nine` : `${courseName} · Front Nine`;
  };

  const renderNine = (nine: typeof frontNine, isBack: boolean = false) => {
    const scoreColumnLabel = isSingleNine ? 'Tot' : isBack ? 'In' : 'Out';

    return (
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/60">
        <div className="flex items-center justify-between border-b border-slate-200/70 bg-gradient-to-r from-slate-50 via-white to-emerald-50 px-4 py-3 dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/40">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{getSectionTitle(isBack)}</p>
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{isScramble ? 'Team scoring' : 'Player scoring'}</p>
          </div>
          <div className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white dark:bg-slate-100 dark:text-slate-900">
            {isScramble ? 'Scramble' : 'Best Ball'}
          </div>
        </div>
        <table className="w-full min-w-[760px] border-collapse text-xs">
        <thead>
          <tr className="bg-slate-100/90 text-slate-600 dark:bg-slate-800 dark:text-slate-200">
            <th className="border px-2 py-2 text-left text-[11px] uppercase tracking-[0.18em]">Hole</th>
            {nine.holes.map((hole) => (
              <th key={hole} className="border px-2 py-2 text-center text-[11px]">{hole}</th>
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
                  <td className={team1LabelClassName}>{player}</td>
                  {nine.holes.map((hole, idx) => (
                    <td key={idx} className="border px-2 py-2 text-center text-xs">
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
                  <td className={team2LabelClassName}>{player}</td>
                  {nine.holes.map((hole, idx) => (
                    <td key={idx} className="border px-2 py-2 text-center text-xs">
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
              <td key={idx} className={statCellClassName}>{hcp}</td>
            ))}
            <td className={isSingleNine ? summaryTotalClassName : isBack ? emptySummaryClassName : emptySummaryClassName}></td>
            {isBack && <td className={emptySummaryClassName}></td>}
          </tr>
        </tbody>
      </table>
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
