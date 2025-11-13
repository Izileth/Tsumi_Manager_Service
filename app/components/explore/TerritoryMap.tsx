import { View, Text } from 'react-native';
import { District } from '@/app/lib/types';
import { EnrichedTerritory } from '@/app/hooks/useExploreData';
import { useState } from 'react';
import MapView, { Marker } from 'expo-maps';
import { mapStyle } from '@/constants/map-style';

type TerritoryMapProps = {
  districts: District[];
  territories: EnrichedTerritory[];
};

// Bounding box for Tokyo area
const TOKYO_REGION = {
  latitude: 35.6895,
  longitude: 139.6917,
  latitudeDelta: 0.4,
  longitudeDelta: 0.4,
};

const convertPercentageToCoords = (x: number, y: number) => {
  const { latitude, longitude, latitudeDelta, longitudeDelta } = TOKYO_REGION;
  const north = latitude + latitudeDelta / 2;
  const south = latitude - latitudeDelta / 2;
  const east = longitude + longitudeDelta / 2;
  const west = longitude - longitudeDelta / 2;

  const lat = south + (y / 100) * (north - south);
  const lon = west + (x / 100) * (east - west);

  return { latitude: lat, longitude: lon };
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
      <View className="w-full h-80 bg-black border border-zinc-900 rounded-lg mb-4 overflow-hidden">
        <MapView
          style={{ flex: 1 }}
          initialRegion={TOKYO_REGION}
          customMapStyle={mapStyle}
          showsUserLocation={false}
          showsMyLocationButton={false}
          scrollEnabled={false}
          zoomEnabled={false}
        >
          {districts.map(district => {
            const coord = convertPercentageToCoords(district.map_coordinates.x, district.map_coordinates.y);
            return (
              <Marker
                key={district.id}
                coordinate={coord}
                onPress={() => setSelectedDistrict(district)}
                tracksViewChanges={false}
              >
                <View className={`w-8 h-8 rounded-full items-center justify-center border-2 ${selectedDistrict?.id === district.id ? 'border-red-500 bg-red-900/50' : 'border-zinc-700 bg-zinc-900'}`}>
                  <Text className="text-white text-[10px] font-bold">{district.name.substring(0, 2).toUpperCase()}</Text>
                </View>
              </Marker>
            );
          })}
        </MapView>
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
