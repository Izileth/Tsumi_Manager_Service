import { ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import { Profile } from '@/app/lib/types';
import { KanjiLoader } from '@/components/ui/kanji-loader';
import { ProfileHeader } from '@/app/components/profile/ProfileHeader';
import { ProfileInfo } from '@/app/components/profile/ProfileInfo';

export default function PublicProfileScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchProfile = async () => {
      setLoading(true);
      setError(null);

      const { data, error: rpcError } = await supabase.rpc('get_profile_by_slug', {
        p_slug: slug,
      });

      if (rpcError) {
        console.error('Error fetching profile by slug:', rpcError);
        setError('Perfil não encontrado ou erro ao carregar.');
        setProfile(null);
      } else {
        setProfile(data as Profile);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [slug]);

  if (loading) {
    return <View className="flex-1 justify-center items-center bg-black"><KanjiLoader /></View>;
  }

  if (error || !profile) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <Stack.Screen options={{ title: 'Perfil não encontrado' }} />
        <Text className="text-red-500">{error || 'Este perfil não foi encontrado.'}</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: profile.username }} />
      <ScrollView className="flex-1 bg-black">
        <ProfileHeader profile={profile} />
        <ProfileInfo
          profile={profile}
          isOwner={false} // Always false for public view
          onClanPress={() => {}}
          onEditJapaneseNamePress={() => {}}
          onEditClanEmblemPress={() => {}}
        />
      </ScrollView>
    </>
  );
}
