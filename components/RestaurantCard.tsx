import Link from 'next/link'
import Image from 'next/image'
import type { Restaurant } from '@/lib/supabase'

type Props = { restaurant: Restaurant }

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

export default function RestaurantCard({ restaurant }: Props) {
  return (
    <Link
      href={`/restaurantes/${restaurant.id}`}
      className="group block rounded-2xl overflow-hidden transition-transform hover:-translate-y-1"
      style={{ background: 'white', border: '1.5px solid var(--border)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
    >
      {/* Foto */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '1/1', background: 'var(--cream-dark)' }}>
        {restaurant.photo_url ? (
          <Image
            src={restaurant.photo_url}
            alt={restaurant.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-display text-5xl italic"
            style={{ color: 'var(--border)' }}>
            ✦
          </div>
        )}
        <span className="absolute top-3 right-3 text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ background: 'white', color: 'var(--terra)', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }}>
          {restaurant.price_range}
        </span>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-display text-base leading-snug mb-1"
          style={{ color: 'var(--ink)' }}>
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

        {/* Tags */}
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
          <span className="text-xs" style={{ color: 'var(--muted)' }}>{priceLabel[restaurant.price_range]}</span>
        </div>
      </div>
    </Link>
  )
}
