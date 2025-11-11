import { View, Text, Pressable } from 'react-native';
import { District } from '@/app/lib/types';
import { EnrichedTerritory } from '@/app/hooks/useExploreData';
import { useState } from 'react';

type TerritoryMapProps = {
  districts: District[];
  territories: EnrichedTerritory[];
};

export function TerritoryMap({ districts, territories }: TerritoryMapProps) {
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);

  const territoriesInDistrict = territories.filter(t => t.district_id === selectedDistrict?.id);

  return (
    <View>
      <Text className="text-neutral-300 leading-6 mb-4">
        Tóquio está dividida em distritos estratégicos. Cada território controlado 
        gera receita passiva e influência. Expanda seu domínio com sabedoria.
      </Text>
      
      {/* Map Visualization */}
      <View className="w-full h-64 bg-black border border-zinc-900 rounded-lg mb-4 relative p-2">
        <Text className="text-neutral-600 absolute top-2 left-3 text-xs">MAPA DE TOKYO</Text>
        {districts.map(district => (
          <Pressable
            key={district.id}
            className={`absolute w-8 h-8 rounded-full items-center justify-center border-2 ${selectedDistrict?.id === district.id ? 'border-red-500 bg-red-900/50' : 'border-zinc-700 bg-zinc-900'}`}
            style={{
              left: `${district.map_coordinates.x}%`,
              top: `${district.map_coordinates.y}%`,
            }}
            onPress={() => setSelectedDistrict(district)}
          >
            <Text className="text-white text-[10px] font-bold">{district.name.substring(0, 2)}</Text>
          </Pressable>
        ))}
      </View>

      {/* Selected District Info */}
      {selectedDistrict && (
        <View className="bg-black border border-zinc-900 rounded-lg p-4">
          <Text className="text-white font-bold text-lg mb-3">Distrito de {selectedDistrict.name}</Text>
          {territoriesInDistrict.length > 0 ? (
            territoriesInDistrict.map(territory => (
              <View key={territory.id} className="flex-row items-center justify-between py-2 border-b border-zinc-950 last:border-b-0">
                <Text className="text-neutral-300">{territory.name}</Text>
                <Text className="text-sm text-neutral-500">
                  {territory.clans ? `Controlado por ${territory.clans.name}` : 'Neutro'}
                </Text>
              </View>
            ))
          ) : (
            <Text className="text-neutral-500">Nenhum território notável neste distrito.</Text>
          )}
        </View>
      )}
    </View>
  );
}
