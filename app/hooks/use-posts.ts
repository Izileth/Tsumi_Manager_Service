import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Post } from '../lib/types';
import { useAuth } from '../context/auth-context';
import Toast from 'react-native-toast-message';
export const usePosts = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles (*),
          post_reactions (*, profiles (*)),
          post_comments (*, profiles (*)),
          post_hashtags (hashtags (tag))
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Manual mapping to fit the 'hashtags: { tag: string }[]' type
      const mappedData = data.map(post => ({
        ...post,
        hashtags: post.post_hashtags.map((ph: any) => ph.hashtags),
      }));

      setPosts(mappedData as any);

    } catch (e: any) {
      setError(e.message);
      Toast.show({ type: "error", text1: "Erro ao buscar posts", text2: e.message });
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadPostImage = async (imageUri: string): Promise<string | null> => {
    try {
      const fileExt = imageUri.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `posts/${user!.id}/${fileName}`;

      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        name: fileName,
        type: `image/${fileExt}`,
      } as any);

      const { error: uploadError } = await supabase.storage.from('assets').upload(filePath, formData);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('assets').getPublicUrl(filePath);
      return publicUrl;
    } catch (e) {
      Toast.show({ type: "error", text1: "Erro no Upload", text2: "Não foi possível enviar a imagem." });
      return null;
    }
  };

  const createPost = useCallback(async (postData: { title: string; description: string; content: any; imageUri?: string; tags?: string[] }) => {
    if (!user) {
      Toast.show({ type: 'error', text1: 'Você precisa estar logado para postar.' });
      return null;
    }
    setLoading(true);
    try {
      let imageUrl: string | null = null;
      if (postData.imageUri) {
        imageUrl = await uploadPostImage(postData.imageUri);
      }

      const finalContent = {
        ...postData.content,
        images: imageUrl ? [imageUrl] : [],
      };

      const { data: newPost, error } = await supabase
        .from('posts')
        .insert({ 
          title: postData.title,
          description: postData.description,
          content: finalContent,
          user_id: user.id 
        })
        .select()
        .single();
      
      if (error) throw error;

      if (postData.tags && postData.tags.length > 0) {
        const tagsToInsert = postData.tags.map(tag => ({ tag: tag.toLowerCase() }));
        const { data: insertedTags, error: tagError } = await supabase.from('hashtags').upsert(tagsToInsert, { onConflict: 'tag' }).select();
        
        if (tagError) console.error("Error upserting tags:", tagError);

        if (insertedTags) {
          const postHashtagsToInsert = insertedTags.map(tag => ({ post_id: newPost.id, hashtag_id: tag.id }));
          const { error: postHashtagError } = await supabase.from('post_hashtags').insert(postHashtagsToInsert);
          if (postHashtagError) console.error("Error linking hashtags:", postHashtagError);
        }
      }

      await fetchPosts();
      Toast.show({ type: 'success', text1: 'Post criado com sucesso!' });
      return newPost as Post;
    } catch (e: any) {
      setError(e.message);
      Toast.show({ type: "error", text1: "Erro ao criar o post", text2: e.message });
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, fetchPosts]);

  const addComment = useCallback(async (postId: string, content: string, parentCommentId?: number) => {
    if (!user) {
      Toast.show({ type: 'error', text1: 'Você precisa estar logado para comentar.' });
      return;
    }
    try {
      const { error } = await supabase
        .from('post_comments')
        .insert({ post_id: postId, user_id: user.id, content, parent_comment_id: parentCommentId });

      if (error) throw error;
      
      await fetchPosts(); // Refetch to show the new comment
    } catch (e: any) {
      Toast.show({ type: "error", text1: "Erro ao comentar", text2: e.message });
    }
  }, [user, fetchPosts]);


  const addReaction = useCallback(async (postId: string, reactionType: string) => {
    if (!user) {
      Toast.show({ type: 'error', text1: 'Você precisa estar logado para reagir.' });
      return;
    }
    try {
      const { error } = await supabase
        .from('post_reactions')
        .insert({ post_id: postId, user_id: user.id, reaction_type: reactionType });

      if (error) {
        if (error.code === '23505') {
          await deleteReaction(postId);
          await addReaction(postId, reactionType);
          return;
        }
        throw error;
      }
      await fetchPosts();
    } catch (e: any) {
      setError(e.message);
      Toast.show({ type: "error", text1: "Erro ao adicionar reação", text2: e.message });
    }
  }, [user, fetchPosts]);

  const deleteReaction = useCallback(async (postId: string) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('post_reactions')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      await fetchPosts();
    } catch (e: any) {
      setError(e.message);
      Toast.show({ type: "error", text1: "Erro ao remover reação", text2: e.message });
    }
  }, [user, fetchPosts]);

  const deletePost = useCallback(async (postId: string) => {
    try {
      const { error } = await supabase.from('posts').delete().eq('id', postId);
      if (error) throw error;
      
      setPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
      Toast.show({ type: 'success', text1: 'Postagem excluída.' });
    } catch (e: any) {
      Toast.show({ type: "error", text1: "Erro ao excluir a postagem.", text2: e.message });
    }
  }, []);

  const updatePost = useCallback(async (postId: string, updates: Partial<Post>) => {
    try {
      const { data, error } = await supabase.from('posts').update(updates).eq('id', postId).select().single();
      if (error) throw error;

      await fetchPosts(); // Refetch all to be safe
      Toast.show({ type: 'success', text1: 'Postagem atualizada.' });
      return data as Post;
    } catch (e: any) {
      Toast.show({ type: "error", text1: "Erro ao atualizar a postagem.", text2: e.message });
      return null;
    }
  }, [fetchPosts]);

  return { posts, loading, error, fetchPosts, createPost, addReaction, deleteReaction, addComment, deletePost, updatePost };
};

