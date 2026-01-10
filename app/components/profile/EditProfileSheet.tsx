import { useState, useEffect, forwardRef, useRef, useCallback, memo } from 'react';
import { Alert, Text, View, TextInput, Pressable, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AppBottomSheet } from '@/components/ui/bottom-sheet';
import { CustomButton } from '@/components/ui/custom-button';
import { EditJapaneseNameSheet } from './EditJapaneseNameSheet';
import { useProfile } from '@/app/context/profile-context';
import { useAuth } from '@/app/context/auth-context';
import type { Profile } from '@/app/lib/types';
import Toast from 'react-native-toast-message';
type EditProfileSheetProps = {};

const formatJapaneseName = (name: string | string[] | null | undefined): string => {
  if (Array.isArray(name)) return name.join('');
  if (typeof name === 'string') {
    if (name.startsWith('[') && name.endsWith(']')) {
      try {
        const parsed = JSON.parse(name.replace(/'/g, '"'));
        if (Array.isArray(parsed)) return parsed.join('');
      } catch (error) { console.error('Error parsing Japanese name:', error); }
    }
    return name;
  }
  return '';
};

export const EditProfileSheet = memo(forwardRef<any, EditProfileSheetProps>((props, ref) => {
  const { profile, updateProfile, uploadProfileAsset } = useProfile();
  const { user } = useAuth();

  const [editUsername, setEditUsername] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [editWebsite, setEditWebsite] = useState('');
  const [editWebsiteWithoutProtocol, setEditWebsiteWithoutProtocol] = useState(''); 
  const [editGithubUsername, setEditGithubUsername] = useState('');
  const [editGithubWithoutProtocol, setEditGithubWithoutProtocol] = useState('');
  const [editTwitterUsername, setEditTwitterUsername] = useState('');
  const [editTwitterWithoutProtocol, setEditTwitterWithoutProtocol] = useState('');
  const [editAvatarUrl, setEditAvatarUrl] = useState<string | null>(null);
  const [editBannerUrl, setEditBannerUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editJapaneseName, setEditJapaneseName] = useState('');

  const japaneseNameSheetRef = useRef<any>(null);

  useEffect(() => {
    if (profile) {
      setEditUsername(profile.username || '');
      setEditBio(profile.bio || '');
      setEditSlug(profile.slug || '');
      setEditWebsite(profile.website_url || '');
      setEditWebsiteWithoutProtocol(profile.website || '');
      // Extract username from full URL
      setEditGithubUsername(profile.github_handle ? profile.github_handle.split('/').pop() ?? '' : '');
      setEditGithubWithoutProtocol(profile.github ? profile.github.split('/').pop() ?? '' : '');
      setEditTwitterUsername(profile.twitter_handle ? profile.twitter_handle.split('/').pop() ?? '' : '');
      setEditTwitterWithoutProtocol(profile.twitter ? profile.twitter.split('/').pop() ?? '' : '');
      setEditAvatarUrl(profile.avatar_url || null);
      setEditBannerUrl(profile.banner_url || null);
      setEditJapaneseName(profile.username_jp || '');
    }
  }, [profile]);

  const handlePresentJapaneseNameModal = useCallback(() => {
    japaneseNameSheetRef.current?.present(editJapaneseName);
  }, [editJapaneseName]);

  const handleSaveJapaneseName = (newName: string) => {
    setEditJapaneseName(newName);
  };

  const handlePickImage = async (type: 'avatar' | 'banner') => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'É necessário permitir o acesso à galeria.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: type === 'avatar' ? [1, 1] : [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const localUri = result.assets[0].uri;
      if (type === 'avatar') {
        setEditAvatarUrl(localUri);
      } else {
        setEditBannerUrl(localUri);
      }
    }
  };

  const slugify = (text: string) => {
    return text.toString().toLowerCase().trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
  };

  const handleSlugChange = (text: string) => {
    setEditSlug(slugify(text));
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      let finalAvatarUrl = editAvatarUrl;
      if (editAvatarUrl && editAvatarUrl.startsWith('file://')) {
        const file = { uri: editAvatarUrl, type: 'image/jpeg', name: 'avatar.jpg' };
        finalAvatarUrl = await uploadProfileAsset(file, 'avatar');
      }

      let finalBannerUrl = editBannerUrl;
      if (editBannerUrl && editBannerUrl.startsWith('file://')) {
        const file = { uri: editBannerUrl, type: 'image/jpeg', name: 'banner.jpg' };
        finalBannerUrl = await uploadProfileAsset(file, 'banner');
      }

      // Construct full URLs from usernames before saving
      const finalGithubUrl = editGithubUsername ? `https://github.com/${editGithubUsername.replace('@', '')}` : null;
      const finalTwitterUrl = editTwitterUsername ? `https://x.com/${editTwitterUsername.replace('@', '')}` : null;

      const updates: Partial<Profile> = {
        id: user.id,
        username: editUsername,
        bio: editBio,
        slug: editSlug,
        website: editWebsiteWithoutProtocol || null,
        website_url: editWebsite || null,
        github_handle: finalGithubUrl || null,
        github: editGithubWithoutProtocol || null,
        twitter_handle: finalTwitterUrl || null,
        twitter: editTwitterWithoutProtocol || null,
        avatar_url: finalAvatarUrl,
        banner_url: finalBannerUrl,
        updated_at: new Date().toISOString(),
        username_jp: editJapaneseName,
      };

      await updateProfile(updates);
      Toast.show({
        type: 'success',
        text1: 'Perfil atualizado com sucesso!'
      })
      if (typeof (ref as any)?.current?.dismiss === 'function') {
        (ref as any).current.dismiss();
      }
    } catch (e: any) {
      Alert.alert('Erro ao salvar', e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <AppBottomSheet
        ref={ref}
        title="Edição de Perfil"
        titleJP="プロファイル編集"
      >
        <Text className="text-white font-bold text-lg mb-4 mt-6">Imagens</Text>
        <View className="flex-row justify-around mb-6">
          <Pressable onPress={() => handlePickImage('avatar')} className="items-center">
            <Image source={{ uri: editAvatarUrl || undefined }} className="w-24 h-24 rounded-full bg-black border-2 border-zinc-900 mb-2" />
            <Text className="text-red-400">Alterar Avatar</Text>
          </Pressable>
          <Pressable onPress={() => handlePickImage('banner')} className="items-center">
            <Image source={{ uri: editBannerUrl || undefined }} className="w-40 h-24 rounded-lg bg-black border-2 border-zinc-900 mb-2" />
            <Text className="text-red-400">Alterar Banner</Text>
          </Pressable>
        </View>

        <Text className="text-white font-bold text-lg mb-4">Informações Públicas</Text>
        <View className="mb-4">
          <Text className="text-neutral-400 mb-2">Nome de Usuário</Text>
          <TextInput className="bg-black text-white p-3 rounded-lg border-zinc-900" value={editUsername} onChangeText={setEditUsername} />
        </View>
        <View className="mb-4">
          <Text className="text-neutral-400 mb-2">Bio</Text>
          <TextInput className="bg-black text-white p-3 rounded-lg border-zinc-900 h-24" value={editBio} onChangeText={setEditBio} multiline textAlignVertical="top" />
        </View>
        <View className="mb-6">
          <Text className="text-neutral-400 mb-2">Slug</Text>
          <TextInput className="bg-black text-white p-3 rounded-lg border-zinc-900" value={editSlug} onChangeText={handleSlugChange} autoCapitalize="none" />
          <Text className="text-neutral-500 text-xs mt-2">Será formatado como URL. Apenas letras minúsculas, números e hífens.</Text>
        </View>

        <Text className="text-white font-bold text-lg mb-4">Links Sociais</Text>
        <View className="mb-4">
          <Text className="text-neutral-400 mb-2">Website</Text>
          <TextInput className="bg-black text-white p-3 rounded-lg border-zinc-900" value={editWebsite} onChangeText={setEditWebsite} placeholder="https://seu-site.com" placeholderTextColor="#666" autoCapitalize="none" keyboardType="url" />
        </View>

        <View className="mb-4">
          <Text className="text-neutral-400 mb-2">GitHub</Text>
          <TextInput className="bg-black text-white p-3 rounded-lg border-zinc-900" value={editGithubUsername} onChangeText={setEditGithubUsername} placeholder="seu-usuario" placeholderTextColor="#666" autoCapitalize="none" />
        </View>


        <View className="mb-6">
          <Text className="text-neutral-400 mb-2">Twitter / X</Text>
          <TextInput className="bg-black text-white p-3 rounded-lg border-zinc-900" value={editTwitterUsername} onChangeText={setEditTwitterUsername} placeholder="seu-usuario" placeholderTextColor="#666" autoCapitalize="none" />
        </View>


        <View className="mb-6">
          <Text className="text-neutral-400 mb-2">Nome Japonês</Text>
          <Pressable onPress={handlePresentJapaneseNameModal} className="bg-black p-3 rounded-lg border border-zinc-900 flex-row justify-center items-center min-h-[50px]">
            <Text className="text-white text-2xl tracking-widest">{formatJapaneseName(editJapaneseName)}</Text>
          </Pressable>
        </View>

        <CustomButton
          title="Salvar Alterações"
          onPress={handleSave}
          isLoading={saving}
          className="w-full bg-red-900/20 border py-3 rounded-sm mb-32 border-red-800"
          textClassName="text-sm text-zinc-50 font-bold"
        />
      </AppBottomSheet>
      <EditJapaneseNameSheet
        ref={japaneseNameSheetRef}
        initialName={editJapaneseName}
        onSave={handleSaveJapaneseName}
      />
    </>
  );
}));

EditProfileSheet.displayName = 'EditProfileSheet';