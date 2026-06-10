import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'Lelê Guia',
  description: 'Restaurantes que valem a visita, por Lelê',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen" style={{ background: 'var(--cream)', color: 'var(--ink)' }}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}
