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

  const renderNine = (nine: typeof frontNine, isBack: boolean = false) => {
    return (
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700">
            <th className="border px-1 py-1 text-left">Hole</th>
            {nine.holes.map((hole) => (
              <th key={hole} className="border px-1 py-1 text-center">{hole}</th>
            ))}
            {isBack && <th className="border px-1 py-1 text-center bg-green-50 dark:bg-green-900">In</th>}
            {isBack && <th className="border px-1 py-1 text-center bg-yellow-50 dark:bg-yellow-900">Tot</th>}
            {!isBack && <th className="border px-1 py-1 text-center bg-blue-50 dark:bg-blue-900">Out</th>}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-1 py-1 font-semibold text-xs">Yards</td>
            {nine.yds.map((yds, idx) => (
              <td key={idx} className="border px-1 py-1 text-center text-xs">{yds}</td>
            ))}
            {isBack && <td className="border px-1 py-1 text-center bg-green-50 dark:bg-green-900 font-semibold text-xs">{backYards}</td>}
            {isBack && <td className="border px-1 py-1 text-center bg-yellow-50 dark:bg-yellow-900 font-semibold text-xs">{totalYards}</td>}
            {!isBack && <td className="border px-1 py-1 text-center bg-blue-50 dark:bg-blue-900 font-semibold text-xs">{frontYards}</td>}
          </tr>
          <tr>
            <td className="border px-1 py-1 font-semibold text-xs">Par</td>
            {nine.par.map((par, idx) => (
              <td key={idx} className="border px-1 py-1 text-center text-xs">{par}</td>
            ))}
            {isBack && <td className="border px-1 py-1 text-center bg-green-50 dark:bg-green-900 font-semibold text-xs">{backTotal}</td>}
            {isBack && <td className="border px-1 py-1 text-center bg-yellow-50 dark:bg-yellow-900 font-semibold text-xs">{totalPar}</td>}
            {!isBack && <td className="border px-1 py-1 text-center bg-blue-50 dark:bg-blue-900 font-semibold text-xs">{frontTotal}</td>}
          </tr>
          
          {isScramble ? (
            <>
              <tr>
                <td className="border px-1 py-1 font-semibold text-xs text-blue-700 bg-blue-100 dark:bg-blue-900 dark:text-blue-200">Team 1</td>
                {nine.holes.map((hole, idx) => (
                  <td key={idx} className="border px-1 py-1 text-center text-xs">
                    <input
                      type="number"
                      min="0"
                      max="13"
                      value={team1Scores[hole] || ''}
                      onChange={(e) => handleTeam1ScoreChange(hole, e.target.value)}
                      className="w-8 h-6 text-center border border-gray-300 rounded text-xs"
                      placeholder="-"
                    />
                  </td>
                ))}
                {isBack && <td className="border px-1 py-1 text-center bg-green-50 dark:bg-green-900 font-semibold text-xs">{backNine.holes.reduce((sum, h) => sum + (parseInt(team1Scores[h] || '0') || 0), 0) || '-'}</td>}
                {isBack && <td className="border px-1 py-1 text-center bg-yellow-50 dark:bg-yellow-900 font-semibold text-xs">{(frontNine.holes.reduce((sum, h) => sum + (parseInt(team1Scores[h] || '0') || 0), 0) + backNine.holes.reduce((sum, h) => sum + (parseInt(team1Scores[h] || '0') || 0), 0)) || '-'}</td>}
                {!isBack && <td className="border px-1 py-1 text-center bg-blue-50 dark:bg-blue-900 font-semibold text-xs">{frontNine.holes.reduce((sum, h) => sum + (parseInt(team1Scores[h] || '0') || 0), 0) || '-'}</td>}
              </tr>
              <tr>
                <td className="border px-1 py-1 font-semibold text-xs text-green-700 bg-green-100 dark:bg-green-900 dark:text-green-200">Team 2</td>
                {nine.holes.map((hole, idx) => (
                  <td key={idx} className="border px-1 py-1 text-center text-xs">
                    <input
                      type="number"
                      min="0"
                      max="13"
                      value={team2Scores[hole] || ''}
                      onChange={(e) => handleTeam2ScoreChange(hole, e.target.value)}
                      className="w-8 h-6 text-center border border-gray-300 rounded text-xs"
                      placeholder="-"
                    />
                  </td>
                ))}
                {isBack && <td className="border px-1 py-1 text-center bg-green-50 dark:bg-green-900 font-semibold text-xs">{backNine.holes.reduce((sum, h) => sum + (parseInt(team2Scores[h] || '0') || 0), 0) || '-'}</td>}
                {isBack && <td className="border px-1 py-1 text-center bg-yellow-50 dark:bg-yellow-900 font-semibold text-xs">{(frontNine.holes.reduce((sum, h) => sum + (parseInt(team2Scores[h] || '0') || 0), 0) + backNine.holes.reduce((sum, h) => sum + (parseInt(team2Scores[h] || '0') || 0), 0)) || '-'}</td>}
                {!isBack && <td className="border px-1 py-1 text-center bg-green-50 dark:bg-green-900 font-semibold text-xs">{frontNine.holes.reduce((sum, h) => sum + (parseInt(team2Scores[h] || '0') || 0), 0) || '-'}</td>}
              </tr>
            </>
          ) : (
            <>
              {team1Players.map((player) => (
                <tr key={`t1-${player}`}>
                  <td className="border px-1 py-1 font-semibold text-xs text-blue-700 bg-blue-100 dark:bg-blue-900 dark:text-blue-200">{player}</td>
                  {nine.holes.map((hole, idx) => (
                    <td key={idx} className="border px-1 py-1 text-center text-xs">
                      <input
                        type="number"
                        min="0"
                        max="13"
                        value={team1PlayerScores[player]?.[hole] || ''}
                        onChange={(e) => handleTeam1PlayerScoreChange(player, hole, e.target.value)}
                        className="w-8 h-6 text-center border border-gray-300 rounded text-xs"
                        placeholder="-"
                      />
                    </td>
                  ))}
                  {isBack && <td className="border px-1 py-1 text-center bg-green-50 dark:bg-green-900 font-semibold text-xs">{backNine.holes.reduce((sum, h) => sum + (parseInt(team1PlayerScores[player]?.[h] || '0') || 0), 0) || '-'}</td>}
                  {isBack && <td className="border px-1 py-1 text-center bg-yellow-50 dark:bg-yellow-900 font-semibold text-xs">{(frontNine.holes.reduce((sum, h) => sum + (parseInt(team1PlayerScores[player]?.[h] || '0') || 0), 0) + backNine.holes.reduce((sum, h) => sum + (parseInt(team1PlayerScores[player]?.[h] || '0') || 0), 0)) || '-'}</td>}
                  {!isBack && <td className="border px-1 py-1 text-center bg-blue-50 dark:bg-blue-900 font-semibold text-xs">{frontNine.holes.reduce((sum, h) => sum + (parseInt(team1PlayerScores[player]?.[h] || '0') || 0), 0) || '-'}</td>}
                </tr>
              ))}
              {team2Players.map((player) => (
                <tr key={`t2-${player}`}>
                  <td className="border px-1 py-1 font-semibold text-xs text-green-700 bg-green-100 dark:bg-green-900 dark:text-green-200">{player}</td>
                  {nine.holes.map((hole, idx) => (
                    <td key={idx} className="border px-1 py-1 text-center text-xs">
                      <input
                        type="number"
                        min="0"
                        max="13"
                        value={team2PlayerScores[player]?.[hole] || ''}
                        onChange={(e) => handleTeam2PlayerScoreChange(player, hole, e.target.value)}
                        className="w-8 h-6 text-center border border-gray-300 rounded text-xs"
                        placeholder="-"
                      />
                    </td>
                  ))}
                  {isBack && <td className="border px-1 py-1 text-center bg-green-50 dark:bg-green-900 font-semibold text-xs">{backNine.holes.reduce((sum, h) => sum + (parseInt(team2PlayerScores[player]?.[h] || '0') || 0), 0) || '-'}</td>}
                  {isBack && <td className="border px-1 py-1 text-center bg-yellow-50 dark:bg-yellow-900 font-semibold text-xs">{(frontNine.holes.reduce((sum, h) => sum + (parseInt(team2PlayerScores[player]?.[h] || '0') || 0), 0) + backNine.holes.reduce((sum, h) => sum + (parseInt(team2PlayerScores[player]?.[h] || '0') || 0), 0)) || '-'}</td>}
                  {!isBack && <td className="border px-1 py-1 text-center bg-green-50 dark:bg-green-900 font-semibold text-xs">{frontNine.holes.reduce((sum, h) => sum + (parseInt(team2PlayerScores[player]?.[h] || '0') || 0), 0) || '-'}</td>}
                </tr>
              ))}
            </>
          )}

          <tr>
            <td className="border px-1 py-1 font-semibold text-xs">HCP</td>
            {nine.hcp.map((hcp, idx) => (
              <td key={idx} className="border px-1 py-1 text-center text-xs">{hcp}</td>
            ))}
            {isBack && <td className="border px-1 py-1 text-center bg-gray-50 dark:bg-gray-800"></td>}
            {isBack && <td className="border px-1 py-1 text-center bg-gray-50 dark:bg-gray-800"></td>}
            {!isBack && <td className="border px-1 py-1 text-center bg-gray-50 dark:bg-gray-800"></td>}
          </tr>
        </tbody>
      </table>
    );
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4">{courseName}</h3>
      
      {/* Front Nine */}
      <div className="mb-6 overflow-x-auto">
        {renderNine(frontNine, false)}
      </div>

      {/* Back Nine */}
      <div className="overflow-x-auto">
        {renderNine(backNine, true)}
      </div>
    </div>
  );
}
