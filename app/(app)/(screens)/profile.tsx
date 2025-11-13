import { useState, useRef, useCallback } from "react";
import { ScrollView, Text, View, Alert } from "react-native";
import { useAuth } from '@/app/context/auth-context';
import { useProfile } from "@/app/context/profile-context";
import { ClanManagementModal } from '@/components/clan-management';
import type { Profile } from '@/app/lib/types';
import { CustomButton } from '@/components/ui/custom-button';
import { ProfileHeader } from "@/app/components/profile/ProfileHeader";
import { ProfileInfo } from "@/app/components/profile/ProfileInfo";
import { EditProfileSheet } from "@/app/components/profile/EditProfileSheet";
import { KanjiLoader } from "@/components/ui/kanji-loader";
import { EditJapaneseNameSheet } from "@/app/components/profile/EditJapaneseNameSheet";
import { EditClanEmblemSheet } from "@/app/components/profile/EditClanEmblemSheet";
import { supabase } from "@/app/lib/supabase";

export default function ProfileScreen() {
  const { logout } = useAuth();
  // Data now comes from the single source of truth: ProfileContext
  const { profile, loading, error, refetchProfile, updateProfile } = useProfile();

  const bottomSheetModalRef = useRef<any>(null);
  const clanSheetRef = useRef<any>(null);
  const editJapaneseNameSheetRef = useRef<any>(null);
  const editClanEmblemSheetRef = useRef<any>(null);

  const handlePresentModal = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handlePresentClanModal = useCallback(() => {
    clanSheetRef.current?.present();
  }, []);

  const handlePresentJapaneseNameModal = useCallback(() => {
    editJapaneseNameSheetRef.current?.present(profile?.username_jp);
  }, [profile]);

  const handlePresentClanEmblemModal = useCallback(() => {
    editClanEmblemSheetRef.current?.present(profile?.clans?.emblem);
  }, [profile]);

  // Use the updateProfile function from the context
  const handleSaveJapaneseName = async (name: string) => {
    try {
      await updateProfile({ username_jp: name });
      editJapaneseNameSheetRef.current?.dismiss();
    } catch (e: any) {
      Alert.alert('Erro', 'Não foi possível atualizar o nome japonês.');
      console.error('Error updating japanese name:', e);
    }
  };

  const handleSaveClanEmblem = async (emblem: string[]) => {
    if (!profile?.clan_id) return;
    try {
      const emblemString = emblem.join('');
      const { error } = await supabase
        .from('clans')
        .update({ emblem: emblemString })
        .eq('id', profile.clan_id);
      if (error) throw error;
      await refetchProfile(); // Use refetchProfile from context
    } catch (error: any) {
      Alert.alert('Erro', 'Não foi possível atualizar o emblema do clã.');
      console.error('Error updating clan emblem:', error);
    }
  };

  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
  };

  if (loading) {
    return <View className="flex-1 justify-center items-center bg-black"><KanjiLoader /></View>;
  }

  if (error) {
    return <View className="flex-1 justify-center items-center bg-black"><Text className="text-red-500">Erro ao carregar o perfil.</Text></View>;
  }

  if (!profile) {
    return (
      <View className="flex-1 justify-center items-center bg-black px-6">
        <Text className="text-white text-xl font-bold text-center mb-4">Crie seu Perfil</Text>
        <Text className="text-neutral-400 text-center mb-6">Complete seu perfil para começar sua jornada.</Text>
        <CustomButton title="Criar Perfil" onPress={handlePresentModal} className="w-full" />
        {/* EditProfileSheet no longer needs props */}
        <EditProfileSheet ref={bottomSheetModalRef} />
      </View>
    );
  }

  const isOwner = profile.id === profile.clans?.owner_id;

  return (
    <>
      <ScrollView className="flex-1 bg-black">
        <ProfileHeader profile={profile} />
        <ProfileInfo
          profile={profile}
          isOwner={isOwner}
          onClanPress={handlePresentClanModal}
          onEditJapaneseNamePress={handlePresentJapaneseNameModal}
          onEditClanEmblemPress={handlePresentClanEmblemModal}
        />

        {/* ACTION BUTTONS */}
        <View className="px-6 pb-6">
          <CustomButton
            title="Editar Perfil"
            onPress={handlePresentModal}
            className="w-full bg-black border py-3 border-zinc-900 mb-3"
            textClassName="text-white"
          />
          <CustomButton
            title="Sair da Conta"
            onPress={handleLogout}
            isLoading={loggingOut}
            className="w-full bg-red-900/20 border py-3 border-red-800"
            textClassName="text-red-400"
          />
        </View>
      </ScrollView>

      {/* EditProfileSheet no longer needs props */}
      <EditProfileSheet ref={bottomSheetModalRef} />
      <ClanManagementModal
        ref={clanSheetRef}
        profile={profile as Profile}
        refetchProfile={refetchProfile}
      />
      <EditJapaneseNameSheet
        ref={editJapaneseNameSheetRef}
        initialName={profile?.username_jp || ''}
        onSave={handleSaveJapaneseName}
      />
      <EditClanEmblemSheet
        ref={editClanEmblemSheetRef}
        onSave={handleSaveClanEmblem}
      />
    </>
  );
}