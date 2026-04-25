import PageContainer from '../../components/PageContainer';
import SectionCard from '../../components/SectionCard';

export default function Teams() {
  return (
    <PageContainer>
      <SectionCard title="Teams">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Team A</h3>
            <ul className="list-disc list-inside">
              <li>Player 1</li>
              <li>Player 2</li>
              <li>Player 3</li>
              <li>Player 4</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Team B</h3>
            <ul className="list-disc list-inside">
              <li>Player 5</li>
              <li>Player 6</li>
              <li>Player 7</li>
              <li>Player 8</li>
            </ul>
          </div>
        </div>
      </SectionCard>
    </PageContainer>
  );
}
