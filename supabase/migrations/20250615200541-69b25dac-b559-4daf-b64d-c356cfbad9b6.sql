
-- Criação da tabela para vincular contas Instagram Business por usuário (caso não exista)
create table if not exists public.instagram_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  access_token text not null,
  instagram_id text not null,
  page_id text not null,
  username text not null,
  connected_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Garante apenas um registro por user_id (um Instagram conectado por usuário)
create unique index if not exists unique_instagram_account_per_user on public.instagram_accounts(user_id);

-- Habilita Row Level Security
alter table public.instagram_accounts enable row level security;

-- Política: cada usuário pode visualizar sua própria conta Instagram conectada
create policy "Users can view their own instagram account"
  on public.instagram_accounts
  for select
  using (auth.uid() = user_id);

-- Política: cada usuário pode inserir apenas sua própria conta
create policy "Users can insert their own instagram account"
  on public.instagram_accounts
  for insert
  with check (auth.uid() = user_id);

-- Política: cada usuário pode atualizar apenas sua própria conta
create policy "Users can update their own instagram account"
  on public.instagram_accounts
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Política: cada usuário pode excluir sua própria conta Instagram conectada
create policy "Users can delete their own instagram account"
  on public.instagram_accounts
  for delete
  using (auth.uid() = user_id);

-- Trigger para atualizar o updated_at automaticamente
create or replace function update_instagram_accounts_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists t_instagram_accounts_updated_at on public.instagram_accounts;
create trigger t_instagram_accounts_updated_at
  before update on public.instagram_accounts
  for each row
  execute function update_instagram_accounts_updated_at();
