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

type ChipProps = { label: string; active: boolean; onClick: () => void; color?: 'terra' | 'mustard' | 'default' }

function Chip({ label, active, onClick, color = 'default' }: ChipProps) {
  const bg = active
    ? color === 'mustard' ? 'var(--mustard)' : color === 'terra' ? 'var(--terra)' : 'var(--ink)'
    : 'white'
  const border = active
    ? color === 'mustard' ? 'var(--mustard)' : color === 'terra' ? 'var(--terra)' : 'var(--ink)'
    : 'var(--border)'
  return (
    <button onClick={onClick}
      className="px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap"
      style={{ background: bg, color: active ? '#fff' : 'var(--muted)', border: `1.5px solid ${border}` }}>
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
  }, [restaurants, search, cuisine, neighborhood, price, minRating, sort, tag])

  const hasFilters = !!(cuisine || neighborhood || price || minRating || tag)

  return (
    <div>
      {/* Busca + ordenação */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="text"
          placeholder="Buscar restaurante..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-full px-4 py-2.5 text-sm focus:outline-none"
          style={{ background: 'white', border: '1.5px solid var(--border)', color: 'var(--ink)' }}
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="rounded-full px-4 py-2.5 text-sm focus:outline-none"
          style={{ background: 'white', border: '1.5px solid var(--border)', color: 'var(--muted)' }}
        >
          {(Object.keys(SORT_LABELS) as SortKey[]).map((k) => (
            <option key={k} value={k}>{SORT_LABELS[k]}</option>
          ))}
        </select>
      </div>

      {/* Filtros organizados por linha */}
      <div className="space-y-3 mb-8 pb-6" style={{ borderBottom: '1px solid var(--border)' }}>

        {/* Culinária */}
        {cuisines.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium uppercase tracking-wider w-20 shrink-0" style={{ color: 'var(--muted)' }}>Culinária</span>
            <div className="flex gap-2 flex-wrap">
              {cuisines.map((c) => (
                <Chip key={c} label={c} active={cuisine === c} onClick={() => setCuisine(cuisine === c ? null : c)} />
              ))}
            </div>
          </div>
        )}

        {/* Bairro */}
        {neighborhoods.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium uppercase tracking-wider w-20 shrink-0" style={{ color: 'var(--muted)' }}>Bairro</span>
            <div className="flex gap-2 flex-wrap">
              {neighborhoods.map((n) => (
                <Chip key={n} label={n} active={neighborhood === n} onClick={() => setNeighborhood(neighborhood === n ? null : n)} color="terra" />
              ))}
            </div>
          </div>
        )}

        {/* Ocasião (tags) */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium uppercase tracking-wider w-20 shrink-0" style={{ color: 'var(--muted)' }}>Ocasião</span>
          <div className="flex gap-2 flex-wrap">
            {ALL_TAGS.map((t) => (
              <Chip key={t} label={t} active={tag === t} onClick={() => setTag(tag === t ? null : t)} color="mustard" />
            ))}
          </div>
        </div>

        {/* Preço + Nota */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wider w-20 shrink-0" style={{ color: 'var(--muted)' }}>Preço</span>
            <div className="flex gap-2">
              {['$', '$$', '$$$', '$$$$'].map((p) => (
                <Chip key={p} label={p} active={price === p} onClick={() => setPrice(price === p ? null : p)} />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wider shrink-0" style={{ color: 'var(--muted)' }}>Nota mín.</span>
            <div className="flex gap-1">
              {[1,2,3,4,5].map((s) => (
                <button key={s} onClick={() => setMinRating(minRating === s ? 0 : s)}
                  className="w-7 h-7 rounded-full text-xs font-medium transition-all"
                  style={{
                    background: minRating >= s ? 'var(--terra)' : 'white',
                    color: minRating >= s ? '#fff' : 'var(--muted)',
                    border: `1.5px solid ${minRating >= s ? 'var(--terra)' : 'var(--border)'}`,
                  }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {hasFilters && (
          <button
            onClick={() => { setCuisine(null); setNeighborhood(null); setPrice(null); setMinRating(0); setTag(null) }}
            className="text-xs underline underline-offset-2 transition-opacity hover:opacity-60"
            style={{ color: 'var(--terra)' }}>
            Limpar filtros
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
