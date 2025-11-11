import { Pressable, Text, View } from 'react-native';
import type { Profile } from '@/app/lib/types';

type ProfileInfoProps = {
  profile: Profile;
  onClanPress: () => void;
  onEditJapaneseNamePress: () => void;
    japaneseName: string;
  onEditClanEmblemPress: () => void;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
};

export function ProfileInfo({
  profile,
  onClanPress,
  onEditJapaneseNamePress,
  onEditClanEmblemPress,
}: ProfileInfoProps) {
  return (
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
          <View className="flex-row items-center">
            <View className=" flex flex-row  justify-between items-baseline">
              <Text className="text-red-500 text-3xl font-black">{profile.level || 1}</Text>
              <Text className="text-red-700 text-lg font-bold ml-1">
                {profile.level_name_jp || 0}
              </Text>
            </View>
            <View>
              <Text className="text-neutral-600 text-xs ml-2">{profile.level_name || '...'}</Text>
              <Text className="text-neutral-600 text-xs ml-2">{profile.experience || '...'} XP</Text>
            </View>
          </View>
        </View>

        {/* Clan Card */}
        <Pressable
          onPress={onClanPress}
          className="flex-1 bg-black rounded-xl p-4 active:opacity-70">
          <Text className="text-neutral-500 text-xs font-semibold mb-1">CLAN</Text>
          <Text className="text-white text-lg font-bold" numberOfLines={1}>
            {profile.clans?.name || 'Sem Clan'}
          </Text>
          <Text className="text-neutral-600 text-xs">氏族</Text>
        </Pressable>
      </View>

      {/* Username JP Card */}
      <View className="flex-row gap-3">
        <Pressable
          onPress={onEditJapaneseNamePress}
          className="active:opacity-70 flex-1"
          style={{ flexBasis: '60%' }}>
          <View className="bg-black rounded-xl p-4 mb-4">
            <View className="flex-row items-center mb-2">
              <View className="w-1 h-4 bg-red-600 rounded-full mr-2" />
              <Text className="text-red-500 font-bold text-sm tracking-wider">名前</Text>
            </View>
            <Text className="text-white text-2xl font-bold tracking-wide">
              {profile.username_jp || '...'}
            </Text>
          </View>
        </Pressable>
        {profile.clan_id && (
          <Pressable
            onPress={onEditClanEmblemPress}
            className="active:opacity-70 flex-1"
            style={{ flexBasis: '40%' }}>
            <View className="bg-black rounded-xl p-4 mb-4 items-center justify-center">
              <View className="flex-row items-center mb-2">
                <View className="w-1 h-4 bg-red-600 rounded-full mr-2" />
                <Text className="text-red-500 font-bold text-sm tracking-wider">紋章</Text>
              </View>
              <Text className="text-white text-2xl font-bold tracking-wide">
                {profile.clans?.emblem || '...'}
              </Text>
            </View>
          </Pressable>
        )}
      </View>

      {/* Member Since Card */}
      <View className="bg-black rounded-xl p-4 mb-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-neutral-500 text-xs font-semibold mb-1">MEMBRO DESDE</Text>
            <Text className="text-white text-lg font-bold">
              {formatDate(profile?.joined_date || '2025')}
            </Text>
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
  );
}
