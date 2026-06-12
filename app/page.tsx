import { supabase } from '@/lib/supabase'
import RestaurantList from '@/components/RestaurantList'
import type { RestaurantPhoto } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

async function fetchGooglePhotosForCard(placeId: string): Promise<RestaurantPhoto[]> {
  try {
    const key = process.env.GOOGLE_MAPS_KEY
    if (!key) return []
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${key}`,
      { next: { revalidate: 86400 } }
    )
    const data = await res.json()
    const refs: string[] = (data.result?.photos ?? []).slice(0, 4).map((p: { photo_reference: string }) => p.photo_reference)
    return refs.map((ref, i) => ({
      id: `google-${i}`,
      restaurant_id: '',
      url: `/api/place-photo?ref=${encodeURIComponent(ref)}`,
      position: i,
      created_at: '',
    }))
  } catch {
    return []
  }
}

export default async function HomePage() {
  const [{ data: restaurants }, { data: allPhotos }] = await Promise.all([
    supabase.from('restaurants').select('*').order('created_at', { ascending: false }),
    supabase.from('restaurant_photos').select('*').order('position'),
  ])

  const list = restaurants ?? []
  const cuisines = [...new Set(list.map((r: { cuisine: string }) => r.cuisine))].sort() as string[]
  const neighborhoods = [...new Set(list.map((r: { neighborhood: string | null }) => r.neighborhood).filter(Boolean))].sort() as string[]

  const photosByRestaurant = (allPhotos ?? []).reduce((acc: Record<string, RestaurantPhoto[]>, p) => {
    const photo = p as RestaurantPhoto
    if (!acc[photo.restaurant_id]) acc[photo.restaurant_id] = []
    acc[photo.restaurant_id].push(photo)
    return acc
  }, {})

  // Para restaurantes sem foto própria mas com place_id, busca fotos do Google
  const needsGooglePhotos = list.filter(
    (r: { id: string; place_id?: string | null }) => !photosByRestaurant[r.id]?.length && r.place_id
  )

  if (needsGooglePhotos.length > 0) {
    const googleResults = await Promise.all(
      needsGooglePhotos.map(async (r: { id: string; place_id?: string | null }) => ({
        id: r.id,
        photos: await fetchGooglePhotosForCard(r.place_id!),
      }))
    )
    for (const { id, photos } of googleResults) {
      if (photos.length > 0) photosByRestaurant[id] = photos
    }
  }

  return (
    <div>
      {/* Hero */}
      <div className="relative overflow-hidden" style={{ background: 'var(--ink)' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute rounded-full opacity-60" style={{ width: 420, height: 420, background: 'var(--terra)', top: -120, right: -80 }} />
          <div className="absolute rounded-full opacity-40" style={{ width: 280, height: 280, background: 'var(--mustard)', top: 60, right: 180 }} />
          <div className="absolute rounded-full opacity-25" style={{ width: 200, height: 200, background: 'var(--cream)', bottom: -60, right: 320 }} />
          <div className="absolute rounded-full opacity-20" style={{ width: 340, height: 340, background: 'var(--terra)', bottom: -100, left: -60 }} />
          <div className="absolute rounded-full opacity-30" style={{ width: 160, height: 160, background: 'var(--mustard)', top: 20, left: 200 }} />
        </div>
        <div className="relative max-w-5xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
          <h1 className="font-display font-semibold leading-none text-white" style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)' }}>
            Lugares que<br />
            <em style={{ color: 'var(--terra)' }}>valem a pena</em>
          </h1>
          <p className="mt-4 text-sm" style={{ color: 'rgba(255,255,255,0.55)', maxWidth: '38ch' }}>
            {list.length} restaurantes visitados e avaliados por Lelê.
          </p>
        </div>
      </div>

      {/* Lista */}
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10">
        <RestaurantList
          restaurants={list}
          cuisines={cuisines}
          neighborhoods={neighborhoods}
          photosByRestaurant={photosByRestaurant}
        />
      </div>
    </div>
  )
}
