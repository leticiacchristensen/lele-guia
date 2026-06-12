'use client'

import { useState, useMemo } from 'react'
import type { Restaurant, RestaurantPhoto } from '@/lib/supabase'
import RestaurantCard from './RestaurantCard'
import { ALL_TAGS } from './TagSelector'

type Props = {
  restaurants: Restaurant[]
  cuisines: string[]
  neighborhoods: string[]
  photosByRestaurant: Record<string, RestaurantPhoto[]>
}

const PRICE_ORDER: Record<string, number> = { '$': 1, '$$': 2, '$$$': 3, '$$$$': 4 }
type SortKey = 'recent' | 'rating_desc' | 'rating_asc' | 'price_asc' | 'price_desc'

const selectStyle: React.CSSProperties = {
  background: 'white',
  border: '1.5px solid var(--border)',
  color: 'var(--ink)',
  borderRadius: 999,
  padding: '0.5rem 1rem',
  fontSize: '0.8125rem',
  appearance: 'none',
  WebkitAppearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235C4A3A' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 0.75rem center',
  paddingRight: '2rem',
  cursor: 'pointer',
}

const activeSelectStyle = (active: boolean): React.CSSProperties => ({
  ...selectStyle,
  borderColor: active ? 'var(--terra)' : 'var(--border)',
  color: active ? 'var(--terra)' : 'var(--ink)',
  fontWeight: active ? 500 : 400,
})

export default function RestaurantList({ restaurants, cuisines, neighborhoods, photosByRestaurant }: Props) {
  const [search, setSearch] = useState('')
  const [cuisine, setCuisine] = useState('')
  const [neighborhood, setNeighborhood] = useState('')
  const [price, setPrice] = useState('')
  const [minRating, setMinRating] = useState(0)
  const [tag, setTag] = useState('')
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

  const clearFilters = () => {
    setCuisine(''); setNeighborhood(''); setPrice(''); setMinRating(0); setTag('')
  }

  return (
    <div>
      {/* Linha principal: busca + ordenação */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input
          type="text"
          placeholder="Buscar restaurante..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 focus:outline-none"
          style={{
            background: 'white', border: '1.5px solid var(--border)',
            borderRadius: 999, padding: '0.5rem 1.25rem',
            fontSize: '0.8125rem', color: 'var(--ink)',
          }}
        />
        <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} style={selectStyle}>
          <option value="recent">Mais recentes</option>
          <option value="rating_desc">Melhor avaliação</option>
          <option value="rating_asc">Menor avaliação</option>
          <option value="price_asc">Menor preço</option>
          <option value="price_desc">Maior preço</option>
        </select>
      </div>

      {/* Linha de filtros — dropdowns */}
      <div className="flex flex-wrap gap-2 mb-8 pb-6" style={{ borderBottom: '1px solid var(--border)' }}>
        {cuisines.length > 0 && (
          <select value={cuisine} onChange={(e) => setCuisine(e.target.value)} style={activeSelectStyle(!!cuisine)}>
            <option value="">Culinária</option>
            {cuisines.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        )}

        {neighborhoods.length > 0 && (
          <select value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} style={activeSelectStyle(!!neighborhood)}>
            <option value="">Bairro</option>
            {neighborhoods.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        )}

        <select value={tag} onChange={(e) => setTag(e.target.value)} style={activeSelectStyle(!!tag)}>
          <option value="">Ocasião</option>
          {ALL_TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>

        <select value={price} onChange={(e) => setPrice(e.target.value)} style={activeSelectStyle(!!price)}>
          <option value="">Preço</option>
          <option value="$">$ — Econômico</option>
          <option value="$$">$$ — Moderado</option>
          <option value="$$$">$$$ — Sofisticado</option>
          <option value="$$$$">$$$$ — Premium</option>
        </select>

        <select
          value={minRating}
          onChange={(e) => setMinRating(Number(e.target.value))}
          style={activeSelectStyle(minRating > 0)}>
          <option value={0}>Nota mínima</option>
          <option value={1}>★ 1+</option>
          <option value={2}>★★ 2+</option>
          <option value={3}>★★★ 3+</option>
          <option value={4}>★★★★ 4+</option>
          <option value={5}>★★★★★ 5</option>
        </select>

        {hasFilters && (
          <button onClick={clearFilters}
            className="text-xs px-4 py-2 rounded-full transition-all"
            style={{ border: '1.5px solid var(--terra)', color: 'var(--terra)', background: 'transparent' }}>
            Limpar filtros ×
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
            <RestaurantCard key={r.id} restaurant={r} photos={photosByRestaurant[r.id] ?? []} />
          ))}
        </div>
      )}
    </div>
  )
}
