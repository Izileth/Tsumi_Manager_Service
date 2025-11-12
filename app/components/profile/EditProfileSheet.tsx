import { useState, useEffect, forwardRef, useRef, useCallback } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AppBottomSheet } from '@/components/ui/bottom-sheet';
import { CustomButton } from '@/components/ui/custom-button';
import { ImageUpload } from './ImageUpload';
import { ProfileForm } from './ProfileForm';
import { EditJapaneseNameSheet } from './EditJapaneseNameSheet'; // Import the new sheet
import { supabase } from '@/app/lib/supabase';
import type { Profile } from '@/app/lib/types';
import type { User } from '@supabase/supabase-js';

type EditProfileSheetProps = {
  profile: Profile | null;
  user: User | null;
  refetch: () => void;
};

export const EditProfileSheet = forwardRef<any, EditProfileSheetProps>(({ profile, user, refetch }, ref) => {
  const [editUsername, setEditUsername] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [editWebsite, setEditWebsite] = useState('');
  const [editGithubUsername, setEditGithubUsername] = useState('');
  const [editTwitterUsername, setEditTwitterUsername] = useState('');
  const [editAvatarUrl, setEditAvatarUrl] = useState<string | null>(null);
  const [editBannerUrl, setEditBannerUrl] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [editJapaneseName, setEditJapaneseName] = useState('');

  const japaneseNameSheetRef = useRef<any>(null); // Ref for the new sheet

  useEffect(() => {
    if (profile) {
      setEditUsername(profile.username || '');
      setEditBio(profile.bio || '');
      setEditSlug(profile.slug || '');
      setEditWebsite(profile.website || '');
      setEditGithubUsername(profile.github ? profile.github.split('/').pop() ?? '' : '');
      setEditTwitterUsername(profile.twitter ? profile.twitter.split('/').pop() ?? '' : '');
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
      return uri;
    }

    try {
      const fileExt = uri.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      const contentType = fileExt === 'png' ? 'image/png' : 'image/jpeg';

      const response = await fetch(uri);
      const blob = await response.blob();

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, blob, {
          contentType: contentType,
          upsert: true,
        });

      if (error) {
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);
      
      return publicUrl;
      
    } catch (e: any) {
      Alert.alert('Erro ao fazer upload da imagem', e.message);
      return null;
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
        username_jp: editJapaneseName,
      };

      const { error: profileError } = await supabase.from('profiles').upsert(updates, { onConflict: 'id' });
      if (profileError) throw profileError;

      Alert.alert('Sucesso', 'Perfil atualizado!');
      if (typeof (ref as any)?.current?.dismiss === 'function') {
        (ref as any).current.dismiss();
      }
      refetch();
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
        <ImageUpload
          onPickImage={handlePickImage}
          avatarUrl={editAvatarUrl}
          bannerUrl={editBannerUrl}
        />
        <ProfileForm
          user={user}
          username={editUsername}
          setUsername={setEditUsername}
          bio={editBio}
          setBio={setEditBio}
          slug={editSlug}
          handleSlugChange={handleSlugChange}
          website={editWebsite}
          setWebsite={setEditWebsite}
          githubUsername={editGithubUsername}
          setGithubUsername={setEditGithubUsername}
          twitterUsername={editTwitterUsername}
          setTwitterUsername={setEditTwitterUsername}
          newEmail={newEmail}
          setNewEmail={setNewEmail}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          japaneseName={editJapaneseName.split('')}
          onEditJapaneseName={handlePresentJapaneseNameModal} // Pass the handler
        />
        <CustomButton
          title="Salvar Alterações"
          onPress={handleSave}
          isLoading={saving}
          className="w-full bg-red-900/20 border py-3 rounded-sm mb-12 border-red-800"
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
});

// Adicionar displayName para resolver o erro do ESLint
EditProfileSheet.displayName = 'EditProfileSheet';