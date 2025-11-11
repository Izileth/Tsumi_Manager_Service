import { View, Text, Image } from 'react-native';
import { Clan } from '@/app/lib/types';
import { FontAwesome } from '@expo/vector-icons';

type ClansListProps = {
  clans: Clan[];
};

export function ClansList({ clans }: ClansListProps) {
  return (
    <View>
      <Text className="text-neutral-300 leading-6 mb-4">
        As famílias que disputam o poder em Tóquio. Cada uma com sua própria história,
        força e reputação.
      </Text>
      {clans.map(clan => (
        <View key={clan.id} className="bg-black border border-zinc-900 rounded-lg p-4 mb-3 flex-row items-center gap-4">
          {clan.avatar_url ? (
            <Image source={{ uri: clan.avatar_url }} className="w-12 h-12 rounded-full" />
          ) : (
            <View className="w-12 h-12 rounded-full bg-zinc-950 items-center justify-center">
              <Text className="text-white text-xl font-bold">{clan.emblem || '氏'}</Text>
            </View>
          )}
          <View className="flex-1">
            <Text className="text-white font-bold text-base">{clan.name} [{clan.tag}]</Text>
            <View className="flex-row gap-4 mt-1">
              <View className="flex-row items-center gap-1">
                <FontAwesome name="bolt" size={12} color="#f59e0b" />
                <Text className="text-neutral-400 text-xs">{clan.power || 0}</Text>
              </View>
              <View className="flex-row items-center gap-1">
                <FontAwesome name="shield" size={12} color="#3b82f6" />
                <Text className="text-neutral-400 text-xs">{clan.reputation || 0}</Text>
              </View>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}
