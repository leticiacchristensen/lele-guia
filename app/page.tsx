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
    <div>
      {/* Hero com círculos */}
      <div className="relative overflow-hidden" style={{ background: 'var(--ink)' }}>
        {/* Círculos decorativos */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute rounded-full opacity-60" style={{ width: 420, height: 420, background: 'var(--terra)', top: -120, right: -80 }} />
          <div className="absolute rounded-full opacity-40" style={{ width: 280, height: 280, background: 'var(--mustard)', top: 60, right: 180 }} />
          <div className="absolute rounded-full opacity-25" style={{ width: 200, height: 200, background: 'var(--cream)', bottom: -60, right: 320 }} />
          <div className="absolute rounded-full opacity-20" style={{ width: 340, height: 340, background: 'var(--terra)', bottom: -100, left: -60 }} />
          <div className="absolute rounded-full opacity-30" style={{ width: 160, height: 160, background: 'var(--mustard)', top: 20, left: 200 }} />
        </div>

        <div className="relative max-w-5xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
          <p className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: 'var(--mustard)' }}>
            por Lelê
          </p>
          <h1 className="font-display font-semibold leading-none text-white" style={{ fontSize: 'clamp(3.5rem, 10vw, 7rem)' }}>
            Lelê<br />
            <em style={{ color: 'var(--terra)' }}>Guia</em>
          </h1>
          <p className="mt-6 text-base" style={{ color: 'rgba(255,255,255,0.55)', maxWidth: '38ch' }}>
            {list.length} restaurantes visitados e avaliados com carinho.
          </p>
        </div>
      </div>

      {/* Lista */}
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10">
        <RestaurantList restaurants={list} cuisines={cuisines} neighborhoods={neighborhoods} />
      </div>
    </div>
  )
}
