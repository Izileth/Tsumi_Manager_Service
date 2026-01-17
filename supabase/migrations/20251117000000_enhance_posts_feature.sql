-- 1. Tabela para armazenar hashtags
CREATE TABLE public.hashtags (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  tag TEXT NOT NULL UNIQUE
);
COMMENT ON TABLE public.hashtags IS 'Armazena tags de hashtag únicas.';

-- 2. Tabela de junção para postagens e hashtags (muitos-para-muitos)
CREATE TABLE public.post_hashtags (
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  hashtag_id BIGINT NOT NULL REFERENCES public.hashtags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, hashtag_id)
);
COMMENT ON TABLE public.post_hashtags IS 'Associa hashtags a postagens.';

-- 3. Tabela para comentários das postagens
CREATE TABLE public.post_comments (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  content TEXT NOT NULL,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  parent_comment_id BIGINT REFERENCES public.post_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE public.post_comments IS 'Armazena comentários para as postagens, com suporte a aninhamento.';
COMMENT ON COLUMN public.post_comments.parent_comment_id IS 'ID do comentário pai para respostas aninhadas.';

-- 4. Habilitar RLS nas novas tabelas
ALTER TABLE public.hashtags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_hashtags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;

-- 5. Índices para otimizar consultas
CREATE INDEX idx_hashtags_tag ON public.hashtags(tag);
CREATE INDEX idx_post_hashtags_post_id ON public.post_hashtags(post_id);
CREATE INDEX idx_post_hashtags_hashtag_id ON public.post_hashtags(hashtag_id);
CREATE INDEX idx_post_comments_post_id ON public.post_comments(post_id);
CREATE INDEX idx_post_comments_user_id ON public.post_comments(user_id);
CREATE INDEX idx_post_comments_parent_comment_id ON public.post_comments(parent_comment_id);


-- 6. Políticas de RLS para hashtags
CREATE POLICY "Allow public read access on hashtags"
  ON public.hashtags FOR SELECT USING (true);
  
CREATE POLICY "Allow authenticated users to insert hashtags"
  ON public.hashtags FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 7. Políticas de RLS para post_hashtags
CREATE POLICY "Allow public read access on post_hashtags"
  ON public.post_hashtags FOR SELECT USING (true);
  
CREATE POLICY "Allow users to link hashtags to their own posts"
  ON public.post_hashtags FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND (
    SELECT user_id FROM public.posts WHERE id = post_id
  ) = auth.uid());

CREATE POLICY "Allow users to unlink hashtags from their own posts"
  ON public.post_hashtags FOR DELETE
  USING (auth.role() = 'authenticated' AND (
    SELECT user_id FROM public.posts WHERE id = post_id
  ) = auth.uid());

-- 8. Políticas de RLS para comentários
CREATE POLICY "Allow public read access on comments"
  ON public.post_comments FOR SELECT USING (true);
  
CREATE POLICY "Allow authenticated users to comment"
  ON public.post_comments FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow users to edit their own comments"
  ON public.post_comments FOR UPDATE
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to delete their own comments"
  ON public.post_comments FOR DELETE USING (auth.uid() = user_id);

-- 9. Políticas de armazenamento para imagens de postagens
-- Permite que usuários autenticados façam upload de imagens na pasta 'posts'
CREATE POLICY "Allow authenticated users to upload post images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'assets' AND
    storage.filename(name) ILIKE 'posts/%'
  );

-- Permite que usuários visualizem imagens na pasta 'posts'
CREATE POLICY "Allow public read access to post images"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'assets' AND
    storage.filename(name) ILIKE 'posts/%'
  );

-- Permite que usuários atualizem suas próprias imagens
CREATE POLICY "Allow users to update their own post images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'assets' AND
    auth.uid() = owner AND
    storage.filename(name) ILIKE 'posts/%'
  );

-- Permite que usuários excluam suas próprias imagens
CREATE POLICY "Allow users to delete their own post images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'assets' AND
    auth.uid() = owner AND
    storage.filename(name) ILIKE 'posts/%'
  );
