-- Migration: Refinar e consolidar as políticas de segurança do armazenamento para imagens de posts.
-- Esta migração garante que as políticas para upload, visualização, atualização e exclusão
-- de imagens em postagens sejam claras, seguras e não conflitantes.
-- As declarações DROP foram removidas para evitar erros de permissão (42501) em ambientes
-- onde o usuário da migração não é o proprietário da tabela storage.objects.

-- 1. Criar o conjunto definitivo de políticas para a pasta 'posts'.
-- Políticas antigas não são removidas, mas estas novas políticas com nomes em português serão adicionadas.

-- 1.1. INSERT: Permite que usuários autenticados façam upload de mídias para seus próprios posts.
-- O caminho do arquivo deve ser 'posts/{user_id}/nome_do_arquivo.ext'.
CREATE POLICY "Usuários podem fazer upload de mídia para seus posts"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'assets' AND
    (storage.foldername(name))[1] = 'posts' AND
    auth.uid()::text = (storage.foldername(name))[2] -- Garante que o usuário só pode enviar para sua própria pasta.
  );

-- 1.2. SELECT: Permite que qualquer pessoa (pública) visualize as mídias na pasta 'posts'.
CREATE POLICY "Mídias de posts são publicamente visíveis"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'assets' AND
    (storage.foldername(name))[1] = 'posts'
  );

-- 1.3. UPDATE: Permite que usuários autenticados atualizem as mídias que eles mesmos enviaram.
CREATE POLICY "Usuários podem atualizar a mídia de seus posts"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'assets' AND
    (storage.foldername(name))[1] = 'posts' AND
    auth.uid()::text = (storage.foldername(name))[2]
  );

-- 1.4. DELETE: Permite que usuários autenticados deletem as mídias que eles mesmos enviaram.
CREATE POLICY "Usuários podem deletar a mídia de seus posts"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'assets' AND
    (storage.foldername(name))[1] = 'posts' AND
    auth.uid()::text = (storage.foldername(name))[2]
  );

COMMENT ON POLICY "Usuários podem fazer upload de mídia para seus posts" ON storage.objects IS 'Permite que um usuário crie arquivos de mídia na sua pasta pessoal de posts (posts/{user_id}).';
COMMENT ON POLICY "Mídias de posts são publicamente visíveis" ON storage.objects IS 'Torna todas as mídias na pasta /posts visíveis publicamente.';
COMMENT ON POLICY "Usuários podem atualizar a mídia de seus posts" ON storage.objects IS 'Permite que um usuário atualize arquivos de mídia na sua pasta pessoal de posts.';
COMMENT ON POLICY "Usuários podem deletar a mídia de seus posts" ON storage.objects IS 'Permite que um usuário delete arquivos de mídia na sua pasta pessoal de posts.';
