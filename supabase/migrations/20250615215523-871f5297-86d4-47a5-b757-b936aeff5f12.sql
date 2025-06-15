
-- Criação de tabela para arquivos de download em massa
create table public.downloads_storage (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null, -- quem fez o upload
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  file_type text not null, -- ex: 'video', 'image', 'pdf', 'zip'
  file_url text not null, -- url do arquivo em storage Supabase
  thumbnail_url text, -- url da prévia/imagem associada (opcional)
  title text not null,
  description text,
  category text,
  tags text[],
  size bigint,
  status text default 'active',
  metadata jsonb default '{}'::jsonb
);

-- Index por dono e título para facilidade de busca
create index downloads_storage_owner_idx on public.downloads_storage(owner_id);
create index downloads_storage_title_idx on public.downloads_storage(title);

-- Habilitar RLS para privacidade dos arquivos
alter table public.downloads_storage enable row level security;

-- Permitir que somente o dono visualize/gerencie seus arquivos
create policy "Usuário vê seus próprios arquivos" on public.downloads_storage
  for select using (auth.uid() = owner_id);

create policy "Usuário adiciona arquivos" on public.downloads_storage
  for insert with check (auth.uid() = owner_id);

create policy "Usuário atualiza seus próprios arquivos" on public.downloads_storage
  for update using (auth.uid() = owner_id);

create policy "Usuário deleta seus próprios arquivos" on public.downloads_storage
  for delete using (auth.uid() = owner_id);

