'use client';
import './globals.css';
import { Analytics } from '@vercel/analytics/react';
import { SessionProvider } from 'next-auth/react';
import Head from 'next/head';

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <title>Manuqui-Gym App</title>
        <meta name="Manuqui-Gym" content="Aplicación de Manuqui-Gym." />
      </Head>
      <body className="flex min-h-screen w-full flex-col">
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
      <Analytics />
    </html>
  );
}
