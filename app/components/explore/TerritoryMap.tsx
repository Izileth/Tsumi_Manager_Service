import { View, Text, Pressable, ScrollView } from 'react-native';
import { District } from '@/app/lib/types';
import { EnrichedTerritory } from '@/app/hooks/useExploreData';
import { useState } from 'react';

type TerritoryListProps = {
  districts: District[];
  territories: EnrichedTerritory[];
};

export function TerritoryMapList({ districts, territories }: TerritoryListProps) {
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

  const filteredTerritories = selectedDistrict
    ? territories.filter(t => t.district_id === selectedDistrict)
    : territories;

  const getDistrictName = (districtId: string) => {
    return districts.find(d => d.id === districtId)?.name || 'Desconhecido';
  };

  const territoriesByDistrict = districts.map(district => ({
    district,
    territories: territories.filter(t => t.district_id === district.id),
    controlledCount: territories.filter(t => t.district_id === district.id && t.clans).length,
    totalCount: territories.filter(t => t.district_id === district.id).length,
  }));

  return (
    <ScrollView className="flex-1">
      <View className="p-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-white text-2xl font-bold mb-2">
            Territórios de Tóquio
          </Text>
          <Text className="text-neutral-400 leading-6">
            Tóquio está dividida em distritos estratégicos. Cada território controlado 
            gera receita passiva e influência. Expanda seu domínio com sabedoria.
          </Text>
        </View>

        {/* District Filter Pills */}
        <View className="mb-6">
          <Text className="text-neutral-500 text-xs font-semibold mb-3 uppercase tracking-wider">
            Filtrar por Distrito
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            <Pressable
              onPress={() => setSelectedDistrict(null)}
              className={`mr-2 px-4 py-2 rounded-full border ${
                selectedDistrict === null 
                  ? 'bg-red-600 border-red-600' 
                  : 'bg-zinc-900 border-zinc-800'
              }`}
            >
              <Text className={`font-medium ${
                selectedDistrict === null ? 'text-white' : 'text-neutral-400'
              }`}>
                Todos
              </Text>
            </Pressable>
            {districts.map(district => (
              <Pressable
                key={district.id}
                onPress={() => setSelectedDistrict(district.id)}
                className={`mr-2 px-4 py-2 rounded-full border ${
                  selectedDistrict === district.id 
                    ? 'bg-red-600 border-red-600' 
                    : 'bg-zinc-900 border-zinc-800'
                }`}
              >
                <Text className={`font-medium ${
                  selectedDistrict === district.id ? 'text-white' : 'text-neutral-400'
                }`}>
                  {district.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Stats Overview - Only show when no district is selected */}
        {!selectedDistrict && (
          <View className="mb-6">
            <Text className="text-neutral-500 text-xs font-semibold mb-3 uppercase tracking-wider">
              Visão Geral
            </Text>
            <View className="flex-row flex-wrap -mx-1">
              {territoriesByDistrict.map(({ district, controlledCount, totalCount }) => (
                <View key={district.id} className="w-1/2 px-1 mb-2">
                  <View className="bg-black border border-zinc-900 rounded-lg p-3">
                    <Text className="text-white font-semibold mb-1">{district.name}</Text>
                    <View className="flex-row items-center justify-between">
                      <Text className="text-neutral-500 text-xs">
                        {controlledCount}/{totalCount} controlados
                      </Text>
                      <View className="bg-zinc-900 px-2 py-1 rounded">
                        <Text className="text-red-500 text-xs font-bold">
                          {totalCount > 0 ? Math.round((controlledCount / totalCount) * 100) : 0}%
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Territory List */}
        <View className="mb-4">
          <Text className="text-neutral-500 text-xs font-semibold mb-3 uppercase tracking-wider">
            {selectedDistrict 
              ? `Territórios em ${districts.find(d => d.id === selectedDistrict)?.name}`
              : 'Todos os Territórios'
            }
          </Text>
          
          {filteredTerritories.length > 0 ? (
            filteredTerritories.map((territory, index) => (
              <View 
                key={territory.id} 
                className={`bg-black border border-zinc-900 rounded-lg p-4 ${
                  index !== filteredTerritories.length - 1 ? 'mb-3' : ''
                }`}
              >
                <View className="flex-row items-start justify-between mb-2">
                  <View className="flex-1">
                    <Text className="text-white font-bold text-base mb-1">
                      {territory.name}
                    </Text>
                    <Text className="text-neutral-500 text-sm">
                      {getDistrictName(territory?.district_id ?? '') }
                    </Text>
                  </View>
                  {territory.clans ? (
                    <View className="bg-red-900/30 border border-red-800/50 px-3 py-1 rounded-full">
                      <Text className="text-red-400 text-xs font-semibold">
                        Controlado
                      </Text>
                    </View>
                  ) : (
                    <View className="bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full">
                      <Text className="text-neutral-500 text-xs font-semibold">
                        Neutro
                      </Text>
                    </View>
                  )}
                </View>
                
                {territory.clans && (
                  <View className="flex-row items-center pt-2 border-t border-zinc-900">
                    <Text className="text-neutral-600 text-xs mr-2">Controlado por</Text>
                    <Text className="text-red-500 text-sm font-semibold">
                      {territory.clans.name}
                    </Text>
                  </View>
                )}
              </View>
            ))
          ) : (
            <View className="bg-black border border-zinc-900 rounded-lg p-8 items-center">
              <Text className="text-neutral-500 text-center">
                Nenhum território encontrado neste distrito.
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

TerritoryMapList.displayName = 'TerritoryMapList';