import { View, Text, Image, Pressable } from 'react-native';
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

type RecruitTabProps = {
  recruitableMembers: DynamicClanMember[];
  loading: boolean;
  onRecruit: (memberId: string) => void;
};

export function RecruitTab({ recruitableMembers, loading, onRecruit }: RecruitTabProps) {
  if (loading) {
    return <View className="items-center p-8"><KanjiLoader /></View>;
  }

  return (
    <View className="mb-8">
      <View className="flex-row items-center mb-4">
        <Text className="text-red-500 text-base font-bold">勧誘</Text>
        <View className="flex-1 h-px bg-neutral-800 ml-3" />
      </View>

      {recruitableMembers.map((member) => (
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
            <Pressable
              onPress={() => onRecruit(member.id)}
              className="active:opacity-70"
            >
              <View className="bg-red-600 px-4 mt-3 py-2 rounded-lg">
                <Text className="text-white text-xs font-bold">RECRUTAR</Text>
              </View>
            </Pressable>
          </View>
        </View>
      ))}
    </View>
  );
}
