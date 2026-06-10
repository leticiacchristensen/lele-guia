-- Rodar no SQL Editor do Supabase

-- Tabela de perfis (criada automaticamente após signup)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  created_at timestamp with time zone default now()
);

-- Tabela de restaurantes
create table public.restaurants (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  cuisine text not null,
  address text not null,
  lat double precision,
  lng double precision,
  price_range text not null, -- '$', '$$', '$$$', '$$$$'
  price_note text, -- ex: "pratos entre R$40-80"
  my_rating integer not null check (my_rating between 1 and 5),
  my_review text not null,
  photo_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Tabela de avaliações dos visitantes
create table public.reviews (
  id uuid default gen_random_uuid() primary key,
  restaurant_id uuid references public.restaurants on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamp with time zone default now(),
  unique(restaurant_id, user_id)
);

-- RLS (Row Level Security)
alter table public.profiles enable row level security;
alter table public.restaurants enable row level security;
alter table public.reviews enable row level security;

-- Policies: restaurantes são públicos para leitura (mas requer login)
create policy "Autenticados podem ver restaurantes"
  on public.restaurants for select
  to authenticated
  using (true);

-- Só o admin pode inserir/editar (você vai usar seu user_id)
-- Após criar sua conta, substitua 'SEU_USER_ID' pelo seu UUID real
create policy "Admin pode tudo em restaurantes"
  on public.restaurants for all
  using (auth.uid() = 'SEU_USER_ID'::uuid);

-- Reviews: autenticados leem, autenticado cria/edita a própria
create policy "Autenticados veem reviews"
  on public.reviews for select
  to authenticated
  using (true);

create policy "Autenticado cria própria review"
  on public.reviews for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Autenticado edita própria review"
  on public.reviews for update
  to authenticated
  using (auth.uid() = user_id);

-- Storage bucket para fotos
insert into storage.buckets (id, name, public) values ('restaurant-photos', 'restaurant-photos', true);

create policy "Fotos públicas"
  on storage.objects for select
  using (bucket_id = 'restaurant-photos');

create policy "Admin faz upload"
  on storage.objects for insert
  with check (bucket_id = 'restaurant-photos' and auth.uid() = 'SEU_USER_ID'::uuid);
