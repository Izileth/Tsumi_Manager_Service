import { View, Text, Pressable } from 'react-native';
import { KanjiLoader } from '@/components/ui/kanji-loader';
import { Territory } from '@/app/lib/types';

type TerritoriesTabProps = {
  territories: Territory[];
  loading: boolean;
  isOwner: boolean;
  onAdd: () => void;
  onEdit: (territory: Territory) => void;
};

export function TerritoriesTab({ territories, loading, isOwner, onAdd, onEdit }: TerritoriesTabProps) {
  if (loading) {
    return <View className="items-center p-8"><KanjiLoader /></View>;
  }

  return (
    <View className="mb-8">
      <View className="flex-row items-center mb-4">
        <Text className="text-red-500 text-base font-bold">縄張り</Text>
        <View className="flex-1 h-px bg-neutral-800 ml-3" />
      </View>

      {territories.map((territory) => (
        <View
          key={territory.id}
          className="bg-black border border-zinc-900 rounded-lg p-4 mb-3"
        >
          <View className="flex-row justify-between items-start mb-3">
            <View>
              <Text className="text-white text-lg font-bold mb-1">
                {territory.name}
              </Text>
              <Text className="text-neutral-400 text-xs">
                {territory.description || "Sem descrição."}
              </Text>
            </View>
            {isOwner && (
              <Pressable className="active:opacity-70" onPress={() => onEdit(territory)}>
                <View className="bg-red-600 px-4 py-2 rounded-lg">
                  <Text className="text-white text-xs font-bold">GERENCIAR</Text>
                </View>
              </Pressable>
            )}
          </View>
        </View>
      ))}

      {isOwner && (
        <Pressable className="active:opacity-70 mt-2" onPress={onAdd}>
          <View className="bg-red-950/20 border border-red-900/50 rounded-lg py-3 items-center">
            <Text className="text-red-500 font-bold text-sm">+ EXPANDIR PARA NOVO TERRITÓRIO</Text>
          </View>
        </Pressable>
      )}
    </View>
  );
}
