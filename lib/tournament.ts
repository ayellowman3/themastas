export interface ScorecardData {
  holes: number[];
  tees?: string[];
  yds: number[];
  par: number[];
  hcp: number[];
}

export interface PairingSeed {
  id: string;
  team1: string;
  team2: string;
  team1Score: number | null;
  team2Score: number | null;
  completed?: boolean;
}

export interface MatchSeed {
  round: number;
  course: 'River' | 'Lakes';
  nine: 'Front 9' | 'Back 9';
  format: string;
  pairings: PairingSeed[];
}

export interface PlayerHandicap {
  index: number;
  nineHole: number;
}

export interface PairingPlayerDetail {
  number: string;
  name: string;
  handicapIndex: number;
  nineHoleHandicap: number;
}

export const TEAM1_NAME = 'Marlboro Reads';
export const TEAM2_NAME = 'The Samdicapped';

export const TEAM1_PLAYERS = {
  '1': 'Kyung',
  '2': 'Tommy',
  '3': 'George',
  '4': 'Justin',
  '5': 'Paul',
  '6': 'Stephen',
} as const;

export const TEAM2_PLAYERS = {
  '1': 'Min Woo',
  '2': 'Andy',
  '3': 'Terry',
  '4': 'Huey',
  '5': 'Alex',
  '6': 'Sam',
} as const;

export const PLAYER_HANDICAPS: Record<string, PlayerHandicap> = {
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
};

export const SCORECARD_DATA: Record<'riversaints' | 'lakes', ScorecardData> = {
  riversaints: {
    holes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    tees: ['Blue', 'Blue', 'Gold', 'Blue', 'Gold', 'Blue', 'Gold', 'Gold', 'Blue', 'Gold', 'Blue', 'Gold', 'Blue', 'Blue', 'Gold', 'Blue', 'Blue', 'Gold'],
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

export const MATCHES: MatchSeed[] = [
  {
    round: 1,
    course: 'River',
    nine: 'Front 9',
    format: '2-man Best Ball',
    pairings: [
      { id: 'm1-p1', team1: '#1 & #4', team2: '#4 & #5', team1Score: null, team2Score: null },
      { id: 'm1-p2', team1: '#3 & #5', team2: '#2 & #6', team1Score: null, team2Score: null },
      { id: 'm1-p3', team1: '#2 & #6', team2: '#1 & #3', team1Score: null, team2Score: null },
    ],
  },
  {
    round: 2,
    course: 'Lakes',
    nine: 'Front 9',
    format: '2-man Scramble',
    pairings: [
      { id: 'm2-p1', team1: '#2 & #3', team2: '#5 & #6', team1Score: null, team2Score: null },
      { id: 'm2-p2', team1: '#5 & #6', team2: '#1 & #4', team1Score: null, team2Score: null },
      { id: 'm2-p3', team1: '#1 & #4', team2: '#2 & #3', team1Score: null, team2Score: null },
    ],
  },
  {
    round: 3,
    course: 'River',
    nine: 'Back 9',
    format: '2-man Scramble',
    pairings: [
      { id: 'm3-p1', team1: '#1 & #6', team2: '#1 & #6', team1Score: 1, team2Score: 0 },
      { id: 'm3-p2', team1: '#2 & #3', team2: '#2 & #4', team1Score: 0.5, team2Score: 0.5 },
      { id: 'm3-p3', team1: '#4 & #5', team2: '#3 & #5', team1Score: 0.5, team2Score: 0.5 },
    ],
  },
  {
    round: 4,
    course: 'Lakes',
    nine: 'Front 9',
    format: '2-man Best Ball',
    pairings: [
      { id: 'm4-p1', team1: '#4 & #5', team2: '#1 & #2', team1Score: 1, team2Score: 0 },
      { id: 'm4-p2', team1: '#1 & #2', team2: '#3 & #6', team1Score: 0, team2Score: 1 },
      { id: 'm4-p3', team1: '#3 & #6', team2: '#4 & #5', team1Score: 0, team2Score: 1 },
    ],
  },
  {
    round: 5,
    course: 'Lakes',
    nine: 'Back 9',
    format: '2-man Best Ball',
    pairings: [
      { id: 'm5-p1', team1: '#3 & #6', team2: '#2 & #3', team1Score: 1, team2Score: 0 },
      { id: 'm5-p2', team1: '#2 & #4', team2: '#1 & #5', team1Score: 0, team2Score: 1 },
      { id: 'm5-p3', team1: '#1 & #5', team2: '#4 & #6', team1Score: 0, team2Score: 1 },
    ],
  },
  {
    round: 6,
    course: 'River',
    nine: 'Front 9',
    format: '2-man Scramble',
    pairings: [
      { id: 'm6-p1', team1: '#2 & #5', team2: '#3 & #4', team1Score: null, team2Score: null },
      { id: 'm6-p2', team1: '#1 & #6', team2: '#2 & #5', team1Score: null, team2Score: null },
      { id: 'm6-p3', team1: '#3 & #4', team2: '#1 & #6', team1Score: null, team2Score: null },
    ],
  },
  {
    round: 7,
    course: 'River',
    nine: 'Back 9',
    format: '2-man Scramble',
    pairings: [
      { id: 'm7-p1', team1: '#1 & #3', team2: '#1 & #3', team1Score: null, team2Score: null },
      { id: 'm7-p2', team1: '#4 & #6', team2: '#4 & #6', team1Score: null, team2Score: null },
      { id: 'm7-p3', team1: '#2 & #5', team2: '#2 & #5', team1Score: null, team2Score: null },
    ],
  },
  {
    round: 8,
    course: 'River',
    nine: 'Front 9',
    format: '1v1 - Singles',
    pairings: [
      { id: 'm8-p1', team1: '#1', team2: '#1', team1Score: null, team2Score: null },
      { id: 'm8-p2', team1: '#2', team2: '#2', team1Score: null, team2Score: null },
      { id: 'm8-p3', team1: '#3', team2: '#3', team1Score: null, team2Score: null },
      { id: 'm8-p4', team1: '#4', team2: '#4', team1Score: null, team2Score: null },
      { id: 'm8-p5', team1: '#5', team2: '#5', team1Score: null, team2Score: null },
      { id: 'm8-p6', team1: '#6', team2: '#6', team1Score: null, team2Score: null },
    ],
  },
];

export function getScorecard(course: 'River' | 'Lakes', nine: 'Front 9' | 'Back 9'): ScorecardData {
  const courseData = course === 'River' ? SCORECARD_DATA.riversaints : SCORECARD_DATA.lakes;

  if (nine === 'Front 9') {
    return {
      holes: courseData.holes.slice(0, 9),
      tees: courseData.tees?.slice(0, 9),
      yds: courseData.yds.slice(0, 9),
      par: courseData.par.slice(0, 9),
      hcp: courseData.hcp.slice(0, 9),
    };
  }

  return {
    holes: courseData.holes.slice(9, 18),
    tees: courseData.tees?.slice(9, 18),
    yds: courseData.yds.slice(9, 18),
    par: courseData.par.slice(9, 18),
    hcp: courseData.hcp.slice(9, 18),
  };
}

export function getPairingPlayers(playerString: string, teamPlayers: Record<string, string>): string[] {
  if (playerString === 'TBD') return [];

  return playerString
    .split(' & ')
    .map((p) => {
      const num = p.trim().replace('#', '');
      return teamPlayers[num];
    })
    .filter(Boolean);
}

export function getPairingPlayerDetails(playerString: string, teamPlayers: Record<string, string>): PairingPlayerDetail[] {
  if (playerString === 'TBD') return [];

  const players: PairingPlayerDetail[] = [];

  for (const rawPlayer of playerString.split(' & ')) {
    const number = rawPlayer.trim().replace('#', '');
    const name = teamPlayers[number];
    const handicap = PLAYER_HANDICAPS[name as keyof typeof PLAYER_HANDICAPS];

    if (!name || !handicap) continue;

    players.push({
      number,
      name,
      handicapIndex: handicap.index,
      nineHoleHandicap: handicap.nineHole,
    });
  }

  return players;
}

export function getPlayerNineHoleHandicaps(players: string[]) {
  return players.reduce<Record<string, number>>((acc, player) => {
    const handicap = PLAYER_HANDICAPS[player as keyof typeof PLAYER_HANDICAPS];
    if (handicap) {
      acc[player] = handicap.nineHole;
    }
    return acc;
  }, {});
}

export function getMatchAccent(course: 'River' | 'Lakes') {
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

export function formatMatchPoints(score: number | null) {
  if (score === null) return 'Pending';
  if (score === 0.5) return '0.5 pts';
  return `${score} pt`;
}

export function isPairingComplete(pairing: { team1Score: number | null; team2Score: number | null; completed?: boolean }) {
  return pairing.completed === true && pairing.team1Score !== null && pairing.team2Score !== null;
}
