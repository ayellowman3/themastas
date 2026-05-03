import PageContainer from '../../components/PageContainer';
import SectionCard from '../../components/SectionCard';
import Scorecard from '../../components/Scorecard';
import PrintButton from '../../components/PrintButton';

export default function Scorecards() {
  const lakesData = {
    holes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    yds: [335, 345, 142, 425, 395, 375, 343, 151, 325, 379, 140, 490, 430, 385, 495, 345, 180, 328],
    par: [4, 4, 3, 5, 4, 4, 4, 3, 4, 4, 3, 5, 4, 4, 5, 4, 3, 4],
    hcp: [15, 7, 17, 5, 1, 3, 9, 11, 13, 8, 16, 12, 2, 4, 6, 14, 10, 18],
  };

  const riverData = {
    holes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    tees: ['Blue', 'Blue', 'Gold', 'Blue', 'Gold', 'Blue', 'Gold', 'Gold', 'Blue', 'Gold', 'Blue', 'Gold', 'Blue', 'Blue', 'Gold', 'Blue', 'Blue', 'Gold'],
    yds: [336, 142, 383, 333, 475, 345, 433, 160, 360, 418, 524, 307, 131, 387, 385, 174, 341, 502],
    par: [4, 3, 4, 4, 5, 4, 5, 3, 4, 4, 5, 4, 3, 4, 4, 3, 4, 5],
    hcp: [15, 17, 5, 7, 11, 13, 1, 9, 3, 2, 10, 12, 18, 8, 4, 16, 14, 6],
  };

  return (
    <PageContainer>
      <div className="print-scorebook">
        <div className="mb-6 flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-gradient-to-br from-stone-50 via-white to-emerald-50 p-6 shadow-sm print:hidden">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700">Printable Scorebook</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">The Mastas Cup Score Card Book</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                Print this page for a clean paper scorebook. The course cards are formatted to stay readable on letter paper and include River Blue/Gold tee assignments.
              </p>
            </div>
            <PrintButton />
          </div>
        </div>

        <SectionCard title="Queenstown Harbour Golf Course">
          <div className="mb-6 rounded-3xl border border-slate-200 bg-slate-50 p-5 print:mb-4 print:rounded-none print:border-black/30 print:bg-white print:p-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 print:text-black">Scorebook Notes</p>
            <div className="mt-3 grid gap-3 text-sm text-slate-700 print:gap-2 print:text-[11px] print:text-black md:grid-cols-3">
              <p>Scramble matches use triple bogey maximum score per hole.</p>
              <p>Best ball and singles use net triple bogey maximum score per hole.</p>
              <p>River Course uses Blue/Gold composite tees; the tee row shows the correct tee on every hole.</p>
            </div>
          </div>

          <div className="print-course-card">
            <Scorecard courseName="Lakes Course" data={lakesData} />
          </div>
          <div className="print-course-card">
            <Scorecard courseName="River Course (Blue/Gold)" data={riverData} />
          </div>
        </SectionCard>
      </div>
    </PageContainer>
  );
}
