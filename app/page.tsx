import { supabase } from '@/lib/supabase'
import RestaurantList from '@/components/RestaurantList'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const { data: restaurants } = await supabase
    .from('restaurants')
    .select('*')
    .order('created_at', { ascending: false })

  const list = restaurants ?? []
  const cuisines = [...new Set(list.map((r: { cuisine: string }) => r.cuisine))].sort() as string[]
  const neighborhoods = [...new Set(list.map((r: { neighborhood: string | null }) => r.neighborhood).filter(Boolean))].sort() as string[]

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8">
      {/* Hero */}
      <div className="py-14 sm:py-20 border-b" style={{ borderColor: 'var(--border)' }}>
        <p className="text-sm font-medium uppercase tracking-widest mb-3" style={{ color: 'var(--terra)' }}>
          por Lelê
        </p>
        <h1 className="font-display text-4xl sm:text-5xl leading-tight" style={{ color: 'var(--ink)' }}>
          Lugares que<br />
          <em>valem a visita</em>
        </h1>
        <p className="mt-4 text-base" style={{ color: 'var(--muted)', maxWidth: '36ch' }}>
          {list.length} restaurantes visitados e avaliados com carinho.
        </p>
      </div>

      <div className="py-10">
        <RestaurantList restaurants={list} cuisines={cuisines} neighborhoods={neighborhoods} />
      </div>
    </div>
  )
}
