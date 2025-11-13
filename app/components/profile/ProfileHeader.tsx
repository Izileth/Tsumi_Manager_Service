import { FontAwesome } from '@expo/vector-icons';
import { Image, Linking, Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { Profile } from '@/app/lib/types';

type ProfileHeaderProps = {
  profile: Profile;
};

const SocialLinks = ({ profile }: ProfileHeaderProps) => (
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

    {profile.twitter_handle && (
      <Pressable onPress={() => Linking.openURL(profile.twitter_handle!)}>
        <FontAwesome name="twitter" size={24} color="#9ca3af" />
      </Pressable>
    )}
    {profile.github_handle && (
      <Pressable onPress={() => Linking.openURL(profile.github_handle!)}>
        <FontAwesome name="github" size={24} color="#9ca3af" />
      </Pressable>
    )}
    {profile.website_url && (
      <Pressable onPress={() => Linking.openURL(profile.website_url!)}>
        <FontAwesome name="globe" size={24} color="#9ca3af" />
      </Pressable>
    )}
    
  </View>
);

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <View className="relative h-96 ">
      {profile.banner_url ? (
        <Image source={{ uri: profile.banner_url }} className="absolute inset-0 w-full h-full" />
      ) : (
        <View className="absolute inset-0 bg-gradient-to-b from-red-950 via-red-900 to-black" />
      )}

      {/* Degradê escurecendo a imagem */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)', '#000000']}
        locations={[0, 0.5, 0.8, 1]}
        className="absolute inset-0"
      />

      <View className="flex-1 justify-center z-10 items-center px-6 pt-16">
        <View className="w-24 h-24 rounded-full items-center justify-center mb-4 border-4 border-red-600">
          {profile.avatar_url ? (
            <Image source={{ uri: profile.avatar_url }} className="w-full h-full rounded-full" />
          ) : (
            <Text className="text-5xl">🐲</Text>
          )}
        </View>

        <Text className="text-2xl font-black text-white tracking-wider text-center mb-1">t/{profile.slug || 'N/A'}</Text>
        <Text className="text-base font-semibold text-neutral-400 mb-2">{profile.username}</Text>
        <View className="bg-red-600 px-4 py-1.5 rounded-full">
          <Text className="text-white text-xs font-bold tracking-wider">{profile.rank_jp || '...'} • {profile.rank || '...'}</Text>
        </View>
        <SocialLinks profile={profile} />
      </View>

      <View className="absolute bottom-0 inset-0 bg-black/80" />
      <View className="absolute left-0 top-40 w-1 h-32 bg-red-600" />
      <View className="absolute right-0 top-40 w-1 h-32 bg-red-600" />
    </View>
  );
}