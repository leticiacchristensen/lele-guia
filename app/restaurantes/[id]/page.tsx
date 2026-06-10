import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import StarRating from '@/components/StarRating'
import ReviewSection from '@/components/ReviewSection'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ id: string }> }

const priceLabel: Record<string, string> = {
  '$': 'Econômico', '$$': 'Moderado', '$$$': 'Sofisticado', '$$$$': 'Premium',
}

export default async function RestaurantPage({ params }: Props) {
  const { id } = await params

  const { data: restaurant } = await supabase
    .from('restaurants').select('*').eq('id', id).single()

  if (!restaurant) notFound()

  const { data: reviews } = await supabase
    .from('reviews').select('*').eq('restaurant_id', id).order('created_at', { ascending: false })

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.address)}`

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-10">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm mb-8 transition-opacity hover:opacity-60"
        style={{ color: 'var(--muted)' }}>
        ← Todos os restaurantes
      </Link>

      {restaurant.photo_url && (
        <div className="relative w-full aspect-[16/7] rounded-2xl overflow-hidden mb-8"
          style={{ background: 'var(--cream-dark)' }}>
          <Image src={restaurant.photo_url} alt={restaurant.name} fill className="object-cover" priority />
        </div>
      )}

      <div className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            {restaurant.neighborhood && (
              <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: 'var(--terra)' }}>
                {restaurant.neighborhood}
              </p>
            )}
            <h1 className="font-display text-3xl sm:text-4xl" style={{ color: 'var(--ink)' }}>
              {restaurant.name}
            </h1>
            <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>
              {restaurant.cuisine} · {priceLabel[restaurant.price_range]} ({restaurant.price_range})
              {restaurant.price_note && ` · ${restaurant.price_note}`}
            </p>
          </div>
        </div>
      </div>

      {/* Avaliação da Lelê */}
      <div className="rounded-2xl p-6 mb-6" style={{ background: 'var(--cream-dark)', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-3 mb-3">
          <span className="font-display italic text-sm" style={{ color: 'var(--terra)' }}>avaliação da Lelê</span>
          <StarRating value={restaurant.my_rating} readonly size="sm" />
        </div>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--ink)' }}>{restaurant.my_review}</p>
      </div>

      <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm mb-10 transition-opacity hover:opacity-60"
        style={{ color: 'var(--muted)' }}>
        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        {restaurant.address}
      </a>

      <ReviewSection restaurantId={id} initialReviews={reviews ?? []} />
    </div>
  )
}
