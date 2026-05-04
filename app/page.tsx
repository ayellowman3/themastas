import Link from 'next/link';
import PageContainer from '../components/PageContainer';
import SectionCard from '../components/SectionCard';
import ProgressBar from '../components/ProgressBar';
import { TEAM1_NAME, TEAM2_NAME } from '../lib/tournament';

export default function Home() {
  return (
    <PageContainer>
      <SectionCard title="Welcome to The Mastas Cup">
        <p className="text-gray-700 mb-4">
          The Mastas Cup is an exciting Ryder Cup-style golf tournament pitting two elite teams against each other in a battle for supremacy on the greens.
        </p>
        <p className="text-gray-700">
          Follow the action, check the leaderboard, and see the schedule of matches.
        </p>
      </SectionCard>

      <SectionCard title="Quick Links">
        <div className="flex flex-wrap gap-4">
          <Link href="/teams" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            View Teams
          </Link>
          <Link href="/leaderboard" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Check Leaderboard
          </Link>
          <Link href="/schedule" className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
            See Schedule
          </Link>
        </div>
      </SectionCard>

      <SectionCard title="Points Chart">
        <p className="mb-4">
          To win the Mastas Cup, a team needs to accumulate <strong>13.75 points</strong> out of a total of <strong>27 points</strong> available.
        </p>
        <p>
          Points are awarded based on match results throughout the tournament.
        </p>
      </SectionCard>

      <SectionCard title="Current Standings">
        <ProgressBar label={TEAM1_NAME} current={0} total={27} />
        <ProgressBar label={TEAM2_NAME} current={0} total={27} />
      </SectionCard>
    </PageContainer>
  );
}
