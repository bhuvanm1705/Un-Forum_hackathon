import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/Sidebar';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Foru.ms x v0 Hackathon',
  description: 'A blazing fast forum template.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50")}>
        <div className="flex min-h-screen">
          <Sidebar className="w-64 fixed hidden md:block" />
          <div className="flex-1 md:ml-64">
            <main className="container max-w-4xl py-6 lg:px-8 px-4">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
