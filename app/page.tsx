import Link from 'next/link';
import PageContainer from '../components/PageContainer';
import SectionCard from '../components/SectionCard';

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
    </PageContainer>
  );
}
