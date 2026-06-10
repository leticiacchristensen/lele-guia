import { supabase } from '@/lib/supabase'
import AdminRestaurantList from '@/components/AdminRestaurantList'
import AddRestaurantForm from '@/components/AddRestaurantForm'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const { data: restaurants } = await supabase
    .from('restaurants')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-semibold text-stone-900 mb-8">Admin</h1>

      <section className="mb-12">
        <h2 className="text-base font-medium text-stone-800 mb-4">Adicionar restaurante</h2>
        <AddRestaurantForm />
      </section>

      <section>
        <h2 className="text-base font-medium text-stone-800 mb-4">Restaurantes cadastrados</h2>
        <AdminRestaurantList restaurants={restaurants ?? []} />
      </section>
    </div>
  )
}
