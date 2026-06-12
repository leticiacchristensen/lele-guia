'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function Navbar() {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  // Fecha o menu ao navegar
  useEffect(() => { setOpen(false) }, [pathname])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  const links = [
    { href: '/', label: 'Restaurantes' },
    { href: '/mapa', label: 'Mapa' },
    { href: '/sobre', label: 'Sobre' },
  ]

  return (
    <>
      <nav style={{ borderBottom: '1px solid var(--border)', background: 'var(--cream)', position: 'relative', zIndex: 50 }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="font-display font-semibold text-2xl tracking-tight shrink-0" style={{ color: 'var(--terra)' }}>
            Lelê Guia
          </Link>

          {/* Desktop */}
          <div className="hidden sm:flex items-center gap-7">
            {links.map((link) => (
              <Link key={link.href} href={link.href}
                className="text-sm font-medium transition-colors"
                style={{ color: pathname === link.href ? 'var(--terra)' : 'var(--muted)' }}>
                {link.label}
              </Link>
            ))}
            {user ? (
              <div className="flex items-center gap-5">
                <Link href="/admin" className="text-sm transition-colors" style={{ color: 'var(--muted)' }}>Admin</Link>
                <button onClick={handleSignOut} className="text-sm transition-colors" style={{ color: 'var(--muted)' }}>Sair</button>
              </div>
            ) : (
              <Link href="/entrar" className="text-sm font-medium px-4 py-1.5 rounded-full transition-colors"
                style={{ background: 'var(--terra)', color: '#fff' }}>
                Entrar
              </Link>
            )}
          </div>

          {/* Mobile: botão hamburguer */}
          <button className="sm:hidden flex flex-col gap-1.5 p-1" onClick={() => setOpen(!open)} aria-label="Menu">
            <span className="block w-6 h-0.5 transition-all" style={{ background: 'var(--ink)', transform: open ? 'rotate(45deg) translate(4px, 4px)' : 'none' }} />
            <span className="block w-6 h-0.5 transition-all" style={{ background: 'var(--ink)', opacity: open ? 0 : 1 }} />
            <span className="block w-6 h-0.5 transition-all" style={{ background: 'var(--ink)', transform: open ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }} />
          </button>
        </div>
      </nav>

      {/* Mobile menu dropdown */}
      {open && (
        <div className="sm:hidden fixed inset-x-0 top-16 z-40 shadow-lg"
          style={{ background: 'var(--cream)', borderBottom: '1px solid var(--border)' }}>
          <div className="flex flex-col px-5 py-4 gap-1">
            {links.map((link) => (
              <Link key={link.href} href={link.href}
                className="py-3 text-base font-medium transition-colors"
                style={{
                  color: pathname === link.href ? 'var(--terra)' : 'var(--ink)',
                  borderBottom: '1px solid var(--border)',
                }}>
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link href="/admin" className="py-3 text-base transition-colors" style={{ color: 'var(--ink)', borderBottom: '1px solid var(--border)' }}>
                  Admin
                </Link>
                <button onClick={handleSignOut} className="py-3 text-left text-base transition-colors" style={{ color: 'var(--muted)' }}>
                  Sair
                </button>
              </>
            ) : (
              <div className="pt-3">
                <Link href="/entrar" className="inline-block text-sm font-medium px-6 py-2.5 rounded-full"
                  style={{ background: 'var(--terra)', color: '#fff' }}>
                  Entrar
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
