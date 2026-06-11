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

      {/* Setas sempre visíveis quando há mais de 1 foto */}
      {photos.length > 1 && (
        <>
          <button onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            style={{
              width: 40, height: 40, borderRadius: '50%',
              background: 'rgba(255,255,255,0.85)',
              color: 'var(--ink)',
              fontSize: 22,
              fontWeight: 600,
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}>
            ‹
          </button>
          <button onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            style={{
              width: 40, height: 40, borderRadius: '50%',
              background: 'rgba(255,255,255,0.85)',
              color: 'var(--ink)',
              fontSize: 22,
              fontWeight: 600,
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}>
            ›
          </button>

          {/* Contador e dots */}
          <div className="absolute bottom-3 left-0 right-0 flex flex-col items-center gap-1.5">
            <div className="flex gap-1.5">
              {photos.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)}
                  className="rounded-full transition-all"
                  style={{
                    width: i === current ? 16 : 6,
                    height: 6,
                    background: i === current ? '#fff' : 'rgba(255,255,255,0.5)',
                  }} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
