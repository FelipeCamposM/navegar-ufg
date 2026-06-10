import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Navegar UFG — Sistema de Navegação',
  description: 'Sistema de Navegação Primitivo — AED2/UFG 2026-1',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className="dark h-full" suppressHydrationWarning>
      <body className="h-full overflow-hidden">{children}</body>
    </html>
  );
}
