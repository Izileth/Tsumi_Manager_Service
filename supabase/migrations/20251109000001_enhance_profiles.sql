-- 1. Adiciona novas colunas à tabela de perfis para personalização
ALTER TABLE public.profiles
  ADD COLUMN bio text,
  ADD COLUMN slug text,
  ADD COLUMN website_url text,
  ADD COLUMN twitter_handle text,
  ADD COLUMN github_handle text,
  ADD COLUMN banner_url text;

-- Adiciona uma restrição de unicidade e formato para o 'slug'
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_slug_key UNIQUE (slug),
  ADD CONSTRAINT valid_slug CHECK (slug ~ '^[a-z0-9-]+$');

-- 2. Cria os Buckets de Armazenamento para imagens (se ainda não existirem)
-- Bucket para avatares (limite de 5MB)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Bucket para banners (limite de 10MB)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('banners', 'banners', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- 3. Configura as Políticas de Segurança (RLS) para o Armazenamento
-- NOTA: Estas políticas exigem que o frontend faça o upload para um caminho nomeado com o ID do usuário (ex: 'user-id/avatar.png')

-- Políticas para o Bucket de Avatares
CREATE POLICY "Imagens de avatar são publicamente acessíveis."
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Usuários autenticados podem fazer upload de seus próprios avatares."
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Usuários podem atualizar seus próprios avatares."
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Usuários podem deletar seus próprios avatares."
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Políticas para o Bucket de Banners
CREATE POLICY "Imagens de banner são publicamente acessíveis."
  ON storage.objects FOR SELECT
  USING (bucket_id = 'banners');

CREATE POLICY "Usuários autenticados podem fazer upload de seus próprios banners."
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'banners' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Usuários podem atualizar seus próprios banners."
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'banners' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Usuários podem deletar seus próprios banners."
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'banners' AND auth.uid()::text = (storage.foldername(name))[1]);
