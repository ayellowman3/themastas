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

function formatPlayers(playerString: string, teamPlayers: Record<string, string>): string {
  if (playerString === 'TBD') return 'TBD';
  
  return playerString
    .split(' & ')
    .map((p) => {
      const num = p.trim().replace('#', '');
      return `${teamPlayers[num]} (#${num})`;
    })
    .join(' & ');
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
        <div className="space-y-6">
          {matches.map((match) => (
            <div key={match.round} className="border-l-4 border-blue-500 pl-4 py-2">
              <div className="mb-4">
                <p className="font-bold text-lg">Match {match.round}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{match.course} Course - {match.nine}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{match.format}</p>
              </div>
              
              <div className="space-y-2">
                {match.pairings.map((pairing, idx) => (
                  <div key={idx} className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded">
                        <p className="font-semibold text-blue-800 dark:text-blue-200">Team 1</p>
                        <p className="text-blue-700 dark:text-blue-300">{formatPlayers(pairing.team1, TEAM1_PLAYERS)}</p>
                      </div>
                      <div className="bg-green-100 dark:bg-green-900 p-2 rounded">
                        <p className="font-semibold text-green-800 dark:text-green-200">Team 2</p>
                        <p className="text-green-700 dark:text-green-300">{formatPlayers(pairing.team2, TEAM2_PLAYERS)}</p>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-700 p-2 rounded border border-gray-200 dark:border-gray-600">
                      <Scorecard 
                        courseName={`${match.course} - ${match.nine}`} 
                        data={getScorecard(match.course, match.nine)}
                        format={match.format.includes('Scramble') ? 'scramble' : 'best-ball'}
                        team1Players={getPairingPlayers(pairing.team1, TEAM1_PLAYERS)}
                        team2Players={getPairingPlayers(pairing.team2, TEAM2_PLAYERS)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </PageContainer>
  );
}
