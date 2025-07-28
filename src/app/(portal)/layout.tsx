import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portal do Cliente - RealConnect',
  description: 'Acesse suas informações e acompanhe seus negócios.',
};

export default function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background text-foreground">
        {children}
    </div>
  );
}
