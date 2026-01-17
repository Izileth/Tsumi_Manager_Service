import React, { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { View, Text, TextInput, Pressable, Image } from 'react-native';
import { AppBottomSheet } from '@/components/ui/bottom-sheet';
import { CustomButton } from '@/components/ui/custom-button';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import { Image as ImageIcon, X } from 'lucide-react-native';

type CreatePostSheetProps = {
  onSubmit: (data: { title: string; description: string; content: any; imageUri?: string; tags?: string[] }) => Promise<void>;
};

export const CreatePostSheet = forwardRef(({ onSubmit }: CreatePostSheetProps, ref) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [imageUri, setImageUri] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const sheetRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    present: () => sheetRef.current?.present(),
    dismiss: () => sheetRef.current?.dismiss(),
  }));

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Toast.show({ type: "error", text1: "Permissão necessária" });
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    await onSubmit({
      title,
      description,
      content: { text: description },
      imageUri,
      tags: tagArray,
    });
    
    setIsLoading(false);
    setTitle('');
    setDescription('');
    setTags('');
    setImageUri(undefined);
    sheetRef.current?.dismiss();
  };

  return (
    <AppBottomSheet
      ref={sheetRef}
      title="Nova Postagem"
      titleJP="新しい投稿"
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
            />
          </View>
        </View>
        
        {/* Imagem */}
        <View>
          <View className="flex-row items-center mb-2">
            <View className="w-1 h-4 bg-red-600 mr-2" />
            <Text className="text-neutral-400 text-xs font-bold tracking-widest">IMAGEM</Text>
            <Text className="text-red-600 text-xs ml-1.5">画像</Text>
          </View>
          
          {imageUri ? (
            <View className="relative">
              <Image 
                source={{ uri: imageUri }} 
                className="w-full h-48 rounded-lg"
              />
              <View className="absolute inset-0 bg-black/20 rounded-lg" />
              <Pressable 
                onPress={() => setImageUri(undefined)} 
                className="absolute top-3 right-3 w-8 h-8 bg-black/80 rounded-full items-center justify-center border border-red-600/50"
              >
                <X size={16} color="#ef4444" />
              </Pressable>
              <View className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg" />
            </View>
          ) : (
            <Pressable 
              onPress={handlePickImage} 
              className="border-2 border-dashed border-zinc-800 bg-black rounded-lg py-10 items-center justify-center "
            >
              <View className="items-center gap-2">
                <View className="w-12 h-12 bg-red-950/30 rounded-full items-center justify-center">
                  <ImageIcon size={24} color="#ef4444" />
                </View>
                <Text className="text-neutral-500 text-sm">Anexar Imagem</Text>
                <Text className="text-neutral-700 text-xs">Toque para selecionar</Text>
              </View>
            </Pressable>
          )}
        </View>

        <CustomButton
          title="PUBLICAR"
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