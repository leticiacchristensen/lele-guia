import Image from 'next/image'

export default function SobrePage() {
  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 items-center">
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden order-last sm:order-first"
          style={{ background: 'var(--cream-dark)' }}>
          <Image
            src="/foto-leticia.jpg"
            alt="Lelê"
            fill
            className="object-cover"
          />
          {/* Decorative circle */}
          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full opacity-30"
            style={{ background: 'var(--terra)' }} />
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: 'var(--terra)' }}>
            quem sou eu
          </p>
          <h1 className="font-display text-4xl leading-tight mb-6" style={{ color: 'var(--ink)' }}>
            Olá,<br />eu sou a <em>Lelê</em>
          </h1>
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--muted)' }}>
            Este é o meu espaço para registrar os restaurantes que visito e compartilhar
            com quem me pede dicas. Aqui você encontra minha avaliação honesta de cada lugar —
            com tipo de culinária, faixa de preço e onde fica.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
            Explore à vontade, e se você também conhece algum lugar da lista, deixa sua avaliação!
          </p>
        </div>
      </div>
    </div>
  )
}
