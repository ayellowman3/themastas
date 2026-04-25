interface SectionCardProps {
  title: string;
  children: React.ReactNode;
}

export default function SectionCard({ title, children }: SectionCardProps) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      {children}
    </div>
  );
}