'use client'

export const ALL_TAGS = [
  'Almoço',
  'Jantar',
  'Jantar especial',
  'Buffet',
  'Com crianças',
  'Romântico',
  'Vista bonita',
]

type Props = {
  selected: string[]
  onChange: (tags: string[]) => void
}

export default function TagSelector({ selected, onChange }: Props) {
  const toggle = (tag: string) => {
    onChange(selected.includes(tag) ? selected.filter(t => t !== tag) : [...selected, tag])
  }

  return (
    <div className="flex flex-wrap gap-2">
      {ALL_TAGS.map(tag => (
        <button
          key={tag}
          type="button"
          onClick={() => toggle(tag)}
          className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
          style={{
            background: selected.includes(tag) ? 'var(--mustard)' : 'var(--cream-dark)',
            color: selected.includes(tag) ? '#fff' : 'var(--muted)',
            border: `1px solid ${selected.includes(tag) ? 'var(--mustard)' : 'var(--border)'}`,
          }}
        >
          {tag}
        </button>
      ))}
    </div>
  )
}
