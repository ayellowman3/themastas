import PageContainer from '../../components/PageContainer';
import SectionCard from '../../components/SectionCard';

export default function Schedule() {
  return (
    <PageContainer>
      <SectionCard title="Schedule">
        <p className="mb-4">The tournament consists of 8 nine-hole rounds.</p>
        <ul className="space-y-2">
          <li><strong>Round 1:</strong> 2 vs 2 - 2-man Best Ball</li>
          <li><strong>Round 2:</strong> 2 vs 2 - 2-man Scramble</li>
          <li><strong>Round 3:</strong> 2 vs 2 - 2-man Scramble</li>
          <li><strong>Round 4:</strong> 2 vs 2 - 2-man Best Ball</li>
          <li><strong>Round 5:</strong> 2 vs 2 - 2-man Best Ball</li>
          <li><strong>Round 6:</strong> 2 vs 2 - 2-man Scramble</li>
          <li><strong>Round 7:</strong> 2 vs 2 - 2-man Scramble</li>
          <li><strong>Round 8:</strong> 1 vs 1 - Scramble</li>
        </ul>
      </SectionCard>
    </PageContainer>
  );
}
