import PageContainer from '../../components/PageContainer';
import SectionCard from '../../components/SectionCard';

export default function Leaderboard() {
  return (
    <PageContainer>
      <SectionCard title="Leaderboard">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Team</th>
              <th className="px-4 py-2 text-left">Points</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2">Team A</td>
              <td className="border px-4 py-2">10</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Team B</td>
              <td className="border px-4 py-2">8</td>
            </tr>
          </tbody>
        </table>
      </SectionCard>
    </PageContainer>
  );
}
