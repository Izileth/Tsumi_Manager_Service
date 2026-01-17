import { useState, useCallback } from 'react';
import { supabase } from '@/app/lib/supabase';
import { Post } from '@/app/lib/types';
import { useAuth } from '@/app/context/auth-context';
import Toast from 'react-native-toast-message';

export const usePostDetails = (postId: string) => {
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPost = useCallback(async () => {
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
        .eq('id', postId)
        .single();

      if (error) throw error;
      
      const mappedData = {
        ...data,
        hashtags: data.post_hashtags.map((ph: any) => ph.hashtags),
      };

      setPost(mappedData as any);
    } catch (e: any) {
      setError(e.message);
      Toast.show({ type: "error", text1: "Erro ao buscar post", text2: e.message });
    } finally {
      setLoading(false);
    }
  }, [postId]);

  const addComment = useCallback(async (content: string, parentCommentId?: number) => {
    if (!user) {
      Toast.show({ type: 'error', text1: 'Você precisa estar logado para comentar.' });
      return;
    }
    try {
      const { data: newComment, error } = await supabase
        .from('post_comments')
        .insert({ post_id: postId, user_id: user.id, content, parent_comment_id: parentCommentId })
        .select(`*, profiles (*)`)
        .single();

      if (error) throw error;

      // Optimistically update the UI
      setPost(currentPost => {
        if (!currentPost) return null;
        return {
          ...currentPost,
          post_comments: [...currentPost.post_comments, newComment as any],
        };
      });

    } catch (e: any) {
      Toast.show({ type: "error", text1: "Erro ao comentar", text2: e.message });
    }
  }, [user, postId]);

  return { post, loading, error, fetchPost, addComment };
};
