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
    _mapsCallback?: () => void
  }
}

export default function AddressAutocomplete({
  initialValue, onPlaceSelect, onInputChange, inputStyle, inputClassName, placeholder,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const autocompleteRef = useRef<any>(null)

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY
    if (!apiKey) return

    const init = () => {
      if (!inputRef.current || !window.google?.maps?.places) return
      if (autocompleteRef.current) return

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

        onPlaceSelect({
          name: place.name ?? '',
          address: place.formatted_address ?? '',
          neighborhood,
          place_id: place.place_id,
          lat: place.geometry?.location?.lat() ?? null,
          lng: place.geometry?.location?.lng() ?? null,
        })
      })
    }

    if (window.google?.maps?.places) {
      init()
    } else {
      window._mapsCallback = init
      if (!document.getElementById('google-maps-script')) {
        const s = document.createElement('script')
        s.id = 'google-maps-script'
        s.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=_mapsCallback`
        s.async = true
        document.head.appendChild(s)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
