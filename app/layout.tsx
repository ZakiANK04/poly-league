import type { Metadata } from 'next';
import './globals.css';
import { TournamentProvider } from '@/lib/tournament-context';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import IntroLogoReveal from '@/components/IntroLogoReveal';

export const metadata: Metadata = {
  title: 'Poly League — Official Tournament Website',
  description: 'The premier 8-department college football tournament featuring a 2-phase UCL format and Knockout Championship.',
  icons: {
    icon: '/assets/Logo_polyleague.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-pl-body-bg text-pl-black selection:bg-pl-blue-accent selection:text-white font-body antialiased">
        <TournamentProvider>
          <IntroLogoReveal />
          <Navbar />
          <main className="page-reveal flex-grow">{children}</main>
          <Footer />
        </TournamentProvider>
      </body>
    </html>
  );
}
