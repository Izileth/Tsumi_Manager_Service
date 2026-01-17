import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { PostComment } from '../../lib/types';
import { formatDate } from '../../utils/formatDate';
import { useRouter } from 'expo-router';

type CommentItemProps = {
  comment: PostComment;
};

export function CommentItem({ comment }: CommentItemProps) {
  const router = useRouter();

  const navigateToProfile = () => {
    if (comment.profiles.slug) {
      router.push(`/(app)/(public)/${comment.profiles.slug}`);
    }
  };

  return (
    <View className="flex-row gap-3 mb-4">
      <Pressable onPress={navigateToProfile}>
        <Image 
          source={{ uri: comment.profiles.avatar_url || 'https://via.placeholder.com/150' }}
          className="w-8 h-8 rounded-full"
        />
      </Pressable>
      <View className="flex-1 bg-neutral-900 rounded-lg p-3">
        <View className="flex-row justify-between items-center mb-1">
          <Pressable onPress={navigateToProfile}>
            <Text className="text-white font-bold text-sm">{comment.profiles.username}</Text>
          </Pressable>
          <Text className="text-neutral-500 text-xs">{formatDate(comment.created_at)}</Text>
        </View>
        <Text className="text-neutral-300">{comment.content}</Text>
      </View>
    </View>
  );
}
