'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Restaurant } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import StarRating from './StarRating'

type Props = { restaurants: Restaurant[] }

export default function AdminRestaurantList({ restaurants }: Props) {
  const router = useRouter()
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este restaurante?')) return
    setDeleting(id)
    await supabase.from('restaurants').delete().eq('id', id)
    setDeleting(null)
    router.refresh()
  }

  if (restaurants.length === 0) {
    return <p className="text-stone-400 text-sm">Nenhum restaurante cadastrado ainda.</p>
  }

  return (
    <div className="space-y-2">
      {restaurants.map((r) => (
        <div key={r.id} className="flex items-center justify-between bg-white border border-stone-200 rounded-xl px-4 py-3">
          <div>
            <p className="text-sm font-medium text-stone-900">{r.name}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-stone-500">{r.cuisine}</span>
              <span className="text-stone-300 text-xs">·</span>
              <StarRating value={r.my_rating} readonly size="sm" />
            </div>
          </div>
          <button
            onClick={() => handleDelete(r.id)}
            disabled={deleting === r.id}
            className="text-xs text-stone-400 hover:text-red-600 transition-colors disabled:opacity-40"
          >
            {deleting === r.id ? '...' : 'Excluir'}
          </button>
        </div>
      ))}
    </div>
  )
}
