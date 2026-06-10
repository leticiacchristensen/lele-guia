'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import StarRating from './StarRating'
import { useRouter } from 'next/navigation'

const CUISINES = [
  'Italiana', 'Japonesa', 'Brasileira', 'Francesa', 'Mexicana',
  'Árabe', 'Indiana', 'Contemporânea', 'Frutos do Mar', 'Churrasco', 'Outro',
]

const PRICES = ['$', '$$', '$$$', '$$$$']

export default function AddRestaurantForm() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '', cuisine: '', neighborhood: '', address: '', price_range: '$$',
    price_note: '', my_rating: 0, my_review: '',
  })
  const [photo, setPhoto] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (field: string, value: string | number) =>
    setForm((f) => ({ ...f, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.my_rating === 0) { setError('Selecione uma nota.'); return }
    setLoading(true)
    setError('')

    let photo_url = null
    if (photo) {
      const ext = photo.name.split('.').pop()
      const path = `${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('restaurant-photos')
        .upload(path, photo)
      if (!uploadError) {
        const { data } = supabase.storage.from('restaurant-photos').getPublicUrl(path)
        photo_url = data.publicUrl
      }
    }

    const { error: insertError } = await supabase.from('restaurants').insert({
      ...form,
      neighborhood: form.neighborhood || null,
      price_note: form.price_note || null,
      photo_url,
    })

    if (insertError) {
      setError('Erro ao salvar. Verifique se você está logado como admin.')
    } else {
      setForm({ name: '', cuisine: '', neighborhood: '', address: '', price_range: '$$', price_note: '', my_rating: 0, my_review: '' })
      setPhoto(null)
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Nome *</label>
          <input
            required value={form.name} onChange={(e) => set('name', e.target.value)}
            className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Culinária *</label>
          <select
            required value={form.cuisine} onChange={(e) => set('cuisine', e.target.value)}
            className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200 bg-white"
          >
            <option value="">Selecione</option>
            {CUISINES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Bairro</label>
          <input
            value={form.neighborhood} onChange={(e) => set('neighborhood', e.target.value)}
            placeholder="ex: Batel, Vila Madalena"
            className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Endereço *</label>
          <input
            required value={form.address} onChange={(e) => set('address', e.target.value)}
            placeholder="Rua, número, cidade"
            className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Faixa de preço *</label>
          <div className="flex gap-2">
            {PRICES.map((p) => (
              <button
                key={p} type="button"
                onClick={() => set('price_range', p)}
                className={`flex-1 py-2 rounded-lg border text-sm transition-colors ${
                  form.price_range === p
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Nota do preço</label>
          <input
            value={form.price_note} onChange={(e) => set('price_note', e.target.value)}
            placeholder="ex: pratos entre R$40–80"
            className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">Minha nota *</label>
        <StarRating value={form.my_rating} onChange={(v) => set('my_rating', v)} size="lg" />
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Minha avaliação *</label>
        <textarea
          required value={form.my_review} onChange={(e) => set('my_review', e.target.value)}
          rows={4} placeholder="Escreva sua avaliação..."
          className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200 resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Foto</label>
        <input
          type="file" accept="image/*"
          onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
          className="text-sm text-stone-600"
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit" disabled={loading}
        className="px-5 py-2.5 bg-stone-900 text-white text-sm rounded-lg hover:bg-stone-700 disabled:opacity-40 transition-colors"
      >
        {loading ? 'Salvando...' : 'Adicionar restaurante'}
      </button>
    </form>
  )
}
