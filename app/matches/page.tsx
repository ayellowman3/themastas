import PageContainer from '../../components/PageContainer';
import PrintButton from '../../components/PrintButton';
import SectionCard from '../../components/SectionCard';
import Scorecard from '../../components/Scorecard';
import {
  MATCHES,
  formatMatchPoints,
  getMatchAccent,
  getPairingPlayerDetails,
  getPairingPlayers,
  getPlayerNineHoleHandicaps,
  getScorecard,
  isPairingComplete,
  TEAM1_PLAYERS,
  TEAM2_PLAYERS,
} from '../../lib/tournament';

export default function Matches() {
  return (
    <PageContainer>
      <div className="print-matchbook">
      <SectionCard title="Matches">
        <div className="mb-6 overflow-hidden rounded-[24px] border border-slate-200/80 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-4 py-5 text-white shadow-xl print:hidden sm:mb-8 sm:rounded-[28px] sm:px-6 sm:py-7 dark:border-slate-700">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-200/80">Tournament Scorecards</p>
              <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">Every round, pairing, and live hole-by-hole card in one place.</h3>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
                Scores are now stored in a local SQLite database, so players can refresh and continue where they left off.
              </p>
            </div>
            <div className="flex flex-col items-start gap-3">
              <PrintButton />
            <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4 sm:gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Rounds</p>
                <p className="mt-1 text-2xl font-semibold">{MATCHES.length}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Pairings</p>
                <p className="mt-1 text-2xl font-semibold">{MATCHES.reduce((sum, match) => sum + match.pairings.length, 0)}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Formats</p>
                <p className="mt-1 text-2xl font-semibold">3</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Courses</p>
                <p className="mt-1 text-2xl font-semibold">2</p>
              </div>
            </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {MATCHES.map((match) => (
            <div
              key={match.round}
              className={`print-match-sheet overflow-hidden rounded-[24px] border bg-gradient-to-br p-1 shadow-lg sm:rounded-[28px] ${getMatchAccent(match.course).panel} ${getMatchAccent(match.course).border}`}
            >
              <div className="rounded-[20px] bg-white/90 p-4 backdrop-blur-sm sm:rounded-[24px] sm:p-5 dark:bg-slate-900/85">
                <div className="mb-4 flex flex-col gap-4 print:hidden lg:mb-5 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${getMatchAccent(match.course).badge}`}>
                        Match {match.round}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {match.course} Course
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {match.nine}
                      </span>
                    </div>
                    <p className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl dark:text-white">{match.format}</p>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                      {match.pairings.length} pairing{match.pairings.length === 1 ? '' : 's'} on {match.course === 'River' ? 'the River routing' : 'the Lakes routing'}.
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 sm:px-4 dark:border-slate-700 dark:bg-slate-800/80">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Pairings</p>
                      <p className="mt-1 text-lg font-semibold text-slate-900 sm:text-xl dark:text-white">{match.pairings.length}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 sm:px-4 dark:border-slate-700 dark:bg-slate-800/80">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Format</p>
                      <p className="mt-1 text-lg font-semibold text-slate-900 sm:text-xl dark:text-white">
                        {match.format.includes('Scramble') ? '2v2' : match.format.includes('Singles') ? '1v1' : '2v2'}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 sm:px-4 dark:border-slate-700 dark:bg-slate-800/80">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Course</p>
                      <p className="mt-1 text-lg font-semibold text-slate-900 sm:text-xl dark:text-white">{match.course}</p>
                    </div>
                  </div>
                </div>

                <div className="pairings-print-grid space-y-3 sm:space-y-4 print:space-y-2">
                  {match.pairings.map((pairing, idx) => {
                    const team1Players = getPairingPlayers(pairing.team1, TEAM1_PLAYERS);
                    const team2Players = getPairingPlayers(pairing.team2, TEAM2_PLAYERS);

                    return (
                      <div key={pairing.id} className="pairing-print-card overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
                        <div className="flex flex-col gap-3 border-b border-slate-200/80 bg-slate-50/90 px-4 py-4 dark:border-slate-700 dark:bg-slate-800/70 lg:flex-row lg:items-center lg:justify-between">
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Pairing {idx + 1}</p>
                            <p className="mt-1 text-base font-semibold text-slate-900 sm:text-lg dark:text-white">
                              {match.format.includes('Singles') ? 'Head-to-head singles' : 'Head-to-head pairing'}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <span className="rounded-full bg-sky-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-800 dark:bg-sky-950/80 dark:text-sky-200">
                              Team 1: {isPairingComplete(pairing) ? formatMatchPoints(pairing.team1Score) : 'Pending'}
                            </span>
                            <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-200">
                              Team 2: {isPairingComplete(pairing) ? formatMatchPoints(pairing.team2Score) : 'Pending'}
                            </span>
                          </div>
                        </div>

                        <div className="grid gap-3 p-3 sm:p-4 lg:grid-cols-2 print:gap-2 print:p-2">
                          <div className="rounded-2xl border border-sky-200/80 bg-gradient-to-br from-sky-50 to-white p-3 sm:p-4 dark:border-sky-900 dark:from-sky-950/40 dark:to-slate-900">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700 dark:text-sky-300">Team 1</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {getPairingPlayerDetails(pairing.team1, TEAM1_PLAYERS).map((player) => (
                                <div key={`team1-${player.number}`} className="rounded-2xl border border-sky-200/80 bg-white/90 px-3 py-2 shadow-sm dark:border-sky-900 dark:bg-slate-900/80">
                                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                    {player.name} <span className="text-slate-400">#{player.number}</span>
                                  </p>
                                  <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-sky-700 dark:text-sky-300">
                                    HI {player.handicapIndex} · 9HCP {player.nineHoleHandicap}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50 to-white p-3 sm:p-4 dark:border-emerald-900 dark:from-emerald-950/40 dark:to-slate-900">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">Team 2</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {getPairingPlayerDetails(pairing.team2, TEAM2_PLAYERS).map((player) => (
                                <div key={`team2-${player.number}`} className="rounded-2xl border border-emerald-200/80 bg-white/90 px-3 py-2 shadow-sm dark:border-emerald-900 dark:bg-slate-900/80">
                                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                    {player.name} <span className="text-slate-400">#{player.number}</span>
                                  </p>
                                  <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">
                                    HI {player.handicapIndex} · 9HCP {player.nineHoleHandicap}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="px-3 pb-3 sm:px-4 sm:pb-4 print:hidden">
                          <div className="rounded-[20px] border border-slate-200/80 bg-gradient-to-br from-white to-slate-50 p-2 sm:rounded-[24px] sm:p-3 dark:border-slate-700 dark:from-slate-900 dark:to-slate-950">
                            <Scorecard
                              pairingId={pairing.id}
                              courseName={`${match.course} - ${match.nine}`}
                              data={getScorecard(match.course, match.nine)}
                              format={match.format.includes('Scramble') ? 'scramble' : 'best-ball'}
                              team1Players={team1Players}
                              team2Players={team2Players}
                              team1PlayerHandicaps={getPlayerNineHoleHandicaps(team1Players)}
                              team2PlayerHandicaps={getPlayerNineHoleHandicaps(team2Players)}
                            />
                          </div>
                        </div>

                        <div className="hidden print:block print:px-2 print:pb-2">
                          <div className="pairing-print-scorecard rounded-[20px] border border-slate-200/80 bg-gradient-to-br from-white to-slate-50 p-2 sm:rounded-[24px] sm:p-3 dark:border-slate-700 dark:from-slate-900 dark:to-slate-950">
                            <Scorecard
                              pairingId={pairing.id}
                              courseName={`${match.course} - ${match.nine}`}
                              data={getScorecard(match.course, match.nine)}
                              format={match.format.includes('Scramble') ? 'scramble' : 'best-ball'}
                              printCompact
                              team1Players={team1Players}
                              team2Players={team2Players}
                              team1PlayerHandicaps={getPlayerNineHoleHandicaps(team1Players)}
                              team2PlayerHandicaps={getPlayerNineHoleHandicaps(team2Players)}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
      </div>
    </PageContainer>
  );
}
