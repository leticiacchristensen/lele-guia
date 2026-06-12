'use client'

import { useEffect, useRef } from 'react'

export type PlaceResult = {
  name: string
  address: string
  neighborhood: string
  place_id: string
  lat: number | null
  lng: number | null
}

type Props = {
  initialValue?: string
  onPlaceSelect: (result: PlaceResult) => void
  onInputChange?: (value: string) => void
  inputStyle?: React.CSSProperties
  inputClassName?: string
  placeholder?: string
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google: any
  }
}

function loadGoogleMaps(apiKey: string): Promise<void> {
  if (window.google?.maps?.places) return Promise.resolve()
  if (document.getElementById('google-maps-script')) {
    // Script already added, wait for it
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (window.google?.maps?.places) {
          clearInterval(interval)
          resolve()
        }
      }, 100)
    })
  }
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.id = 'google-maps-script'
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
    script.async = true
    script.onload = () => resolve()
    document.head.appendChild(script)
  })
}

export default function AddressAutocomplete({
  initialValue, onPlaceSelect, onInputChange, inputStyle, inputClassName, placeholder,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const autocompleteRef = useRef<any>(null)
  const onPlaceSelectRef = useRef(onPlaceSelect)
  onPlaceSelectRef.current = onPlaceSelect

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY
    if (!apiKey || !inputRef.current) return

    loadGoogleMaps(apiKey).then(() => {
      if (!inputRef.current || autocompleteRef.current) return

      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['establishment'],
        fields: ['name', 'formatted_address', 'place_id', 'geometry', 'address_components'],
        componentRestrictions: { country: 'br' },
      })

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current.getPlace()
        if (!place?.place_id) return

        const comps = place.address_components ?? []
        const neighborhood =
          comps.find((c: { types: string[]; long_name: string }) => c.types.includes('sublocality_level_1'))?.long_name ||
          comps.find((c: { types: string[]; long_name: string }) => c.types.includes('neighborhood'))?.long_name ||
          comps.find((c: { types: string[]; long_name: string }) => c.types.includes('sublocality'))?.long_name ||
          ''

        onPlaceSelectRef.current({
          name: place.name ?? '',
          address: place.formatted_address ?? '',
          neighborhood,
          place_id: place.place_id,
          lat: place.geometry?.location?.lat() ?? null,
          lng: place.geometry?.location?.lng() ?? null,
        })
      })
    })

    return () => {
      if (autocompleteRef.current && window.google?.maps?.event) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current)
        autocompleteRef.current = null
      }
    }
  }, [])

  return (
    <input
      ref={inputRef}
      type="text"
      defaultValue={initialValue ?? ''}
      onChange={(e) => onInputChange?.(e.target.value)}
      placeholder={placeholder ?? 'Digite o nome do restaurante'}
      className={inputClassName}
      style={inputStyle}
      autoComplete="new-password"
    />
  )
}
