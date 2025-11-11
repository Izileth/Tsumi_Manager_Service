import { View, Text, Pressable } from 'react-native';
import { KanjiLoader } from '@/components/ui/kanji-loader';
import { Mission } from '@/app/lib/types';

type MissionsTabProps = {
  missions: Mission[];
  loading: boolean;
  isOwner: boolean;
  onAdd: () => void;
  onEdit: (mission: Mission) => void;
};

export function MissionsTab({ missions, loading, isOwner, onAdd, onEdit }: MissionsTabProps) {
  if (loading) {
    return <View className="items-center p-8"><KanjiLoader /></View>;
  }

  return (
    <View className="mb-8">
      <View className="flex-row items-center mb-4">
        <Text className="text-red-500 text-base font-bold">任務</Text>
        <View className="flex-1 h-px bg-neutral-800 ml-3" />
      </View>

      <View className="bg-red-950/20 border-l-4 border-red-600 p-4 rounded-r-lg mb-5">
        <Text className="text-neutral-400 text-xs leading-5">
          Missões fortalecem o controle territorial e geram recursos. Escolha seus
          membros sabiamente baseado na dificuldade da operação.
        </Text>
      </View>

      {missions.map((mission) => (
        <View
          key={mission.id}
          className={`mb-4 rounded-lg border p-4 bg-zinc-950 border-neutral-800`}
        >
          <View className="flex-row justify-between items-start mb-3">
            <View className="flex-1">
              <Text className="text-white text-base font-bold mb-1">
                {mission.name}
              </Text>
              <Text className="text-neutral-400 text-xs">
                {mission.description || "Sem descrição."}
              </Text>
            </View>
            <View className="bg-green-950/30 px-3 py-1 rounded-full">
              <Text className="text-green-500 text-xs font-bold">
                {JSON.stringify(mission.reward)}
              </Text>
            </View>
          </View>

          {isOwner && (
            <Pressable className="active:opacity-70" onPress={() => onEdit(mission)}>
              <View className="bg-red-600 rounded-lg py-3 items-center">
                <Text className="text-white font-bold text-sm">
                  GERENCIAR MISSÃO
                </Text>
              </View>
            </Pressable>
          )}
        </View>
      ))}
      
      {isOwner && (
        <Pressable className="active:opacity-70 mt-2" onPress={onAdd}>
          <View className="bg-red-950/20 border border-red-900/50 rounded-lg py-3 items-center">
            <Text className="text-red-500 font-bold text-sm">+ CRIAR NOVA MISSÃO</Text>
          </View>
        </Pressable>
      )}
    </View>
  );
}
