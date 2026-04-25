import PageContainer from '../../components/PageContainer';
import SectionCard from '../../components/SectionCard';

export default function Gallery() {
  return (
    <PageContainer>
      <SectionCard title="Gallery">
        <p className="text-gray-700">
          Photo gallery of the tournament will be displayed here. Placeholder content for now.
        </p>
      </SectionCard>
    </PageContainer>
  );
}
