import PageContainer from '../../components/PageContainer';
import SectionCard from '../../components/SectionCard';
import {
  getBestBallNineHoleHandicap,
  getSinglesNineHoleHandicap,
  PLAYER_HANDICAPS,
  TEAM1_NAME,
  TEAM1_PLAYERS,
  TEAM2_NAME,
  TEAM2_PLAYERS,
} from '../../lib/tournament';

export default function Teams() {
  return (
    <PageContainer>
      <SectionCard title="Teams">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">{TEAM1_NAME}</h3>
            <ul className="space-y-2">
              {Object.entries(TEAM1_PLAYERS).map(([number, name], index) => {
                const handicap = PLAYER_HANDICAPS[name as keyof typeof PLAYER_HANDICAPS];
                return (
                  <li key={name} className={`flex items-start justify-between gap-4 ${index === 5 ? 'border-t pt-2 mt-2' : ''}`}>
                    <span>
                      {name === 'Stephen' ? <strong>Stephen (Captain)</strong> : name}
                      <span className="mt-1 block text-xs text-slate-500">
                        18HCP {handicap.eighteenHole} · 1v1 {getSinglesNineHoleHandicap(handicap.eighteenHole)} · BB {getBestBallNineHoleHandicap(handicap.eighteenHole)}
                      </span>
                    </span>
                    <span className="font-semibold text-blue-600">#{number}</span>
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">{TEAM2_NAME}</h3>
            <ul className="space-y-2">
              {Object.entries(TEAM2_PLAYERS).map(([number, name], index) => {
                const handicap = PLAYER_HANDICAPS[name as keyof typeof PLAYER_HANDICAPS];
                return (
                  <li key={name} className={`flex items-start justify-between gap-4 ${index === 5 ? 'border-t pt-2 mt-2' : ''}`}>
                    <span>
                      {name === 'Sam' ? <strong>Sam (Captain)</strong> : name}
                      <span className="mt-1 block text-xs text-slate-500">
                        18HCP {handicap.eighteenHole} · 1v1 {getSinglesNineHoleHandicap(handicap.eighteenHole)} · BB {getBestBallNineHoleHandicap(handicap.eighteenHole)}
                      </span>
                    </span>
                    <span className="font-semibold text-green-600">#{number}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </SectionCard>
    </PageContainer>
  );
}
