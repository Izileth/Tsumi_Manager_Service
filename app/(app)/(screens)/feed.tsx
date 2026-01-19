import React, { useEffect, useRef } from 'react';
import { View, Text, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { usePosts } from '../../hooks/use-posts';
import { PostItem } from '../../components/feed/PostItem';
import { useAuth } from '../../context/auth-context';
import { PlusCircle, FileText, RefreshCw } from 'lucide-react-native';
import { CreatePostSheet } from '../../components/feed/CreatePostSheet';
import { Post } from '@/app/lib/types';

export default function FeedScreen() {
  const { user } = useAuth();
  const { posts, loading, error, fetchPosts, addReaction, deleteReaction, createPost, deletePost, updatePost } = usePosts();

  const createPostSheetRef = useRef<any>(null);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleCreatePost = async (data: { title: string; description: string; content: any; imageUris?: string[]; videoUris?: string[]; tags?: string[] }) => {
    await createPost(data);
  };

  const handleUpdatePost = async (postId: string, data: Partial<Post>) => {
    await updatePost(postId, data);
  };

  const handleEditPost = (post: Post) => {
    createPostSheetRef.current?.present(post);
  };

  if (loading && posts.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <View className="items-center gap-4">
          <View className="w-20 h-20 bg-red-950/20 rounded-full items-center justify-center">
            <ActivityIndicator size="large" color="#ef4444" />
          </View>
          <Text className="text-neutral-500 text-base">Carregando feed...</Text>
          <Text className="text-red-600 text-sm">読み込み中</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-black p-6">
        <View className="items-center">
          <View className="w-20 h-20 bg-red-950/30 rounded-full items-center justify-center mb-6">
            <Text className="text-red-600 text-3xl">⚠</Text>
          </View>

          <Text className="text-red-500 text-center text-lg font-bold mb-2">Erro ao carregar</Text>
          <Text className="text-neutral-500 text-center mb-6">{error}</Text>

          <Pressable
            onPress={() => fetchPosts()}
            className="bg-red-600 px-6 py-3 rounded-lg flex-row items-center gap-2"
          >
            <RefreshCw size={18} color="#fff" />
            <Text className="text-white font-bold">Tentar novamente</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <>
      <View className="flex-1  bg-black">
        <FlatList
          data={posts}
          renderItem={({ item }) => (
            <View className='px-1 '>
              <PostItem
                post={item}
                onReact={addReaction}
                onDeleteReaction={deleteReaction}
                currentUserId={user?.id}
                onDelete={deletePost}
                onEdit={handleEditPost}
              />
            </View>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingTop: 20, flexGrow: 1, paddingBottom: 90 }}
          ListHeaderComponent={
            <View className="mb-6 m-16 mx-2">
              <View className="flex-row items-center mb-2">
                <View className="w-1.5 h-8 bg-red-600 rounded-full mr-3" />
                <View>
                  <Text className="text-3xl font-bold text-white">Feed</Text>
                  <Text className="text-red-600 text-sm tracking-wider">フィード</Text>
                </View>
              </View>
              <View className="h-[2px] bg-gradient-to-r from-red-600 via-red-800 to-transparent mt-2" />
            </View>
          }
          ListEmptyComponent={
            !loading ? (
              <View className="flex-1 justify-center items-center py-20">
                <View className="w-24 h-24 bg-red-950/20 rounded-full items-center justify-center mb-6">
                  <FileText size={48} color="#7f1d1d" />
                </View>
                <Text className="text-neutral-400 text-xl font-bold mb-2">Nenhuma postagem ainda</Text>
                <Text className="text-neutral-600 text-base mb-1">Seja o primeiro a postar algo!</Text>
                <Text className="text-red-900 text-sm">まだ投稿がありません</Text>

                <Pressable
                  onPress={() => createPostSheetRef.current?.present()}
                  className="mt-8 bg-red-600 px-6 py-3 rounded-lg flex-row items-center gap-2"
                >
                  <PlusCircle size={20} color="#fff" />
                  <Text className="text-white font-bold">Criar primeira postagem</Text>
                </Pressable>
              </View>
            ) : null
          }
          onRefresh={fetchPosts}
          refreshing={loading}
        />

        {/* FAB - Floating Action Button */}
        <Pressable
          onPress={() => createPostSheetRef.current?.present()}
          className="absolute bottom-6 right-6 rounded-full w-16 h-16 justify-center items-center"
          style={{
            elevation: 12,
            shadowColor: '#ef4444',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.5,
            shadowRadius: 12,
          }}
        >
          {/* Background com gradiente (simulado com múltiplas camadas) */}
          <View className="absolute inset-0 bg-red-600 rounded-full" />
          <View className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-700 rounded-full opacity-90" />

          {/* Anel externo pulsante */}
          <View className="absolute inset-[-4px] border-2 border-red-600/30 rounded-full" />

          {/* Ícone */}
          <PlusCircle size={32} color="#ffffff" strokeWidth={2.5} />
        </Pressable>

        <CreatePostSheet
          ref={createPostSheetRef}
          onSubmit={handleCreatePost}
          onUpdate={handleUpdatePost}
        />
      </View>
    </>
  );
}