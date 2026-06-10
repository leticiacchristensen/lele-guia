'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Review } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import StarRating from './StarRating'

type Props = {
  restaurantId: string
  initialReviews: Review[]
}

export default function ReviewSection({ restaurantId, initialReviews }: Props) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [user, setUser] = useState<User | null>(null)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [myReview, setMyReview] = useState<Review | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user) {
        const existing = initialReviews.find((r) => r.user_id === data.user!.id)
        if (existing) {
          setMyReview(existing)
          setRating(existing.rating)
          setComment(existing.comment ?? '')
        }
      }
    })
  }, [initialReviews])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || rating === 0) return
    setSubmitting(true)

    const payload = {
      restaurant_id: restaurantId,
      user_id: user.id,
      rating,
      comment: comment.trim() || null,
    }

    let result
    if (myReview) {
      result = await supabase.from('reviews').update(payload).eq('id', myReview.id).select().single()
    } else {
      result = await supabase.from('reviews').insert(payload).select().single()
    }

    if (!result.error && result.data) {
      const updated = result.data as Review
      setMyReview(updated)
      setReviews((prev) =>
        myReview
          ? prev.map((r) => (r.id === updated.id ? updated : r))
          : [updated, ...prev]
      )
    }
    setSubmitting(false)
  }

  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <h2 className="font-medium text-stone-900">Avaliações dos visitantes</h2>
        {avg && (
          <span className="text-sm text-stone-500">
            {avg} · {reviews.length} {reviews.length === 1 ? 'avaliação' : 'avaliações'}
          </span>
        )}
      </div>

      {user ? (
        <form onSubmit={handleSubmit} className="bg-white border border-stone-200 rounded-xl p-5 mb-6">
          <p className="text-sm font-medium text-stone-700 mb-3">
            {myReview ? 'Sua avaliação' : 'Deixe sua avaliação'}
          </p>
          <StarRating value={rating} onChange={setRating} size="md" />
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Comentário (opcional)"
            rows={3}
            className="mt-3 w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200 resize-none placeholder:text-stone-400"
          />
          <button
            type="submit"
            disabled={submitting || rating === 0}
            className="mt-3 px-4 py-2 bg-stone-900 text-white text-sm rounded-lg hover:bg-stone-700 disabled:opacity-40 transition-colors"
          >
            {submitting ? 'Enviando...' : myReview ? 'Atualizar' : 'Enviar'}
          </button>
        </form>
      ) : (
        <div className="bg-stone-100 rounded-xl p-4 mb-6 text-sm text-stone-500">
          <a href="/entrar" className="text-stone-900 underline underline-offset-2">Entre</a> para deixar sua avaliação.
        </div>
      )}

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-stone-100 pb-4 last:border-0">
            <div className="flex items-center gap-2 mb-1.5">
              <StarRating value={review.rating} readonly size="sm" />
              <span className="text-xs text-stone-400">
                {new Date(review.created_at).toLocaleDateString('pt-BR')}
              </span>
            </div>
            {review.comment && (
              <p className="text-sm text-stone-600">{review.comment}</p>
            )}
          </div>
        ))}
        {reviews.length === 0 && (
          <p className="text-sm text-stone-400">Nenhuma avaliação ainda.</p>
        )}
      </div>
    </div>
  )
}
