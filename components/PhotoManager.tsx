'use client'

import { useState } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import type { RestaurantPhoto } from '@/lib/supabase'

type Props = {
  restaurantId: string
  photos: RestaurantPhoto[]
  onUpdate: (photos: RestaurantPhoto[]) => void
}

export default function PhotoManager({ restaurantId, photos, onUpdate }: Props) {
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploading(true)

    const newPhotos: RestaurantPhoto[] = []
    for (const file of files) {
      const ext = file.name.split('.').pop()
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage.from('restaurant-photos').upload(path, file)
      if (!error) {
        const { data } = supabase.storage.from('restaurant-photos').getPublicUrl(path)
        const { data: photo } = await supabase.from('restaurant_photos').insert({
          restaurant_id: restaurantId,
          url: data.publicUrl,
          position: photos.length + newPhotos.length,
        }).select().single()
        if (photo) newPhotos.push(photo as RestaurantPhoto)
      }
    }

    onUpdate([...photos, ...newPhotos])
    setUploading(false)
    e.target.value = ''
  }

  const handleDelete = async (photo: RestaurantPhoto) => {
    await supabase.from('restaurant_photos').delete().eq('id', photo.id)
    onUpdate(photos.filter((p) => p.id !== photo.id))
  }

  return (
    <div>
      <label className="block text-xs font-medium uppercase tracking-wide mb-2" style={{ color: 'var(--muted)' }}>
        Fotos ({photos.length})
      </label>

      <div className="flex flex-wrap gap-2 mb-3">
        {photos.map((photo) => (
          <div key={photo.id} className="relative group w-20 h-20 rounded-lg overflow-hidden"
            style={{ border: '1px solid var(--border)' }}>
            <Image src={photo.url} alt="foto" fill className="object-cover" />
            <button
              onClick={() => handleDelete(photo)}
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-medium"
              style={{ background: 'rgba(0,0,0,0.5)' }}>
              Remover
            </button>
          </div>
        ))}
      </div>

      <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-opacity hover:opacity-70"
        style={{ background: 'var(--cream-dark)', border: '1px solid var(--border)', color: 'var(--terra)' }}>
        {uploading ? 'Enviando...' : '+ Adicionar fotos'}
        <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" disabled={uploading} />
      </label>
    </div>
  )
}
