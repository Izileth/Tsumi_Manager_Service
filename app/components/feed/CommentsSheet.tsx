import React, { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { View, Text, TextInput, FlatList, Pressable } from 'react-native';
import { AppBottomSheet } from '@/components/ui/bottom-sheet';
import { Post } from '@/app/lib/types';
import { CommentItem } from './CommentItem';
import { Send, MessageSquare } from 'lucide-react-native';

type CommentsSheetProps = {
  post: Post | null;
  onAddComment: (postId: string, content: string) => Promise<void>;
};

export const CommentsSheet = forwardRef(({ post, onAddComment }: CommentsSheetProps, ref) => {
  const [commentText, setCommentText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const sheetRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    present: () => sheetRef.current?.present(),
    dismiss: () => sheetRef.current?.dismiss(),
  }));

  const handleAddComment = async () => {
    if (!commentText.trim() || !post) return;
    setIsLoading(true);
    await onAddComment(post.id, commentText);
    setIsLoading(false);
    setCommentText('');
  };

  return (
    <AppBottomSheet
      ref={sheetRef}
      title="Comentários"
      titleJP="コメント"
    >
      <View className="flex-1 pt-4">
        {/* Lista de Comentários */}
        <FlatList
          data={post?.post_comments || []}
          renderItem={({ item }) => <CommentItem comment={item} />}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center py-20">
              <View className="w-16 h-16 bg-red-950/20 rounded-full items-center justify-center mb-4">
                <MessageSquare size={32} color="#7f1d1d" />
              </View>
              <Text className="text-neutral-500 text-base">Nenhum comentário ainda</Text>
              <Text className="text-neutral-700 text-sm mt-1">Seja o primeiro a comentar</Text>
            </View>
          }
        />

        {/* Input de Comentário */}
        <View className="border-t-2 border-red-900/20 bg-zinc-950 px-4 py-3">
          <View className="flex-row items-center gap-3">
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
              disabled={isLoading || !commentText.trim()}
              className={`w-11 h-11 rounded-lg items-center justify-center ${
                isLoading || !commentText.trim() 
                  ? 'bg-zinc-900' 
                  : 'bg-red-600'
              }`}
            >
              <Send 
                size={20} 
                color={isLoading || !commentText.trim() ? '#444' : '#ffffff'} 
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
    </AppBottomSheet>
  );
});

CommentsSheet.displayName = 'CommentsSheet';