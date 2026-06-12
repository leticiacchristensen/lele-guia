import { NextRequest, NextResponse } from 'next/server'

// Proxies a Google Place photo so the API key never reaches the browser
export async function GET(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get('ref')
  const key = process.env.GOOGLE_MAPS_KEY
  if (!ref || !key) return new NextResponse('Not found', { status: 404 })

  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photo_reference=${ref}&key=${key}`,
      { redirect: 'follow', next: { revalidate: 86400 } }
    )
    const contentType = res.headers.get('Content-Type') ?? 'image/jpeg'
    return new NextResponse(res.body, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch {
    return new NextResponse('Error', { status: 500 })
  }
}
