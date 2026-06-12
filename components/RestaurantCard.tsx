'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import type { Restaurant, RestaurantPhoto } from '@/lib/supabase'

type Props = {
  restaurant: Restaurant
  photos: RestaurantPhoto[]
}

const priceLabel: Record<string, string> = {
  '$': 'Econômico', '$$': 'Moderado', '$$$': 'Sofisticado', '$$$$': 'Premium',
}

function Stars({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <svg key={s} className="w-3.5 h-3.5" viewBox="0 0 20 20"
          fill={s <= value ? 'var(--terra)' : 'none'}
          stroke={s <= value ? 'var(--terra)' : 'var(--border)'}
          strokeWidth="1.5">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function RestaurantCard({ restaurant, photos }: Props) {
  const [current, setCurrent] = useState(0)

  const allPhotos = photos.length > 0
    ? photos
    : restaurant.photo_url
      ? [{ id: 'legacy', url: restaurant.photo_url, restaurant_id: restaurant.id, position: 0, created_at: '' }]
      : []

  const prev = (e: React.MouseEvent) => {
    e.preventDefault()
    setCurrent((c) => (c - 1 + allPhotos.length) % allPhotos.length)
  }
  const next = (e: React.MouseEvent) => {
    e.preventDefault()
    setCurrent((c) => (c + 1) % allPhotos.length)
  }

  return (
    <Link
      href={`/restaurantes/${restaurant.id}`}
      className="group block rounded-2xl overflow-hidden transition-transform hover:-translate-y-1"
      style={{ background: 'white', border: '1.5px solid var(--border)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
    >
      {/* Foto com carrossel */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4/3', background: 'var(--cream-dark)' }}>
        {allPhotos.length > 0 ? (
          <Image
            src={allPhotos[current].url}
            alt={restaurant.name}
            fill
            className="object-cover transition-opacity duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-display text-5xl italic"
            style={{ color: 'var(--border)' }}>✦</div>
        )}

        {/* Setas */}
        {allPhotos.length > 1 && (
          <>
            <button onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-all opacity-0 group-hover:opacity-100"
              style={{ background: 'rgba(255,255,255,0.9)', color: 'var(--ink)', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>
              ‹
            </button>
            <button onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-all opacity-0 group-hover:opacity-100"
              style={{ background: 'rgba(255,255,255,0.9)', color: 'var(--ink)', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>
              ›
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {allPhotos.map((_, i) => (
                <div key={i} className="rounded-full transition-all"
                  style={{ width: i === current ? 12 : 5, height: 5, background: i === current ? 'white' : 'rgba(255,255,255,0.5)' }} />
              ))}
            </div>
          </>
        )}

        <span className="absolute top-2 right-2 text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ background: 'white', color: 'var(--terra)', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }}>
          {restaurant.price_range}
        </span>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-display text-base leading-snug mb-1" style={{ color: 'var(--ink)' }}>
          {restaurant.name}
        </h3>
        <div className="flex items-center gap-1.5 flex-wrap mb-3">
          <span className="text-xs" style={{ color: 'var(--muted)' }}>{restaurant.cuisine}</span>
          {restaurant.neighborhood && (
            <>
              <span style={{ color: 'var(--border)' }}>·</span>
              <span className="text-xs" style={{ color: 'var(--muted)' }}>{restaurant.neighborhood}</span>
            </>
          )}
        </div>

        {(restaurant.tags ?? []).length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {restaurant.tags.map(t => (
              <span key={t} className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ background: 'var(--mustard)', color: 'white' }}>
                {t}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <Stars value={restaurant.my_rating} />
          <a
            href={restaurant.place_id
              ? `https://www.google.com/maps/place/?q=place_id:${restaurant.place_id}`
              : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-xs transition-opacity hover:opacity-60"
            style={{ color: 'var(--muted)' }}
          >
            <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Ver no mapa
          </a>
        </div>
      </div>
    </Link>
  )
}
