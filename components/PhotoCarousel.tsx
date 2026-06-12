'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { RestaurantPhoto } from '@/lib/supabase'

type GooglePhoto = { url: string; fromGoogle: true }
type AnyPhoto = RestaurantPhoto | GooglePhoto

type Props = {
  photos: AnyPhoto[]
  name: string
  hasGooglePhotos?: boolean
}

function isGooglePhoto(p: AnyPhoto): p is GooglePhoto {
  return 'fromGoogle' in p
}

export default function PhotoCarousel({ photos, name, hasGooglePhotos }: Props) {
  const [current, setCurrent] = useState(0)

  if (photos.length === 0) return null

  const prev = () => setCurrent((c) => (c - 1 + photos.length) % photos.length)
  const next = () => setCurrent((c) => (c + 1) % photos.length)

  const currentPhoto = photos[current]
  const showingGoogle = isGooglePhoto(currentPhoto)

  return (
    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-8"
      style={{ background: 'var(--cream-dark)' }}>
      <Image
        src={currentPhoto.url}
        alt={`${name} - foto ${current + 1}`}
        fill
        className="object-cover transition-opacity duration-300"
        priority
        unoptimized={showingGoogle}
      />

      {/* Badge fotos da internet */}
      {hasGooglePhotos && showingGoogle && (
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
          style={{ background: 'rgba(0,0,0,0.55)', color: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(4px)' }}>
          <svg className="w-3 h-3 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Foto do Google
        </div>
      )}

      {photos.length > 1 && (
        <>
          <button onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            style={{
              width: 40, height: 40, borderRadius: '50%',
              background: 'rgba(255,255,255,0.85)', color: 'var(--ink)',
              fontSize: 22, fontWeight: 600, boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}>
            ‹
          </button>
          <button onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            style={{
              width: 40, height: 40, borderRadius: '50%',
              background: 'rgba(255,255,255,0.85)', color: 'var(--ink)',
              fontSize: 22, fontWeight: 600, boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}>
            ›
          </button>
          <div className="absolute bottom-3 left-0 right-0 flex justify-center">
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
