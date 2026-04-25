import PageContainer from '../../components/PageContainer';
import SectionCard from '../../components/SectionCard';

export default function Schedule() {
  return (
    <PageContainer>
      <SectionCard title="Schedule">
        <ul className="space-y-2">
          <li>Round 1: Day 1 - Morning</li>
          <li>Round 2: Day 1 - Afternoon</li>
          <li>Round 3: Day 2 - Morning</li>
          <li>Round 4: Day 2 - Afternoon</li>
        </ul>
      </SectionCard>
    </PageContainer>
  );
}
