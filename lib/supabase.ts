import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null

function getClient(): SupabaseClient {
  if (_client) return _client
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error('Supabase env vars não configuradas. Veja .env.local')
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const ws = typeof window === 'undefined' ? require('ws') : undefined
  _client = createClient(url, key, { realtime: ws ? { transport: ws } : undefined })
  return _client
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    return (getClient() as unknown as Record<string | symbol, unknown>)[prop]
  },
})

export type Restaurant = {
  id: string
  name: string
  cuisine: string
  neighborhood: string | null
  address: string
  lat: number | null
  lng: number | null
  price_range: string
  price_note: string | null
  my_rating: number
  my_review: string
  photo_url: string | null
  tags: string[]
  place_id: string | null
  created_at: string
}

export type RestaurantPhoto = {
  id: string
  restaurant_id: string
  url: string
  position: number
  created_at: string
}

export type Review = {
  id: string
  restaurant_id: string
  user_id: string
  rating: number
  comment: string | null
  created_at: string
  profiles?: { email: string }
}
