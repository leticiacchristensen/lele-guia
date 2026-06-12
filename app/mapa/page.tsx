import { supabase } from '@/lib/supabase'
import MapView from '@/components/MapView'

export const dynamic = 'force-dynamic'

export default async function MapaPage() {
  const { data: restaurants } = await supabase
    .from('restaurants')
    .select('id, name, cuisine, neighborhood, address, my_rating, price_range, photo_url, lat, lng, place_id, tags')
    .order('created_at', { ascending: false })

  const withCoords = (restaurants ?? []).filter(
    (r: { lat: number | null; lng: number | null }) => r.lat && r.lng
  )

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 65px)' }}>
      {withCoords.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="font-display italic text-xl" style={{ color: 'var(--border)' }}>
            Nenhum restaurante com localização cadastrada ainda.
          </p>
        </div>
      ) : (
        <MapView restaurants={withCoords} />
      )}
    </div>
  )
}
