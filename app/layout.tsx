import type { Metadata } from 'next';
import './globals.css';
import { Header } from './components/Header';

export const metadata: Metadata = {
  title: 'ServiceDesk | Enterprise IT Management',
  description: 'Professional IT Service Management Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="app-wrapper">
          <Header />
          <div className="main-viewport">
            <main id="main-view">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
