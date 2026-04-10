import type { Metadata } from 'next';
import './globals.css';
import { AppWrapper } from './components/AppWrapper';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'ServiceDesk | Enterprise IT Management',
  description: 'Professional IT Service Management Platform',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSession();

  return (
    <html lang="en">
      <body>
        <AppWrapper user={user}>
          {children}
        </AppWrapper>
      </body>
    </html>
  );
}
