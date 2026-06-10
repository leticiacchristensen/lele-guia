import Image from 'next/image'

export default function SobrePage() {
  return (
    <div>
      {/* Header com círculos */}
      <div className="relative overflow-hidden" style={{ background: 'var(--ink)' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute rounded-full opacity-50" style={{ width: 300, height: 300, background: 'var(--mustard)', top: -80, right: -60 }} />
          <div className="absolute rounded-full opacity-30" style={{ width: 180, height: 180, background: 'var(--terra)', top: 40, right: 160 }} />
          <div className="absolute rounded-full opacity-20" style={{ width: 220, height: 220, background: 'var(--cream)', bottom: -80, left: -40 }} />
        </div>
        <div className="relative max-w-5xl mx-auto px-5 sm:px-8 py-16">
          <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: 'var(--mustard)' }}>quem sou eu</p>
          <h1 className="font-display font-semibold text-white" style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)', lineHeight: 1 }}>
            Olá, eu sou<br />
            <em style={{ color: 'var(--terra)' }}>a Lelê</em>
          </h1>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 items-start">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden"
            style={{ background: 'var(--cream-dark)' }}>
            <Image src="/foto-leticia.jpg" alt="Lelê" fill className="object-cover" />
            {/* Círculo decorativo */}
            <div className="absolute -bottom-5 -left-5 w-20 h-20 rounded-full opacity-70"
              style={{ background: 'var(--terra)' }} />
          </div>

          <div className="pt-4">
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--muted)' }}>
              Este é o meu espaço para registrar os restaurantes que visito e compartilhar
              com quem me pede dicas. Aqui você encontra minha avaliação honesta de cada lugar —
              com tipo de culinária, faixa de preço e onde fica.
            </p>
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--muted)' }}>
              Explore à vontade, e se você também conhece algum lugar da lista, deixa sua avaliação!
            </p>
            <div className="inline-block px-4 py-2 rounded-full text-sm font-medium"
              style={{ background: 'var(--cream-dark)', border: '1px solid var(--border)', color: 'var(--terra)' }}>
              leticiacchristensen@gmail.com
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
