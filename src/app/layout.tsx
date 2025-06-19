import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';

const inter = Inter({
  weight: ['400', '500', '600', '700', '900'],
  style: 'normal',
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Click Petróleo e Gás',
  description: 'Click Petróleo e Gás',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={cn('antialiased', inter.className)}>{children}</body>
    </html>
  );
}
