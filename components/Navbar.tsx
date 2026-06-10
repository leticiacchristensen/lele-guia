'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function Navbar() {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setMenuOpen(false)
  }

  const links = [
    { href: '/', label: 'Restaurantes' },
    { href: '/sobre', label: 'Sobre' },
  ]

  return (
    <nav style={{ borderBottom: '1px solid var(--border)', background: 'var(--cream)' }}>
      <div className="max-w-5xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="font-display text-xl tracking-tight" style={{ color: 'var(--terra)' }}>
          Lelê Guia
        </Link>

        <div className="flex items-center gap-7">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium transition-colors"
              style={{
                color: pathname === link.href ? 'var(--terra)' : 'var(--muted)',
              }}
            >
              {link.label}
            </Link>
          ))}

          {user ? (
            <div className="flex items-center gap-5">
              <Link href="/admin" className="text-sm transition-colors" style={{ color: 'var(--muted)' }}>
                Admin
              </Link>
              <button onClick={handleSignOut} className="text-sm transition-colors" style={{ color: 'var(--muted)' }}>
                Sair
              </button>
            </div>
          ) : (
            <Link
              href="/entrar"
              className="text-sm font-medium px-4 py-1.5 rounded-full transition-colors"
              style={{ background: 'var(--terra)', color: '#fff' }}
            >
              Entrar
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
