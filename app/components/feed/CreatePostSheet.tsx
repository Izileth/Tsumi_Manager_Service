import React, { useState, forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Image, FlatList } from 'react-native';
import { AppBottomSheet } from '@/components/ui/bottom-sheet';
import { CustomButton } from '@/components/ui/custom-button';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import { Image as ImageIcon, X, Video } from 'lucide-react-native';
import { Post } from '@/app/lib/types';

type MediaAsset = {
  uri: string;
  type: 'image' | 'video';
};

type CreatePostSheetProps = {
  onSubmit: (data: { title: string; description: string; content: any; imageUris?: string[]; videoUris?: string[]; tags?: string[] }) => Promise<void>;
  onUpdate: (postId: string, data: Partial<Post>) => Promise<void>;
};

export const CreatePostSheet = forwardRef(({ onSubmit, onUpdate }: CreatePostSheetProps, ref) => {
  const [postToEdit, setPostToEdit] = useState<Post | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const sheetRef = useRef<any>(null);

  const isEditMode = postToEdit !== null;

  useEffect(() => {
    if (postToEdit) {
      setTitle(postToEdit.title);
      setDescription(postToEdit.description || '');
      setTags(postToEdit.hashtags?.map(h => h.tag).join(', ') || '');
      
      const images: MediaAsset[] = (postToEdit.images || []).map(uri => ({ uri, type: 'image' }));
      const videos: MediaAsset[] = (postToEdit.videos || []).map(uri => ({ uri, type: 'video' }));
      setMedia([...images, ...videos]);

    } else {
      // Reset fields when closing edit mode
      setTitle('');
      setDescription('');
      setTags('');
      setMedia([]);
    }
  }, [postToEdit]);

  useImperativeHandle(ref, () => ({
    present: (post?: Post) => {
      if (post) {
        setPostToEdit(post);
      } else {
        setPostToEdit(null);
      }
      sheetRef.current?.present();
    },
    dismiss: () => sheetRef.current?.dismiss(),
  }));

  const handlePickMedia = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Toast.show({ type: "error", text1: "Permissão necessária" });
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const newAssets = result.assets.map(asset => ({
        uri: asset.uri,
        type: asset.type === 'video' ? 'video' : 'image',
      } as MediaAsset));
      setMedia(prevMedia => [...prevMedia, ...newAssets]);
    }
  };
  
  const removeMedia = (uriToRemove: string) => {
    setMedia(prevMedia => prevMedia.filter(m => m.uri !== uriToRemove));
  };

  const cleanup = () => {
    setIsLoading(false);
    setTitle('');
    setDescription('');
    setTags('');
    setMedia([]);
    setPostToEdit(null);
    sheetRef.current?.dismiss();
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    const imageUris = media.filter(m => m.type === 'image').map(m => m.uri);
    const videoUris = media.filter(m => m.type === 'video').map(m => m.uri);

    if (isEditMode) {
      // NOTE: For simplicity, this replaces all images/videos on every update.
      // A more robust solution might track new vs. existing media to avoid re-uploading.
      await onUpdate(postToEdit.id, {
        title,
        description,
        content: { text: description },
        images: imageUris,
        videos: videoUris,
      });
    } else {
      // Create logic
      await onSubmit({
        title,
        description,
        content: { text: description },
        imageUris,
        videoUris,
        tags: tagArray,
      });
    }
    
    cleanup();
  };

  return (
    <AppBottomSheet
      ref={sheetRef}
      title={isEditMode ? "Editar Postagem" : "Nova Postagem"}
      titleJP={isEditMode ? "投稿を編集" : "新しい投稿"}
      onClose={() => setPostToEdit(null)} // Reset state on close
    >
      <View className="gap-5 pt-4">
        {/* Título */}
        <View>
          <View className="flex-row items-center mb-2">
            <View className="w-1 h-4 bg-red-600 mr-2" />
            <Text className="text-neutral-400 text-xs font-bold tracking-widest">TÍTULO</Text>
            <Text className="text-red-600 text-xs ml-1.5">題名</Text>
          </View>
          <View className="bg-black border-l-2 border-red-900/30 rounded-lg overflow-hidden">
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Título da sua postagem"
              placeholderTextColor="#444"
              className="px-4 py-3.5 text-white"
            />
          </View>
        </View>

        {/* Conteúdo */}
        <View>
          <View className="flex-row items-center mb-2">
            <View className="w-1 h-4 bg-red-600 mr-2" />
            <Text className="text-neutral-400 text-xs font-bold tracking-widest">CONTEÚDO</Text>
            <Text className="text-red-600 text-xs ml-1.5">内容</Text>
          </View>
          <View className="bg-black border-l-2 border-red-900/30 rounded-lg overflow-hidden">
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Escreva o que está pensando..."
              placeholderTextColor="#444"
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              className="px-4 py-3.5 text-white h-28"
            />
          </View>
        </View>

        {/* Hashtags */}
        <View>
          <View className="flex-row items-center mb-2">
            <View className="w-1 h-4 bg-red-600 mr-2" />
            <Text className="text-neutral-400 text-xs font-bold tracking-widest">HASHTAGS</Text>
            <Text className="text-red-600 text-xs ml-1.5">タグ</Text>
          </View>
          <View className="bg-black border-l-2 border-red-900/30 rounded-lg overflow-hidden">
            <TextInput
              value={tags}
              onChangeText={setTags}
              placeholder="ex: #tóquio, #submundo"
              placeholderTextColor="#444"
              className="px-4 py-3.5 text-white"
              editable={!isEditMode} // Disabling tag editing for simplicity
            />
          </View>
        </View>
        
        {/* Mídia */}
        <View>
          <View className="flex-row items-center mb-2">
            <View className="w-1 h-4 bg-red-600 mr-2" />
            <Text className="text-neutral-400 text-xs font-bold tracking-widest">MÍDIA</Text>
            <Text className="text-red-600 text-xs ml-1.5">メディア</Text>
          </View>
          
          {media.length > 0 ? (
            <FlatList
              horizontal
              data={media}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.uri}
              contentContainerClassName="gap-2 py-4"
              renderItem={({ item }) => (
                <View className="relative w-24 h-24">
                  <Image 
                    source={{ uri: item.uri }} 
                    className="w-full h-full rounded-lg"
                  />
                  {item.type === 'video' && (
                    <View className="absolute inset-0 bg-black/50 rounded-lg items-center justify-center">
                      <Video size={24} color="#fff" />
                    </View>
                  )}
                  <Pressable 
                    onPress={() => removeMedia(item.uri)} 
                    className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-black rounded-full items-center justify-center border border-red-600"
                  >
                    <X size={12} color="#ef4444" />
                  </Pressable>
                </View>
              )}
              ListFooterComponent={
                <Pressable 
                  onPress={handlePickMedia} 
                  className="w-24 h-24 border-2 border-dashed border-zinc-800 bg-black rounded-lg items-center justify-center"
                >
                  <ImageIcon size={24} color="#a1a1aa" />
                  <Text className="text-zinc-500 text-xs mt-1">Adicionar</Text>
                </Pressable>
              }
            />
          ) : (
            <Pressable 
              onPress={handlePickMedia} 
              className="border-2 border-dashed border-zinc-800 bg-black rounded-lg py-10 items-center justify-center "
            >
              <View className="items-center gap-2">
                <View className="w-12 h-12 bg-red-950/30 rounded-full items-center justify-center">
                  <ImageIcon size={24} color="#ef4444" />
                </View>
                <Text className="text-neutral-500 text-sm">Anexar Mídias</Text>
                <Text className="text-neutral-700 text-xs">Toque para selecionar</Text>
              </View>
            </Pressable>
          )}
        </View>

        <CustomButton
          title={isEditMode ? "ATUALIZAR" : "PUBLICAR"}
          onPress={handleSubmit}
          isLoading={isLoading}
          className="w-full bg-gradient-to-r from-red-600 to-red-700 border border-red-800 py-3.5"
          textClassName="text-white font-bold tracking-wider"
        />
      </View>
    </AppBottomSheet>
  );
});

CreatePostSheet.displayName = 'CreatePostSheet';