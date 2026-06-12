'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

type MapRestaurant = {
  id: string
  name: string
  cuisine: string
  neighborhood: string | null
  address: string
  my_rating: number
  price_range: string
  photo_url: string | null
  lat: number
  lng: number
  place_id: string | null
  tags: string[]
}

type Props = {
  restaurants: MapRestaurant[]
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google: any
    _mapsCallback?: () => void
  }
}

function Stars({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className="w-3.5 h-3.5" viewBox="0 0 20 20"
          fill={s <= value ? '#C13A1E' : 'none'}
          stroke={s <= value ? '#C13A1E' : '#CFC0AC'}
          strokeWidth="1.5">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function MapView({ restaurants }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null)
  const [selected, setSelected] = useState<MapRestaurant | null>(null)

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY
    if (!apiKey) return

    const initMap = () => {
      if (!mapRef.current || !window.google?.maps) return

      const bounds = new window.google.maps.LatLngBounds()
      restaurants.forEach(r => bounds.extend({ lat: r.lat, lng: r.lng }))

      const map = new window.google.maps.Map(mapRef.current, {
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: [
          { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
          { featureType: 'transit', stylers: [{ visibility: 'off' }] },
          { elementType: 'geometry', stylers: [{ color: '#f5efe4' }] },
          { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9d8e8' }] },
          { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
          { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#ede3d3' }] },
          { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#e0d0bb' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#5c4a3a' }] },
          { elementType: 'labels.text.stroke', stylers: [{ color: '#f5efe4' }] },
        ],
      })

      map.fitBounds(bounds)
      mapInstanceRef.current = map

      // Marcadores customizados
      restaurants.forEach((r) => {
        const marker = new window.google.maps.Marker({
          position: { lat: r.lat, lng: r.lng },
          map,
          title: r.name,
          icon: {
            path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
            fillColor: '#C13A1E',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 1.5,
            scale: 1.6,
            anchor: new window.google.maps.Point(12, 22),
          },
        })

        marker.addListener('click', () => {
          setSelected(r)
          map.panTo({ lat: r.lat, lng: r.lng })
        })
      })
    }

    if (window.google?.maps) {
      initMap()
    } else {
      window._mapsCallback = initMap
      if (!document.getElementById('google-maps-script')) {
        const s = document.createElement('script')
        s.id = 'google-maps-script'
        s.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=_mapsCallback`
        s.async = true
        document.head.appendChild(s)
      }
    }
  }, [restaurants])

  return (
    <div className="relative flex-1 w-full h-full">
      <div ref={mapRef} className="w-full h-full" />

      {/* Card do restaurante selecionado */}
      {selected && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-80 rounded-2xl overflow-hidden shadow-xl"
          style={{ background: 'white', border: '1.5px solid var(--border)' }}>
          {selected.photo_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={selected.photo_url} alt={selected.name}
              className="w-full object-cover" style={{ height: 140 }} />
          )}
          <div className="p-4">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-display text-base leading-snug" style={{ color: 'var(--ink)' }}>
                {selected.name}
              </h3>
              <button onClick={() => setSelected(null)}
                className="shrink-0 text-lg leading-none mt-0.5 transition-opacity hover:opacity-50"
                style={{ color: 'var(--muted)' }}>×</button>
            </div>
            <p className="text-xs mb-2" style={{ color: 'var(--muted)' }}>
              {selected.cuisine}{selected.neighborhood ? ` · ${selected.neighborhood}` : ''}
            </p>
            <div className="flex items-center justify-between">
              <Stars value={selected.my_rating} />
              <span className="text-xs font-medium" style={{ color: 'var(--muted)' }}>{selected.price_range}</span>
            </div>
            <Link href={`/restaurantes/${selected.id}`}
              className="mt-3 flex items-center justify-center w-full py-2 rounded-full text-sm font-medium transition-opacity hover:opacity-80"
              style={{ background: 'var(--terra)', color: '#fff' }}>
              Ver avaliação completa
            </Link>
          </div>
        </div>
      )}

      {/* Contador */}
      <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-medium"
        style={{ background: 'white', color: 'var(--muted)', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }}>
        {restaurants.length} restaurante{restaurants.length !== 1 ? 's' : ''}
      </div>
    </div>
  )
}
