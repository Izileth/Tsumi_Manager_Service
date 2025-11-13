import { View, Text, Image } from 'react-native';
import { KanjiLoader } from '@/components/ui/kanji-loader';

type DynamicClanMember = {
  id: string;
  username: string;
  avatar_url: string | null;
  rank: string;
  rank_jp: string;
  bio: string | null;
  loyalty: number;
  strength: number;
  intelligence: number;
};

type MembersTabProps = {
  members: DynamicClanMember[];
  loading: boolean;
};

export function MembersTab({ members, loading }: MembersTabProps) {
  if (loading) {
    return <View className="items-center p-8"><KanjiLoader /></View>;
  }

  return (
    <View className="mb-8">
      <View className="flex-row items-center mb-4">
        <Text className="text-red-500 text-base font-bold">構成員</Text>
        <View className="flex-1 h-px bg-neutral-800 ml-3" />
      </View>

      {members.map((member) => (
        <View
          key={member.id}
          className="bg-black border border-zinc-900 rounded-lg p-4 mb-3"
        >
          <View className="flex-row justify-between items-start mb-3">
            <View className="flex-row items-center gap-3 flex-1">
              {member.avatar_url ? (
                <View className="w-14 h-14 rounded-full overflow-hidden">
                  <Image source={{ uri: member.avatar_url }} className="w-14 h-14 rounded-full" />
                </View>
              ) : (
                <View className="w-14 h-14 bg-zinc-950 rounded-full flex items-center justify-center">
                  <Text className="text-zinc-600 text-2xl font-bold">{member.username.charAt(0).toUpperCase()}</Text>
                </View>
              )}
              <View className="flex-1">
                <Text className="text-white text-base font-bold mb-1">
                  {member.username}
                </Text>
                <View className="flex-row items-center gap-2">
                  <Text className="text-red-500 text-xs font-semibold">
                    {member.rank_jp}
                  </Text>
                  <Text className="text-neutral-600 text-xs">•</Text>
                  <Text className="text-neutral-400 text-xs">
                    {member.rank}
                  </Text>
                </View>
              </View>
            </View>
            <View className={`px-3 py-1 rounded-full bg-green-950/30`}>
              <Text className={`text-xs font-semibold text-green-500`}>
                ATIVO
              </Text>
            </View>
          </View>

          <Text className="text-neutral-500 text-xs mb-3">
            Especialidade: <Text className="text-neutral-400">{member.bio || "N/A"}</Text>
          </Text>

          <View className="gap-2">
            <View>
              <View className="flex-row justify-between mb-1">
                <Text className="text-neutral-500 text-xs">Lealdade</Text>
                <Text className="text-white text-xs font-semibold">{member.loyalty}%</Text>
              </View>
              <View className="bg-neutral-900 h-1.5 rounded-full overflow-hidden">
                <View className="bg-red-600 h-full" style={{ width: `${Math.min(100, member.loyalty)}%` }} />
              </View>
            </View>

            <View className="flex-row gap-2">
              <View className="flex-1">
                <View className="flex-row justify-between mb-1">
                  <Text className="text-neutral-500 text-xs">Força</Text>
                  <Text className="text-white text-xs">{member.strength}</Text>
                </View>
                <View className="bg-neutral-900 h-1.5 rounded-full overflow-hidden">
                  <View className="bg-orange-600 h-full" style={{ width: `${Math.min(100, member.strength)}%` }} />
                </View>
              </View>

              <View className="flex-1">
                <View className="flex-row justify-between mb-1">
                  <Text className="text-neutral-500 text-xs">Intel.</Text>
                  <Text className="text-white text-xs">{member.intelligence}</Text>
                </View>
                <View className="bg-neutral-900 h-1.5 rounded-full overflow-hidden">
                  <View className="bg-blue-600 h-full" style={{ width: `${Math.min(100, member.intelligence)}%` }} />
                </View>
              </View>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}
