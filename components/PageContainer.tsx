interface PageContainerProps {
  children: React.ReactNode;
}

export default function PageContainer({ children }: PageContainerProps) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {children}
    </div>
  );
}