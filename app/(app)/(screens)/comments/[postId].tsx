import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, Pressable, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { usePostDetails } from '@/app/hooks/use-post-details';
import { CommentItem } from '@/app/components/feed/CommentItem';
import { Send, MessageSquare, ArrowLeft, RefreshCw } from 'lucide-react-native';

export default function CommentsScreen() {
  const router = useRouter();
  const { postId } = useLocalSearchParams<{ postId: string }>();
  const { post, loading, error, fetchPost, addComment } = usePostDetails(postId);
  
  const [commentText, setCommentText] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    setIsSending(true);
    await addComment(commentText);
    setIsSending(false);
    setCommentText('');
  };

  if (loading || !post) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <View className="items-center gap-4">
          <View className="w-20 h-20 bg-red-950/20 rounded-full items-center justify-center">
            <ActivityIndicator size="large" color="#ef4444" />
          </View>
          <Text className="text-neutral-500 text-base">Carregando comentários...</Text>
          <Text className="text-red-600 text-sm">コメント読み込み中</Text>
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
            onPress={() => fetchPost()}
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
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <View className="flex-1 bg-black">
        {/* Header */}
        <View className=" border-b-2 border-red-900/20 bg-black">
          <View className="flex-row items-center px-4 py-4">
            <Pressable 
              onPress={() => router.back()} 
              className="w-10 h-10 bg-transparent rounded-lg items-center justify-center mr-3"
            >
              <ArrowLeft size={20} color="#ef4444" />
            </Pressable>
            
            <View className="flex-1">
              <View className="flex-row items-center gap-2">
                <View className="w-1 h-5 bg-red-600 rounded-full" />
                <Text className="text-xl font-bold text-white">Comentários</Text>
              </View>
              <Text className="text-sm text-neutral-500 ml-3 mt-0.5">
                Respondendo a <Text className="text-red-500 font-bold">@{post.profiles.username}</Text>
              </Text>
            </View>

            {/* Contador de comentários */}
            <View className="bg-red-950/30 border border-red-900/50 rounded-full px-3 py-1">
              <Text className="text-red-500 font-bold text-sm">
                {post.post_comments?.length || 0}
              </Text>
            </View>
          </View>
        </View>

        {/* Lista de Comentários */}
        <FlatList
          data={post.post_comments}
          renderItem={({ item }) => <CommentItem comment={item} />}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16 }}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center py-24">
              <View className="w-20 h-20 bg-red-950/20 rounded-full items-center justify-center mb-6">
                <MessageSquare size={40} color="#7f1d1d" />
              </View>
              <Text className="text-neutral-400 text-lg font-bold mb-2">Nenhum comentário ainda</Text>
              <Text className="text-neutral-600 text-base mb-1">Seja o primeiro a comentar</Text>
              <Text className="text-red-900 text-sm">最初のコメントを残す</Text>
            </View>
          }
        />

        {/* Input de Comentário */}
        <View className="border-t-2 border-red-900/20 bg-black px-4 py-3">
          <View className="flex-row items-center mb-12 gap-3">
            {/* Barra decorativa */}
            <View className="w-1 h-10 bg-red-600 rounded-full" />
            
            {/* Input */}
            <View className="flex-1 bg-black border border-zinc-800 rounded-lg overflow-hidden">
              <TextInput
                value={commentText}
                onChangeText={setCommentText}
                placeholder="Adicionar um comentário..."
                placeholderTextColor="#444"
                className="px-4 py-2.5 text-white"
                multiline
                maxLength={500}
              />
            </View>

            {/* Botão Enviar */}
            <Pressable 
              onPress={handleAddComment} 
              disabled={isSending || !commentText.trim()}
              className={`w-11 h-11 rounded-lg items-center justify-center ${
                isSending || !commentText.trim() 
                  ? 'bg-black border border-zinc-800' 
                  : 'bg-red-600'
              }`}
            >
              <Send 
                size={20} 
                color={isSending || !commentText.trim() ? '#444' : '#ffffff'} 
              />
            </Pressable>
          </View>

          {/* Contador de caracteres */}
          {commentText.length > 0 && (
            <View className="flex-row justify-end mt-1.5 px-1">
              <Text className={`text-xs ${
                commentText.length > 450 
                  ? 'text-red-500' 
                  : 'text-neutral-600'
              }`}>
                {commentText.length}/500
              </Text>
            </View>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}