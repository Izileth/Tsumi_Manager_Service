import React, { useState } from 'react';
import { View, Text, Image, Pressable, Alert } from 'react-native';
import { Post } from '../../lib/types';
import { useRouter } from 'expo-router';
import { Heart, MessageCircle, MoreHorizontal, Trash2, Edit } from 'lucide-react-native';
import { formatDate } from '../../utils/formatDate';

type PostItemProps = {
  post: Post;
  onReact: (postId: string, reactionType: string) => void;
  onDeleteReaction: (postId: string) => void;
  onCommentPress: () => void;
  onDelete: (postId: string) => void;
  onEdit: (post: Post) => void;
  currentUserId?: string;
};

export function PostItem({ post, onReact, onDeleteReaction, onCommentPress, onDelete, onEdit, currentUserId }: PostItemProps) {
  const router = useRouter();
  const [isMenuVisible, setMenuVisible] = useState(false);

  const isAuthor = post.user_id === currentUserId;
  const userReaction = post.post_reactions.find(r => r.user_id === currentUserId);

  const handleReaction = () => {
    if (userReaction) {
      onDeleteReaction(post.id);
    } else {
      onReact(post.id, 'like');
    }
  };

  const navigateToProfile = () => {
    if (post.profiles.slug) {
      router.push(`/(app)/(public)/${post.profiles.slug}`);
    }
  };

  const handleDelete = () => {
    setMenuVisible(false);
    Alert.alert(
      "Excluir Postagem",
      "Tem certeza que deseja excluir esta postagem? Esta ação é irreversível.",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: () => onDelete(post.id) },
      ]
    );
  };

  const handleEdit = () => {
    setMenuVisible(false);
    onEdit(post);
  };

  return (
    <View className="bg-black border-l-2 border-red-900/30 rounded-lg mb-4 overflow-hidden">
      {/* Post Header */}
      <View className="flex-row items-center p-4 border-b border-zinc-900/50">
        <Pressable onPress={navigateToProfile}>
          <View className="relative">
            <Image
              source={{ uri: post.profiles.avatar_url || 'https://via.placeholder.com/150' }}
              className="w-11 h-11 rounded-full"
            />
            <View className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-red-600 rounded-full border-2 border-zinc-950" />
          </View>
        </Pressable>
        
        <View className="flex-1 ml-3">
          <Pressable onPress={navigateToProfile}>
            <Text className="text-white font-bold text-base">{post.profiles.username}</Text>
          </Pressable>
          <Text className="text-neutral-500 text-xs mt-0.5">{formatDate(post.created_at)}</Text>
        </View>

        {isAuthor && (
          <View>
            <Pressable 
              onPress={() => setMenuVisible(!isMenuVisible)} 
              className="w-8 h-8 items-center justify-center bg-zinc-900 rounded-lg relative"
            >
              <MoreHorizontal size={18} color="#666" />
            </Pressable>
            {isMenuVisible && (
              <View className="absolute top-10 right-0 bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg z-10 w-32">
                <Pressable onPress={handleEdit} className="flex-row items-center gap-2 p-3">
                  <Edit size={16} color="#ccc" />
                  <Text className="text-white">Editar</Text>
                </Pressable>
                <Pressable onPress={handleDelete} className="flex-row items-center gap-2 p-3 border-t border-zinc-800">
                  <Trash2 size={16} color="#ef4444" />
                  <Text className="text-red-500">Excluir</Text>
                </Pressable>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Post Content */}
      <View className="px-4 py-4">
        {/* Título com barra decorativa */}
        <View className="flex-row mb-3">
          <View className="w-1 bg-red-600 rounded-full mr-2" />
          <Text className="flex-1 text-xl font-bold text-white leading-tight">{post.title}</Text>
        </View>

        {post.description && (
          <Text className="text-neutral-300 text-base leading-relaxed mb-3">
            {post.description}
          </Text>
        )}
        
        {post.content?.images && post.content.images[0] && (
          <View className="relative my-3 rounded-lg overflow-hidden">
            <Image
              source={{ uri: post.content.images[0] }}
              className="w-full h-64 rounded-lg"
              resizeMode="cover"
            />
            {/* Overlay gradiente sutil */}
            <View className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </View>
        )}

        {post.hashtags && post.hashtags.length > 0 && (
          <View className="flex-row flex-wrap gap-2 mt-2">
            {post.hashtags.map((ht, index) => (
              ht.tag && (
                <View key={index} className="bg-red-950/20 border border-red-900/30 rounded-md px-2.5 py-1">
                  <Text className="text-red-500 text-xs font-bold">#{ht.tag}</Text>
                </View>
              )
            ))}
          </View>
        )}
      </View>

      {/* Post Actions */}
      <View className="flex-row items-center justify-between px-4 py-3 border-t-2 border-red-900/20 bg-black/30">
        <View className="flex-row items-center gap-6">
          {/* Botão de Like */}
          <Pressable 
            onPress={handleReaction} 
            className="flex-row items-center gap-2"
          >
            <View className={`w-9 h-9 rounded-lg items-center justify-center ${
              userReaction ? 'bg-red-600/20' : 'bg-black'
            }`}>
              <Heart 
                size={18} 
                color={userReaction ? '#ef4444' : '#666'} 
                fill={userReaction ? '#ef4444' : 'transparent'} 
              />
            </View>
            <Text className={`font-bold ${
              userReaction ? 'text-red-500' : 'text-neutral-500'
            }`}>
              {post.post_reactions.length}
            </Text>
          </Pressable>

          {/* Botão de Comentários */}
          <Pressable 
            onPress={onCommentPress} 
            className="flex-row items-center gap-2"
          >
            <View className="w-9 h-9 bg-black rounded-lg items-center justify-center">
              <MessageCircle size={18} color="#666" />
            </View>
            <Text className="text-neutral-500 font-bold">
              {post.post_comments?.length || 0}
            </Text>
          </Pressable>
        </View>

        {/* Indicador visual adicional */}
        <View className="flex-row items-center gap-1">
          <View className="w-1 h-1 bg-red-600 rounded-full" />
          <View className="w-1 h-1 bg-red-700 rounded-full" />
          <View className="w-1 h-1 bg-red-800 rounded-full" />
        </View>
      </View>
    </View>
  );
}