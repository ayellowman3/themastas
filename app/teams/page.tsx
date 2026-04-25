import PageContainer from '../../components/PageContainer';
import SectionCard from '../../components/SectionCard';

export default function Teams() {
  return (
    <PageContainer>
      <SectionCard title="Teams">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Team 1</h3>
            <ul className="space-y-2">
              <li className="flex justify-between"><span>Kyung</span> <span className="font-semibold text-blue-600">#1</span></li>
              <li className="flex justify-between"><span>Tommy</span> <span className="font-semibold text-blue-600">#2</span></li>
              <li className="flex justify-between"><span>George</span> <span className="font-semibold text-blue-600">#3</span></li>
              <li className="flex justify-between"><span>Justin</span> <span className="font-semibold text-blue-600">#4</span></li>
              <li className="flex justify-between"><span>Paul</span> <span className="font-semibold text-blue-600">#5</span></li>
              <li className="flex justify-between border-t pt-2 mt-2"><span><strong>Stephen (Captain)</strong></span> <span className="font-semibold text-blue-600">#6</span></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Team 2</h3>
            <ul className="space-y-2">
              <li className="flex justify-between"><span>Min Woo</span> <span className="font-semibold text-green-600">#1</span></li>
              <li className="flex justify-between"><span>Andy</span> <span className="font-semibold text-green-600">#2</span></li>
              <li className="flex justify-between"><span>Terry</span> <span className="font-semibold text-green-600">#3</span></li>
              <li className="flex justify-between"><span>Huey</span> <span className="font-semibold text-green-600">#4</span></li>
              <li className="flex justify-between"><span>Alex</span> <span className="font-semibold text-green-600">#5</span></li>
              <li className="flex justify-between border-t pt-2 mt-2"><span><strong>Sam (Captain)</strong></span> <span className="font-semibold text-green-600">#6</span></li>
            </ul>
          </div>
        </div>
      </SectionCard>
    </PageContainer>
  );
}
