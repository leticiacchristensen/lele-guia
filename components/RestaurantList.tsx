'use client'

import { useState, useMemo } from 'react'
import type { Restaurant } from '@/lib/supabase'
import RestaurantCard from './RestaurantCard'
import { ALL_TAGS } from './TagSelector'

type Props = {
  restaurants: Restaurant[]
  cuisines: string[]
  neighborhoods: string[]
}

const PRICE_ORDER: Record<string, number> = { '$': 1, '$$': 2, '$$$': 3, '$$$$': 4 }

type SortKey = 'recent' | 'rating_desc' | 'rating_asc' | 'price_asc' | 'price_desc'

const SORT_LABELS: Record<SortKey, string> = {
  recent: 'Mais recentes',
  rating_desc: 'Melhor avaliação',
  rating_asc: 'Menor avaliação',
  price_asc: 'Menor preço',
  price_desc: 'Maior preço',
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
      style={{
        background: active ? 'var(--terra)' : 'var(--cream-dark)',
        color: active ? '#fff' : 'var(--muted)',
        border: `1px solid ${active ? 'var(--terra)' : 'var(--border)'}`,
      }}
    >
      {label}
    </button>
  )
}

export default function RestaurantList({ restaurants, cuisines, neighborhoods }: Props) {
  const [search, setSearch] = useState('')
  const [cuisine, setCuisine] = useState<string | null>(null)
  const [neighborhood, setNeighborhood] = useState<string | null>(null)
  const [price, setPrice] = useState<string | null>(null)
  const [minRating, setMinRating] = useState<number>(0)
  const [tag, setTag] = useState<string | null>(null)
  const [sort, setSort] = useState<SortKey>('recent')

  const filtered = useMemo(() => {
    let list = restaurants.filter((r) => {
      if (search && !r.name.toLowerCase().includes(search.toLowerCase())) return false
      if (cuisine && r.cuisine !== cuisine) return false
      if (neighborhood && r.neighborhood !== neighborhood) return false
      if (price && r.price_range !== price) return false
      if (minRating && r.my_rating < minRating) return false
      if (tag && !(r.tags ?? []).includes(tag)) return false
      return true
    })
    return [...list].sort((a, b) => {
      if (sort === 'rating_desc') return b.my_rating - a.my_rating
      if (sort === 'rating_asc') return a.my_rating - b.my_rating
      if (sort === 'price_asc') return PRICE_ORDER[a.price_range] - PRICE_ORDER[b.price_range]
      if (sort === 'price_desc') return PRICE_ORDER[b.price_range] - PRICE_ORDER[a.price_range]
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
  }, [restaurants, search, cuisine, neighborhood, price, minRating, sort])

  const hasFilters = !!(cuisine || neighborhood || price || minRating || tag)

  return (
    <div>
      {/* Busca e ordenação */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Buscar restaurante..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-full px-4 py-2.5 text-sm focus:outline-none"
          style={{
            background: 'var(--cream-dark)',
            border: '1px solid var(--border)',
            color: 'var(--ink)',
          }}
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="rounded-full px-4 py-2.5 text-sm focus:outline-none"
          style={{
            background: 'var(--cream-dark)',
            border: '1px solid var(--border)',
            color: 'var(--muted)',
          }}
        >
          {(Object.keys(SORT_LABELS) as SortKey[]).map((k) => (
            <option key={k} value={k}>{SORT_LABELS[k]}</option>
          ))}
        </select>
      </div>

      {/* Filtros por culinária */}
      {cuisines.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {cuisines.map((c) => (
            <FilterChip key={c} label={c} active={cuisine === c} onClick={() => setCuisine(cuisine === c ? null : c)} />
          ))}
        </div>
      )}

      {/* Filtros por bairro */}
      {neighborhoods.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {neighborhoods.map((n) => (
            <FilterChip key={n} label={n} active={neighborhood === n} onClick={() => setNeighborhood(neighborhood === n ? null : n)} />
          ))}
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        {ALL_TAGS.map((t) => (
          <FilterChip key={t} label={t} active={tag === t} onClick={() => setTag(tag === t ? null : t)} />
        ))}
      </div>

      {/* Preço e nota */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        {['$', '$$', '$$$', '$$$$'].map((p) => (
          <FilterChip key={p} label={p} active={price === p} onClick={() => setPrice(price === p ? null : p)} />
        ))}
        <span className="text-xs ml-2" style={{ color: 'var(--muted)' }}>nota mínima</span>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setMinRating(minRating === star ? 0 : star)}
            className="w-7 h-7 rounded-full text-xs font-medium transition-all"
            style={{
              background: minRating >= star ? 'var(--mustard)' : 'var(--cream-dark)',
              color: minRating >= star ? '#fff' : 'var(--muted)',
              border: `1px solid ${minRating >= star ? 'var(--mustard)' : 'var(--border)'}`,
            }}
          >
            {star}
          </button>
        ))}
        {hasFilters && (
          <button
            onClick={() => { setCuisine(null); setNeighborhood(null); setPrice(null); setMinRating(0); setTag(null) }}
            className="text-xs ml-1 underline underline-offset-2"
            style={{ color: 'var(--muted)' }}
          >
            Limpar
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center py-16 font-display italic text-xl" style={{ color: 'var(--border)' }}>
          Nenhum resultado encontrado.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      )}
    </div>
  )
}
