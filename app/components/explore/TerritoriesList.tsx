import { View, Text } from 'react-native';
import { EnrichedTerritory } from '@/app/hooks/useExploreData';

type TerritoriesListProps = {
  territories: EnrichedTerritory[];
};

export function TerritoriesList({ territories }: TerritoriesListProps) {
  return (
    <View>
      <Text className="text-neutral-300 leading-6 mb-4">
        Uma visão geral de todos os territórios e quem os controla.
      </Text>
      <View className="bg-black border border-zinc-900 rounded-lg p-4">
        {territories.map(territory => (
          <View key={territory.id} className="flex-row items-center justify-between py-2 border-b border-zinc-950 last:border-b-0">
            <View>
              <Text className="text-neutral-300">{territory.name}</Text>
              <Text className="text-neutral-500 text-xs">{territory.districts?.name || 'Local Desconhecido'}</Text>
            </View>
            <Text className={`text-sm font-bold ${territory.clans ? 'text-red-500' : 'text-green-500'}`}>
              {territory.clans ? territory.clans.name : 'Neutro'}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
