import { useState, useEffect, useRef, useCallback } from "react";
import { Pressable, ScrollView, Text, View, ActivityIndicator, TextInput, Alert, Image, Linking } from "react-native";
import { AppBottomSheet } from "../../../components/ui/bottom-sheet";
import { useAuth } from "../../context/auth-context";
import { useUserProfile } from "../../hooks/useUserProfile";
import { supabase } from "../../lib/supabase";
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';
import { ClanManagementModal } from "../../../components/clan-management";
import type { Profile } from "@/app/lib/types";
export default function ProfileScreen() {
  const { logout, user } = useAuth();
  const { profile, loading, error, refetch } = useUserProfile();

  const bottomSheetModalRef = useRef<any>(null);
  const clanSheetRef = useRef<any>(null);
  const handlePresentModal = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  // State for form fields
  const [editUsername, setEditUsername] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editWebsite, setEditWebsite] = useState("");
  const [editGithubUsername, setEditGithubUsername] = useState("");
  const [editTwitterUsername, setEditTwitterUsername] = useState("");
  const [editAvatarUrl, setEditAvatarUrl] = useState<string | null>(null);
  const [editBannerUrl, setEditBannerUrl] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (profile) {
      setEditUsername(profile.username || "");
      setEditBio(profile.bio || "");
      setEditSlug(profile.slug || "");
      setEditWebsite(profile.website || "");
      setEditGithubUsername(profile.github ? profile.github.split('/').pop() ?? '' : '');
      setEditTwitterUsername(profile.twitter ? profile.twitter.split('/').pop() ?? '' : '');
      setEditAvatarUrl(profile.avatar_url || null);
      setEditBannerUrl(profile.banner_url || null);
    }
  }, [profile]);

  const handlePickImage = async (type: 'avatar' | 'banner') => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'É necessário permitir o acesso à galeria para escolher uma imagem.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: type === 'avatar' ? [1, 1] : [16, 9],
      quality: 0.7,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      if (type === 'avatar') {
        setEditAvatarUrl(uri);
      } else {
        setEditBannerUrl(uri);
      }
    }
  };

  const uploadImage = async (uri: string, bucket: 'avatars' | 'banners'): Promise<string | null> => {
    if (!user || !uri.startsWith('file://')) {
      return null;
    }

    const fileExt = uri.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;
    const fileType = `image/${fileExt}`;

    const formData = new FormData();
    formData.append('file', {
      uri,
      name: fileName,
      type: fileType,
    } as any);

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, formData, {
        upsert: true,
      });

    if (error) {
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(data.path);
    return publicUrl;
  };

  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
  };

  const handleSlugChange = (text: string) => {
    setEditSlug(slugify(text));
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      if (newPassword) {
        const { error: passwordError } = await supabase.auth.updateUser({ password: newPassword });
        if (passwordError) throw passwordError;
      }
      if (newEmail && newEmail !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({ email: newEmail });
        if (emailError) throw emailError;
      }

      let finalAvatarUrl = profile?.avatar_url;
      if (editAvatarUrl && editAvatarUrl !== profile?.avatar_url) {
        finalAvatarUrl = await uploadImage(editAvatarUrl, 'avatars') || finalAvatarUrl;
      }

      let finalBannerUrl = profile?.banner_url;
      if (editBannerUrl && editBannerUrl !== profile?.banner_url) {
        finalBannerUrl = await uploadImage(editBannerUrl, 'banners') || finalBannerUrl;
      }

      const finalGithub = editGithubUsername ? `https://github.com/${editGithubUsername}` : null;
      const finalTwitter = editTwitterUsername ? `https://x.com/${editTwitterUsername}` : null;

      const updates = {
        id: user.id,
        username: editUsername,
        bio: editBio,
        slug: editSlug,
        website: editWebsite || null,
        github: finalGithub,
        twitter: finalTwitter,
        avatar_url: finalAvatarUrl,
        banner_url: finalBannerUrl,
        updated_at: new Date().toISOString(),
      };

      const { error: profileError } = await supabase.from('profiles').upsert(updates, { onConflict: 'id' });
      if (profileError) throw profileError;

      Alert.alert("Sucesso", "Perfil atualizado!");
      bottomSheetModalRef.current?.dismiss();
      refetch();
    } catch (e: any) {
      Alert.alert("Erro ao salvar", e.message);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
  };

  if (loading) {
    return <View className="flex-1 justify-center items-center bg-black"><ActivityIndicator size="large" color="#DC2626" /></View>;
  }

  if (error) {
    return <View className="flex-1 justify-center items-center bg-black"><Text className="text-red-500">Erro ao carregar o perfil.</Text></View>;
  }

  if (!profile) {
    return (
      <View className="flex-1 justify-center items-center bg-black px-6">
        <Text className="text-white text-xl font-bold text-center mb-4">Crie seu Perfil</Text>
        <Text className="text-neutral-400 text-center mb-6">Complete seu perfil para começar sua jornada.</Text>
        <Pressable onPress={handlePresentModal} className="p-3 bg-red-600 rounded-lg">
          <Text className="text-white font-bold">Criar Perfil</Text>
        </Pressable>
      </View>
    );
  }

  const SocialLinks = () => (
    <View className="flex-row justify-center items-center gap-4 my-4">
      {profile.website && (
        <Pressable onPress={() => Linking.openURL(profile.website!)}>
          <FontAwesome name="globe" size={24} color="#9ca3af" />
        </Pressable>
      )}
      {profile.github && (
        <Pressable onPress={() => Linking.openURL(profile.github!)}>
          <FontAwesome name="github" size={24} color="#9ca3af" />
        </Pressable>
      )}
      {profile.twitter && (
        <Pressable onPress={() => Linking.openURL(profile.twitter!)}>
          <FontAwesome name="twitter" size={24} color="#9ca3af" />
        </Pressable>
      )}
    </View>
  );

  return (
    <>
      <ScrollView className="flex-1 bg-black">
        {/* HEADER */}
        <View className="relative h-96">
          {profile.banner_url ? (
            <Image source={{ uri: profile.banner_url }} className="absolute inset-0 w-full h-full" />
          ) : (
            <View className="absolute inset-0 bg-gradient-to-b from-red-950 via-red-900 to-black" />
          )}
          <View className="absolute inset-0 bg-black/50" />

          <View className="flex-1 justify-center items-center px-6 pt-16">
            <View className="w-24 h-24 rounded-full items-center justify-center mb-4 border-4 border-red-600">
              {profile.avatar_url ? (
                <Image source={{ uri: profile.avatar_url }} className="w-full h-full rounded-full" />
              ) : (
                <Text className="text-5xl">🐲</Text>
              )}
            </View>

            <Text className="text-2xl font-black text-white tracking-wider text-center mb-1">{profile.slug || 'N/A'}</Text>
            <Text className="text-base font-semibold text-neutral-400 mb-2">{profile.username}</Text>
            <View className="bg-red-600 px-4 py-1.5 rounded-full">
              <Text className="text-white text-xs font-bold tracking-wider">{profile.rank_jp || '...'} • {profile.rank || '...'}</Text>
            </View>
            <SocialLinks />
          </View>
        </View>

        {/* INFORMATION SECTION */}
        <View className="px-6 pt-6 pb-4">
          {/* Bio Card */}
          {profile.bio && (
            <View className="bg-black rounded-xl p-4 mb-4">
              <View className="flex-row items-center mb-2">
                <View className="w-1 h-4 bg-red-600 rounded-full mr-2" />
                <Text className="text-red-500 font-bold text-sm tracking-wider">BIO</Text>
              </View>
              <Text className="text-neutral-300 leading-5">{profile.bio}</Text>
            </View>
          )}

          {/* Stats Grid */}
          <View className="flex-row gap-3 mb-4">
            {/* Level Card */}
            <View className="flex-1 bg-gradient-to-br from-red-950/50 to-neutral-900 border border-red-900/50 rounded-xl p-4">
              <Text className="text-neutral-500 text-xs font-semibold mb-1">LEVEL</Text>
              <View className="flex-row items-baseline">
                <Text className="text-red-500 text-3xl font-black">{profile.level || 1}</Text>
                <Text className="text-red-700 text-lg font-bold ml-1">級</Text>
              </View>
            </View>

            {/* Clan Card */}
            <Pressable onPress={() => clanSheetRef.current?.present()} className="flex-1 bg-black rounded-xl p-4 active:opacity-70">
              <Text className="text-neutral-500 text-xs font-semibold mb-1">CLAN</Text>
              <Text className="text-white text-lg font-bold" numberOfLines={1}>
                {profile.clans?.name || 'Sem Clan'}
              </Text>
              <Text className="text-neutral-600 text-xs">氏族</Text>
            </Pressable>
          </View>

          {/* Username JP Card */}
          {profile.username_jp && (
            <View className="bg-black rounded-xl p-4 mb-4">
              <View className="flex-row items-center mb-2">
                <View className="w-1 h-4 bg-red-600 rounded-full mr-2" />
                <Text className="text-red-500 font-bold text-sm tracking-wider">名前</Text>
              </View>
              <Text className="text-white text-2xl font-bold tracking-wide">{profile.username_jp}</Text>
            </View>
          )}

          {/* Member Since Card */}
          <View className="bg-black rounded-xl p-4 mb-4">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-neutral-500 text-xs font-semibold mb-1">MEMBRO DESDE</Text>
                <Text className="text-white text-lg font-bold">{formatDate(profile.joined_date)}</Text>
              </View>
              <View className="bg-black px-3 py-2 rounded-lg">
                <Text className="text-red-500 text-2xl">龍</Text>
              </View>
            </View>
          </View>

          {/* Decorative Divider */}
          <View className="flex-row items-center justify-center my-6">
            <View className="flex-1 h-px bg-neutral-800" />
            <Text className="text-neutral-700 text-xl mx-4">龍</Text>
            <View className="flex-1 h-px bg-neutral-800" />
          </View>
        </View>

        {/* ACTION BUTTONS */}
        <View className="px-6 pb-6">
          <Pressable onPress={handlePresentModal} className="active:opacity-70 mb-3">
            <View className="bg-black border border-zinc-900 rounded-xl py-3 items-center">
              <Text className="text-white font-bold text-base"> Editar Perfil</Text>
            </View>
          </Pressable>

          <Pressable onPress={logout} className="active:opacity-70">
            <View className="bg-red-900/20 border border-red-800 rounded-xl py-3 items-center">
              <Text className="text-red-400 font-bold text-base"> Sair da Conta</Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>

      <AppBottomSheet ref={bottomSheetModalRef} title="Edição de Perfil" titleJP="プロファイル編集">
        <Text className="text-white font-bold text-lg mb-4">Imagens</Text>
        <View className="flex-row justify-around mb-6">
          <Pressable onPress={() => handlePickImage('avatar')} className="items-center">
            <Image source={{ uri: editAvatarUrl || undefined }} className="w-24 h-24 rounded-full bg-neutral-800 border-2 border-neutral-700 mb-2" />
            <Text className="text-red-400">Alterar Avatar</Text>
          </Pressable>
          <Pressable onPress={() => handlePickImage('banner')} className="items-center">
            <Image source={{ uri: editBannerUrl || undefined }} className="w-40 h-24 rounded-lg bg-neutral-800 border-2 border-neutral-700 mb-2" />
            <Text className="text-red-400">Alterar Banner</Text>
          </Pressable>
        </View>

        <Text className="text-white font-bold text-lg mb-4">Informações Públicas</Text>
        <View className="mb-4">
          <Text className="text-neutral-400 mb-2">Nome de Usuário</Text>
          <TextInput className="bg-black text-white p-3 rounded-lg border border-zinc-900" value={editUsername} onChangeText={setEditUsername} />
        </View>
        <View className="mb-4">
          <Text className="text-neutral-400 mb-2">Bio</Text>
          <TextInput className="bg-black text-white p-3 rounded-lg border border-zinc-900 h-24" value={editBio} onChangeText={setEditBio} multiline textAlignVertical="top" />
        </View>
        <View className="mb-6">
          <Text className="text-neutral-400 mb-2">Slug</Text>
          <TextInput className="bg-black text-white p-3 rounded-lg border border-zinc-900" value={editSlug} onChangeText={handleSlugChange} autoCapitalize="none" />
          <Text className="text-neutral-500 text-xs mt-2">Será formatado como URL. Apenas letras minúsculas, números e hífens.</Text>
        </View>

        <Text className="text-white font-bold text-lg mb-4">Links Sociais</Text>
        <View className="mb-4">
          <Text className="text-neutral-400 mb-2">Website</Text>
          <TextInput className="bg-black text-white p-3 rounded-lg border border-zinc-900" value={editWebsite} onChangeText={setEditWebsite} placeholder="https://seu-site.com" placeholderTextColor="#666" autoCapitalize="none" keyboardType="url" />
        </View>
        <View className="mb-4">
          <Text className="text-neutral-400 mb-2">GitHub</Text>
          <TextInput className="bg-black text-white p-3 rounded-lg border border-zinc-900" value={editGithubUsername} onChangeText={setEditGithubUsername} placeholder="seu-usuario" placeholderTextColor="#666" autoCapitalize="none" />
        </View>
        <View className="mb-6">
          <Text className="text-neutral-400 mb-2">Twitter / X</Text>
          <TextInput className="bg-black text-white p-3 rounded-lg border border-zinc-900" value={editTwitterUsername} onChangeText={setEditTwitterUsername} placeholder="seu-usuario" placeholderTextColor="#666" autoCapitalize="none" />
        </View>

        <Text className="text-white font-bold text-lg mb-4">Informações Privadas</Text>
        <View className="mb-4">
          <Text className="text-neutral-400 mb-2">Novo E-mail</Text>
          <TextInput className="bg-black text-white p-3 rounded-lg border border-zinc-900" value={newEmail} onChangeText={setNewEmail} placeholder={user?.email} placeholderTextColor="#666" keyboardType="email-address" autoCapitalize="none" />
        </View>
        <View className="mb-6">
          <Text className="text-neutral-400 mb-2">Nova Senha</Text>
          <TextInput className="bg-black text-white p-3 rounded-lg border border-zinc-900" value={newPassword} onChangeText={setNewPassword} placeholder="Deixe em branco para não alterar" placeholderTextColor="#666" secureTextEntry />
        </View>

        <Pressable onPress={handleSave} className="p-3  bg-red-600 rounded-lg items-center mb-4">
          <Text className="text-white font-bold text-sm">Salvar Alterações</Text>
        </Pressable>
      </AppBottomSheet>
      <ClanManagementModal
        ref={clanSheetRef}
        profile={profile as Profile}
        refetchProfile={refetch}
      />
    </>
  );
}