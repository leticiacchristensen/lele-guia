'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function EntrarPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError('Email ou senha incorretos.')
      } else {
        router.push('/')
        router.refresh()
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setError('Erro ao criar conta. Tente novamente.')
      } else {
        setSuccess('Conta criada! Você já pode entrar.')
        setMode('login')
      }
    }
    setLoading(false)
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <p className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: 'var(--terra)' }}>
          {mode === 'login' ? 'acesso' : 'cadastro'}
        </p>
        <h1 className="font-display text-3xl mb-2" style={{ color: 'var(--ink)' }}>
          {mode === 'login' ? 'Bem-vinda de volta' : 'Criar conta'}
        </h1>
        <p className="text-sm mb-8" style={{ color: 'var(--muted)' }}>
          {mode === 'login'
            ? 'Entre para ver e avaliar os restaurantes.'
            : 'Cadastre-se para acessar o Lelê Guia.'}
        </p>

        {success && (
          <div className="text-sm rounded-xl p-4 mb-6"
            style={{ background: 'var(--cream-dark)', border: '1px solid var(--border)', color: 'var(--ink)' }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted)' }}>
              Email
            </label>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none"
              style={{ background: 'var(--cream-dark)', border: '1px solid var(--border)', color: 'var(--ink)' }}
            />
          </div>
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide mb-1.5" style={{ color: 'var(--muted)' }}>
              Senha
            </label>
            <input
              type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none"
              style={{ background: 'var(--cream-dark)', border: '1px solid var(--border)', color: 'var(--ink)' }}
            />
          </div>

          {error && <p className="text-sm" style={{ color: 'var(--terra)' }}>{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full rounded-full py-3 text-sm font-medium transition-opacity disabled:opacity-40"
            style={{ background: 'var(--terra)', color: '#fff' }}>
            {loading ? 'Aguarde...' : mode === 'login' ? 'Entrar' : 'Criar conta'}
          </button>
        </form>

        <p className="text-sm mt-6 text-center" style={{ color: 'var(--muted)' }}>
          {mode === 'login' ? 'Não tem conta?' : 'Já tem conta?'}{' '}
          <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }}
            className="underline underline-offset-2" style={{ color: 'var(--ink)' }}>
            {mode === 'login' ? 'Criar conta' : 'Entrar'}
          </button>
        </p>
      </div>
    </div>
  )
}
