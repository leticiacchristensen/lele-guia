'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Restaurant, RestaurantPhoto } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import StarRating from './StarRating'
import PhotoManager from './PhotoManager'

type Props = { restaurants: Restaurant[] }

const CUISINES = [
  'Italiana', 'Japonesa', 'Brasileira', 'Francesa', 'Mexicana',
  'Árabe', 'Indiana', 'Contemporânea', 'Frutos do Mar', 'Churrasco', 'Outro',
]
const PRICES = ['$', '$$', '$$$', '$$$$']

export default function AdminRestaurantList({ restaurants }: Props) {
  const router = useRouter()
  const [deleting, setDeleting] = useState<string | null>(null)
  const [editing, setEditing] = useState<Restaurant | null>(null)
  const [saving, setSaving] = useState(false)
  const [newPhoto, setNewPhoto] = useState<File | null>(null)
  const [photos, setPhotos] = useState<Record<string, RestaurantPhoto[]>>({})

  useEffect(() => {
    if (!editing) return
    supabase.from('restaurant_photos').select('*')
      .eq('restaurant_id', editing.id).order('position')
      .then(({ data }) => {
        if (data) setPhotos(prev => ({ ...prev, [editing.id]: data as RestaurantPhoto[] }))
      })
  }, [editing?.id])

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este restaurante?')) return
    setDeleting(id)
    await supabase.from('restaurants').delete().eq('id', id)
    setDeleting(null)
    router.refresh()
  }

  const handleSave = async () => {
    if (!editing) return
    setSaving(true)

    let photo_url = editing.photo_url
    if (newPhoto) {
      const ext = newPhoto.name.split('.').pop()
      const path = `${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('restaurant-photos')
        .upload(path, newPhoto)
      if (!uploadError) {
        const { data } = supabase.storage.from('restaurant-photos').getPublicUrl(path)
        photo_url = data.publicUrl
      }
    }

    await supabase.from('restaurants').update({
      name: editing.name,
      cuisine: editing.cuisine,
      neighborhood: editing.neighborhood,
      address: editing.address,
      price_range: editing.price_range,
      price_note: editing.price_note,
      my_rating: editing.my_rating,
      my_review: editing.my_review,
      photo_url,
    }).eq('id', editing.id)
    setSaving(false)
    setEditing(null)
    setNewPhoto(null)
    router.refresh()
  }

  if (restaurants.length === 0) {
    return <p className="text-sm" style={{ color: 'var(--muted)' }}>Nenhum restaurante cadastrado ainda.</p>
  }

  return (
    <div className="space-y-2">
      {restaurants.map((r) => (
        <div key={r.id}>
          <div className="flex items-center justify-between rounded-xl px-4 py-3"
            style={{ background: 'var(--cream-dark)', border: '1px solid var(--border)' }}>
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--ink)' }}>{r.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs" style={{ color: 'var(--muted)' }}>{r.cuisine}</span>
                <span className="text-xs" style={{ color: 'var(--border)' }}>·</span>
                <StarRating value={r.my_rating} readonly size="sm" />
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setEditing(editing?.id === r.id ? null : r)}
                className="text-xs font-medium transition-colors"
                style={{ color: 'var(--terra)' }}
              >
                {editing?.id === r.id ? 'Cancelar' : 'Editar'}
              </button>
              <button
                onClick={() => handleDelete(r.id)}
                disabled={deleting === r.id}
                className="text-xs transition-colors disabled:opacity-40"
                style={{ color: 'var(--muted)' }}
              >
                {deleting === r.id ? '...' : 'Excluir'}
              </button>
            </div>
          </div>

          {editing?.id === r.id && (
            <div className="rounded-xl p-5 mt-1 space-y-4"
              style={{ background: 'white', border: '1px solid var(--border)' }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wide mb-1" style={{ color: 'var(--muted)' }}>Nome</label>
                  <input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })}
                    className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none"
                    style={{ border: '1px solid var(--border)', background: 'var(--cream-dark)' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wide mb-1" style={{ color: 'var(--muted)' }}>Culinária</label>
                  <select value={editing.cuisine} onChange={e => setEditing({ ...editing, cuisine: e.target.value })}
                    className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none"
                    style={{ border: '1px solid var(--border)', background: 'var(--cream-dark)' }}>
                    {CUISINES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wide mb-1" style={{ color: 'var(--muted)' }}>Bairro</label>
                  <input value={editing.neighborhood ?? ''} onChange={e => setEditing({ ...editing, neighborhood: e.target.value })}
                    className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none"
                    style={{ border: '1px solid var(--border)', background: 'var(--cream-dark)' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wide mb-1" style={{ color: 'var(--muted)' }}>Endereço</label>
                  <input value={editing.address} onChange={e => setEditing({ ...editing, address: e.target.value })}
                    className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none"
                    style={{ border: '1px solid var(--border)', background: 'var(--cream-dark)' }} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wide mb-1" style={{ color: 'var(--muted)' }}>Faixa de preço</label>
                <div className="flex gap-2">
                  {PRICES.map(p => (
                    <button key={p} type="button" onClick={() => setEditing({ ...editing, price_range: p })}
                      className="px-3 py-1.5 rounded-lg text-sm transition-colors"
                      style={{
                        background: editing.price_range === p ? 'var(--terra)' : 'var(--cream-dark)',
                        color: editing.price_range === p ? '#fff' : 'var(--muted)',
                        border: `1px solid ${editing.price_range === p ? 'var(--terra)' : 'var(--border)'}`,
                      }}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wide mb-2" style={{ color: 'var(--muted)' }}>Minha nota</label>
                <StarRating value={editing.my_rating} onChange={v => setEditing({ ...editing, my_rating: v })} size="lg" />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wide mb-1" style={{ color: 'var(--muted)' }}>Minha avaliação</label>
                <textarea value={editing.my_review} onChange={e => setEditing({ ...editing, my_review: e.target.value })}
                  rows={4} className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none resize-none"
                  style={{ border: '1px solid var(--border)', background: 'var(--cream-dark)' }} />
              </div>

              <PhotoManager
                restaurantId={editing.id}
                photos={photos[editing.id] ?? []}
                onUpdate={(updated) => setPhotos(prev => ({ ...prev, [editing.id]: updated }))}
              />

              <button onClick={handleSave} disabled={saving}
                className="px-5 py-2 rounded-full text-sm font-medium transition-opacity disabled:opacity-40"
                style={{ background: 'var(--terra)', color: '#fff' }}>
                {saving ? 'Salvando...' : 'Salvar alterações'}
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
