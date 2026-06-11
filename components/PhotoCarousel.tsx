'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { RestaurantPhoto } from '@/lib/supabase'

type Props = {
  photos: RestaurantPhoto[]
  name: string
}

export default function PhotoCarousel({ photos, name }: Props) {
  const [current, setCurrent] = useState(0)

  if (photos.length === 0) return null

  const prev = () => setCurrent((c) => (c - 1 + photos.length) % photos.length)
  const next = () => setCurrent((c) => (c + 1) % photos.length)

  return (
    <div className="relative w-full aspect-[16/7] rounded-2xl overflow-hidden mb-8"
      style={{ background: 'var(--cream-dark)' }}>
      <Image
        src={photos[current].url}
        alt={`${name} - foto ${current + 1}`}
        fill
        className="object-cover transition-opacity duration-300"
        priority
      />

      {photos.length > 1 && (
        <>
          <button onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-opacity hover:opacity-80"
            style={{ background: 'rgba(0,0,0,0.4)', color: '#fff' }}>
            ‹
          </button>
          <button onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-opacity hover:opacity-80"
            style={{ background: 'rgba(0,0,0,0.4)', color: '#fff' }}>
            ›
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {photos.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className="w-1.5 h-1.5 rounded-full transition-all"
                style={{ background: i === current ? '#fff' : 'rgba(255,255,255,0.4)' }} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
