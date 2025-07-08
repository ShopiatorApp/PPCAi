// src/app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'
import { ClientProviders } from '@/components/providers/ClientProviders'
import { Navigation } from '@/components/Navigation'
import { Header } from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientProviders>
          {/* <Header /> */}
          <Navigation />
          <main className="min-h-screen bg-gray-50 pt-20">
            {children}
          </main>
        </ClientProviders>
      </body>
    </html>
  )
} 