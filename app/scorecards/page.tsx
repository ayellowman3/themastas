import PageContainer from '../../components/PageContainer';
import SectionCard from '../../components/SectionCard';
import Scorecard from '../../components/Scorecard';

export default function Scorecards() {
  const lakesData = {
    holes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    yds: [335, 345, 142, 425, 395, 375, 343, 151, 325, 379, 140, 490, 430, 385, 495, 345, 180, 328],
    par: [4, 4, 3, 5, 4, 4, 4, 3, 4, 4, 3, 5, 4, 4, 5, 4, 3, 4],
    hcp: [15, 7, 17, 5, 1, 3, 9, 11, 13, 8, 16, 12, 2, 4, 6, 14, 10, 18],
  };

  const riverData = {
    holes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    yds: [336, 142, 383, 333, 475, 345, 433, 160, 360, 418, 524, 307, 131, 387, 385, 174, 341, 502],
    par: [4, 3, 4, 4, 5, 4, 5, 3, 4, 4, 5, 4, 3, 4, 4, 3, 4, 5],
    hcp: [15, 17, 5, 7, 11, 13, 1, 9, 3, 2, 10, 12, 18, 8, 4, 16, 14, 6],
  };

  return (
    <PageContainer>
      <SectionCard title="Queenstown Harbour Golf Course">
        <Scorecard courseName="Lakes Course" data={lakesData} />
        <Scorecard courseName="River Course" data={riverData} />
      </SectionCard>
    </PageContainer>
  );
}