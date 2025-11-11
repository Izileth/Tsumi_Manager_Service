import { View, Text } from 'react-native';
import { Clan, GameEvent, Territory } from '@/app/lib/types';
import { FontAwesome } from '@expo/vector-icons';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type DashboardProps = {
  events: GameEvent[];
  clans: Clan[];
  territories: Territory[];
};

export function Dashboard({ events, clans, territories }: DashboardProps) {
  const totalClans = clans.length;
  const totalTerritories = territories.length;
  const controlledTerritories = territories.filter(t => t.clan_id).length;

  return (
    <View>
      {/* Stats */}
      <View className="flex-row justify-around bg-black border border-zinc-900 rounded-lg p-4 mb-6">
        <View className="items-center">
          <Text className="text-white text-2xl font-bold">{totalClans}</Text>
          <Text className="text-neutral-400 text-xs">Clãs Ativos</Text>
        </View>
        <View className="items-center">
          <Text className="text-white text-2xl font-bold">{totalTerritories}</Text>
          <Text className="text-neutral-400 text-xs">Territórios</Text>
        </View>
        <View className="items-center">
          <Text className="text-white text-2xl font-bold">{controlledTerritories}</Text>
          <Text className="text-neutral-400 text-xs">Controlados</Text>
        </View>
      </View>

      {/* Event Feed */}
      <View>
        <Text className="text-white font-bold text-lg mb-3">Últimos Acontecimentos</Text>
        {events.length > 0 ? (
          events.map(event => (
            <View key={event.id} className="bg-black border border-zinc-900 rounded-lg p-3 mb-3">
              <View className="flex-row items-center">
                <FontAwesome name="history" size={14} color="#9ca3af" style={{ marginRight: 8 }} />
                <Text className="text-neutral-300 text-sm flex-1">{event.description}</Text>
              </View>
              <Text className="text-neutral-500 text-xs text-right mt-1">
                {formatDistanceToNow(new Date(event.created_at), { addSuffix: true, locale: ptBR })}
              </Text>
            </View>
          ))
        ) : (
          <Text className="text-neutral-500 text-center py-4">Nenhum evento recente.</Text>
        )}
      </View>
    </View>
  );
}
