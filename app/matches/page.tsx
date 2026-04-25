import PageContainer from '../../components/PageContainer';
import SectionCard from '../../components/SectionCard';
import Scorecard from '../../components/Scorecard';

const TEAM1_PLAYERS = {
  '1': 'Kyung',
  '2': 'Tommy',
  '3': 'George',
  '4': 'Justin',
  '5': 'Paul',
  '6': 'Stephen',
};

const TEAM2_PLAYERS = {
  '1': 'Min Woo',
  '2': 'Andy',
  '3': 'Terry',
  '4': 'Huey',
  '5': 'Alex',
  '6': 'Sam',
};

const PLAYER_HANDICAPS = {
  Kyung: { index: 7, nineHole: 6 },
  Tommy: { index: 12, nineHole: 10 },
  George: { index: 12, nineHole: 10 },
  Justin: { index: 14, nineHole: 12 },
  Paul: { index: 13, nineHole: 12 },
  Stephen: { index: 17, nineHole: 15 },
  'Min Woo': { index: 10, nineHole: 9 },
  Andy: { index: 11, nineHole: 9 },
  Terry: { index: 12, nineHole: 10 },
  Huey: { index: 17, nineHole: 15 },
  Alex: { index: 16, nineHole: 14 },
  Sam: { index: 17, nineHole: 15 },
} as const;

const SCORECARD_DATA = {
  riversaints: {
    holes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    yds: [336, 142, 383, 333, 475, 345, 433, 160, 360, 418, 524, 307, 131, 387, 385, 174, 341, 502],
    par: [4, 3, 4, 4, 5, 4, 5, 3, 4, 4, 5, 4, 3, 4, 4, 3, 4, 5],
    hcp: [15, 17, 5, 7, 11, 13, 1, 9, 3, 2, 10, 12, 18, 8, 4, 16, 14, 6],
  },
  lakes: {
    holes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    yds: [335, 345, 142, 425, 395, 375, 343, 151, 325, 379, 140, 490, 430, 385, 495, 345, 180, 328],
    par: [4, 4, 3, 5, 4, 4, 4, 3, 4, 4, 3, 5, 4, 4, 5, 4, 3, 4],
    hcp: [15, 7, 17, 5, 1, 3, 9, 11, 13, 8, 16, 12, 2, 4, 6, 14, 10, 18],
  },
};

function getScorecard(course: string, nine: string) {
  const courseData = course === 'River' ? SCORECARD_DATA.riversaints : SCORECARD_DATA.lakes;
  
  if (nine === 'Front 9') {
    return {
      holes: courseData.holes.slice(0, 9),
      yds: courseData.yds.slice(0, 9),
      par: courseData.par.slice(0, 9),
      hcp: courseData.hcp.slice(0, 9),
    };
  } else {
    return {
      holes: courseData.holes.slice(9, 18),
      yds: courseData.yds.slice(9, 18),
      par: courseData.par.slice(9, 18),
      hcp: courseData.hcp.slice(9, 18),
    };
  }
}

function getPairingPlayers(playerString: string, teamPlayers: Record<string, string>): string[] {
  if (playerString === 'TBD') return [];

  return playerString
    .split(' & ')
    .map((p) => {
      const num = p.trim().replace('#', '');
      return teamPlayers[num];
    })
    .filter(Boolean);
}

function getPairingPlayerDetails(playerString: string, teamPlayers: Record<string, string>) {
  if (playerString === 'TBD') return [];

  return playerString
    .split(' & ')
    .map((p) => {
      const number = p.trim().replace('#', '');
      const name = teamPlayers[number];
      const handicap = PLAYER_HANDICAPS[name as keyof typeof PLAYER_HANDICAPS];

      if (!name || !handicap) return null;

      return {
        number,
        name,
        handicapIndex: handicap.index,
        nineHoleHandicap: handicap.nineHole,
      };
    })
    .filter(Boolean);
}

function getPlayerNineHoleHandicaps(players: string[]) {
  return Object.fromEntries(
    players
      .map((player) => {
        const handicap = PLAYER_HANDICAPS[player as keyof typeof PLAYER_HANDICAPS];
        return handicap ? [player, handicap.nineHole] : null;
      })
      .filter(Boolean) as Array<[string, number]>
  );
}

function getMatchAccent(course: string) {
  return course === 'River'
    ? {
        panel: 'from-sky-500/10 via-cyan-500/5 to-emerald-500/10 dark:from-sky-500/15 dark:via-cyan-500/10 dark:to-emerald-500/15',
        badge: 'bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-200',
        border: 'border-sky-300/70 dark:border-sky-700/70',
      }
    : {
        panel: 'from-amber-500/10 via-orange-500/5 to-lime-500/10 dark:from-amber-500/15 dark:via-orange-500/10 dark:to-lime-500/15',
        badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-200',
        border: 'border-amber-300/70 dark:border-amber-700/70',
      };
}

function formatMatchPoints(score: number | null) {
  if (score === null) return 'Pending';
  if (score === 0.5) return '0.5 pts';
  return `${score} pt`;
}

function isPairingComplete(pairing: { team1Score: number | null; team2Score: number | null; completed?: boolean }) {
  return pairing.completed === true && pairing.team1Score !== null && pairing.team2Score !== null;
}

export default function Matches() {
  const matches = [
    {
      round: 1,
      course: 'River',
      nine: 'Front 9',
      format: '2-man Best Ball',
      pairings: [
        { team1: '#1 & #4', team2: '#4 & #5', team1Score: null, team2Score: null },
        { team1: '#3 & #5', team2: '#2 & #6', team1Score: null, team2Score: null },
        { team1: '#2 & #6', team2: '#1 & #3', team1Score: null, team2Score: null },
      ]
    },
    {
      round: 2,
      course: 'Lakes',
      nine: 'Front 9',
      format: '2-man Scramble',
      pairings: [
        { team1: '#2 & #3', team2: '#5 & #6', team1Score: null, team2Score: null },
        { team1: '#5 & #6', team2: '#1 & #4', team1Score: null, team2Score: null },
        { team1: '#1 & #4', team2: '#2 & #3', team1Score: null, team2Score: null },
      ]
    },
    {
      round: 3,
      course: 'River',
      nine: 'Back 9',
      format: '2-man Scramble',
      pairings: [
        { team1: '#1 & #6', team2: '#1 & #6', team1Score: 1, team2Score: 0 },
        { team1: '#2 & #3', team2: '#2 & #4', team1Score: 0.5, team2Score: 0.5 },
        { team1: '#4 & #5', team2: '#3 & #5', team1Score: 0.5, team2Score: 0.5 },
      ]
    },
    {
      round: 4,
      course: 'Lakes',
      nine: 'Front 9',
      format: '2-man Best Ball',
      pairings: [
        { team1: '#4 & #5', team2: '#1 & #2', team1Score: 1, team2Score: 0 },
        { team1: '#1 & #2', team2: '#3 & #6', team1Score: 0, team2Score: 1 },
        { team1: '#3 & #6', team2: '#4 & #5', team1Score: 0, team2Score: 1 },
      ]
    },
    {
      round: 5,
      course: 'Lakes',
      nine: 'Back 9',
      format: '2-man Best Ball',
      pairings: [
        { team1: '#3 & #6', team2: '#2 & #3', team1Score: 1, team2Score: 0 },
        { team1: '#2 & #4', team2: '#1 & #5', team1Score: 0, team2Score: 1 },
        { team1: '#1 & #5', team2: '#4 & #6', team1Score: 0, team2Score: 1 },
      ]
    },
    {
      round: 6,
      course: 'River',
      nine: 'Front 9',
      format: '2-man Scramble',
      pairings: [
        { team1: '#2 & #5', team2: '#3 & #4', team1Score: null, team2Score: null },
        { team1: '#1 & #6', team2: '#2 & #5', team1Score: null, team2Score: null },
        { team1: '#3 & #4', team2: '#1 & #6', team1Score: null, team2Score: null },
      ]
    },
    {
      round: 7,
      course: 'River',
      nine: 'Back 9',
      format: '2-man Scramble',
      pairings: [
        { team1: '#1 & #3', team2: '#1 & #3', team1Score: null, team2Score: null },
        { team1: '#4 & #6', team2: '#4 & #6', team1Score: null, team2Score: null },
        { team1: '#2 & #5', team2: '#2 & #5', team1Score: null, team2Score: null },
      ]
    },
    {
      round: 8,
      course: 'River',
      nine: 'Front 9',
      format: '1v1 - Singles',
      pairings: [
        { team1: '#1', team2: '#1', team1Score: null, team2Score: null },
        { team1: '#2', team2: '#2', team1Score: null, team2Score: null },
        { team1: '#3', team2: '#3', team1Score: null, team2Score: null },
        { team1: '#4', team2: '#4', team1Score: null, team2Score: null },
        { team1: '#5', team2: '#5', team1Score: null, team2Score: null },
        { team1: '#6', team2: '#6', team1Score: null, team2Score: null },
      ]
    },
  ];

  return (
    <PageContainer>
      <SectionCard title="Matches">
        <div className="mb-8 overflow-hidden rounded-[28px] border border-slate-200/80 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-6 py-7 text-white shadow-xl dark:border-slate-700">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-200/80">Tournament Scorecards</p>
              <h3 className="text-3xl font-semibold tracking-tight">Every round, pairing, and live hole-by-hole card in one place.</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Browse each matchup by course and format, then drop scores directly into the card below the pairing.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Rounds</p>
                <p className="mt-1 text-2xl font-semibold">{matches.length}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Pairings</p>
                <p className="mt-1 text-2xl font-semibold">{matches.reduce((sum, match) => sum + match.pairings.length, 0)}</p>
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
        <div className="space-y-8">
          {matches.map((match) => (
            <div
              key={match.round}
              className={`overflow-hidden rounded-[28px] border bg-gradient-to-br p-1 shadow-lg ${getMatchAccent(match.course).panel} ${getMatchAccent(match.course).border}`}
            >
              <div className="rounded-[24px] bg-white/90 p-5 backdrop-blur-sm dark:bg-slate-900/85">
                <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
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
                    <p className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">{match.format}</p>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                      {match.pairings.length} pairing{match.pairings.length === 1 ? '' : 's'} on {match.course === 'River' ? 'the River routing' : 'the Lakes routing'}.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/80">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Pairings</p>
                      <p className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">{match.pairings.length}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/80">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Format</p>
                      <p className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">{match.format.includes('Scramble') ? '2v2' : match.format.includes('Singles') ? '1v1' : '2v2'}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/80">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Course</p>
                      <p className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">{match.course}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {match.pairings.map((pairing, idx) => (
                    <div key={idx} className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
                      <div className="flex flex-col gap-3 border-b border-slate-200/80 bg-slate-50/90 px-4 py-4 dark:border-slate-700 dark:bg-slate-800/70 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Pairing {idx + 1}</p>
                          <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
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

                      <div className="grid gap-3 p-4 lg:grid-cols-2">
                        <div className="rounded-2xl border border-sky-200/80 bg-gradient-to-br from-sky-50 to-white p-4 dark:border-sky-900 dark:from-sky-950/40 dark:to-slate-900">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700 dark:text-sky-300">Team 1</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {getPairingPlayerDetails(pairing.team1, TEAM1_PLAYERS).map((player) => (
                              <div key={`team1-${player.number}`} className="rounded-2xl border border-sky-200/80 bg-white/90 px-3 py-2 shadow-sm dark:border-sky-900 dark:bg-slate-900/80">
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">{player.name} <span className="text-slate-400">#{player.number}</span></p>
                                <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-sky-700 dark:text-sky-300">
                                  HI {player.handicapIndex} · 9HCP {player.nineHoleHandicap}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50 to-white p-4 dark:border-emerald-900 dark:from-emerald-950/40 dark:to-slate-900">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">Team 2</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {getPairingPlayerDetails(pairing.team2, TEAM2_PLAYERS).map((player) => (
                              <div key={`team2-${player.number}`} className="rounded-2xl border border-emerald-200/80 bg-white/90 px-3 py-2 shadow-sm dark:border-emerald-900 dark:bg-slate-900/80">
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">{player.name} <span className="text-slate-400">#{player.number}</span></p>
                                <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">
                                  HI {player.handicapIndex} · 9HCP {player.nineHoleHandicap}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="px-4 pb-4">
                        <div className="rounded-[24px] border border-slate-200/80 bg-gradient-to-br from-white to-slate-50 p-3 dark:border-slate-700 dark:from-slate-900 dark:to-slate-950">
                          <Scorecard 
                            courseName={`${match.course} - ${match.nine}`} 
                            data={getScorecard(match.course, match.nine)}
                            format={match.format.includes('Scramble') ? 'scramble' : 'best-ball'}
                            team1Players={getPairingPlayers(pairing.team1, TEAM1_PLAYERS)}
                            team2Players={getPairingPlayers(pairing.team2, TEAM2_PLAYERS)}
                            team1PlayerHandicaps={getPlayerNineHoleHandicaps(getPairingPlayers(pairing.team1, TEAM1_PLAYERS))}
                            team2PlayerHandicaps={getPlayerNineHoleHandicaps(getPairingPlayers(pairing.team2, TEAM2_PLAYERS))}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </PageContainer>
  );
}
