-- 1. Tabela para armazenar as postagens dos usuários
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  content JSONB, -- Usando JSONB para conteúdo rico (texto, imagens, etc.)
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE public.posts IS 'Armazena as postagens criadas pelos usuários, como artigos ou anúncios.';
COMMENT ON COLUMN public.posts.content IS 'Conteúdo da postagem em formato JSONB para flexibilidade.';

-- 2. Tabela para armazenar as reações às postagens
CREATE TABLE public.post_reactions (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL, -- Ex: 'like', 'heart', 'insightful'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT one_reaction_per_user_per_post UNIQUE (post_id, user_id)
);
COMMENT ON TABLE public.post_reactions IS 'Armazena as reações dos usuários a cada postagem.';
COMMENT ON COLUMN public.post_reactions.reaction_type IS 'Tipo de reação (ex: like, heart).';
COMMENT ON CONSTRAINT one_reaction_per_user_per_post ON public.post_reactions IS 'Garante que cada usuário pode ter apenas uma reação por postagem.';

-- 3. Função de gatilho para gerar o slug da postagem a partir do título
CREATE OR REPLACE FUNCTION public.set_post_slug()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Se o slug estiver vazio/nulo ou se o título for alterado, gera um novo slug.
  -- Adiciona um sufixo aleatório para garantir unicidade sem complexidade adicional.
  IF NEW.slug IS NULL OR NEW.slug = '' OR NEW.title <> OLD.title THEN
    NEW.slug := public.slugify(NEW.title) || '-' || substr(md5(random()::text), 0, 7);
  ELSE
    NEW.slug := public.slugify(NEW.slug);
  END IF;
  RETURN NEW;
END;
$$;

-- 4. Gatilho para executar a função antes de inserir ou atualizar uma postagem
CREATE TRIGGER handle_post_slug
  BEFORE INSERT OR UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE PROCEDURE public.set_post_slug();

COMMENT ON TRIGGER handle_post_slug ON public.posts IS 'Gera e formata o slug automaticamente antes de salvar uma postagem.';

-- 5. Habilitar RLS nas novas tabelas
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_reactions ENABLE ROW LEVEL SECURITY;

-- 6. Políticas de RLS para a tabela 'posts'
CREATE POLICY "Allow public read access to all posts"
  ON public.posts
  FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated users to create posts"
  ON public.posts
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow users to update their own posts"
  ON public.posts
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to delete their own posts"
  ON public.posts
  FOR DELETE
  USING (auth.uid() = user_id);

-- 7. Políticas de RLS para a tabela 'post_reactions'
CREATE POLICY "Allow public read access to all reactions"
  ON public.post_reactions
  FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated users to create reactions"
  ON public.post_reactions
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow users to delete their own reactions"
  ON public.post_reactions
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Allow users to update their own reactions"
  ON public.post_reactions
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
