import PageContainer from '../../components/PageContainer';
import SectionCard from '../../components/SectionCard';

export default function Matches() {
  return (
    <PageContainer>
      <SectionCard title="Matches">
        <ul className="space-y-2">
          <li>Match 1: Player 1 vs Player 5 - Result: TBD</li>
          <li>Match 2: Player 2 vs Player 6 - Result: TBD</li>
          <li>Match 3: Player 3 vs Player 7 - Result: TBD</li>
          <li>Match 4: Player 4 vs Player 8 - Result: TBD</li>
        </ul>
      </SectionCard>
    </PageContainer>
  );
}
