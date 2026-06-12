import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const placeId = req.nextUrl.searchParams.get('place_id')
  const key = process.env.GOOGLE_MAPS_KEY
  if (!placeId || !key) return NextResponse.json({ refs: [] })

  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${key}`,
      { next: { revalidate: 86400 } }
    )
    const data = await res.json()
    const refs: string[] = (data.result?.photos ?? [])
      .slice(0, 6)
      .map((p: { photo_reference: string }) => p.photo_reference)
    return NextResponse.json({ refs })
  } catch {
    return NextResponse.json({ refs: [] })
  }
}
