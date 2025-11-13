import React from 'react';
import { View, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { KanjiLoader } from '@/components/ui/kanji-loader';
import { ClanEvent } from '@/app/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type EventsTabProps = {
  events: ClanEvent[];
  loading: boolean;
};

const EventIcon = ({ type }: { type: string }) => {
  const iconMap: { [key: string]: any } = {
    new_member: { name: 'user-plus', color: '#34d399' },
    territory_annexed: { name: 'map-marker', color: '#f87171' },
    mission_completed: { name: 'check-circle', color: '#60a5fa' },
    default: { name: 'history', color: '#9ca3af' },
  };
  const { name, color } = iconMap[type] || iconMap.default;
  return <FontAwesome name={name} size={16} color={color} />;
};

export function EventsTab({ events, loading }: EventsTabProps) {
  if (loading) {
    return (
      <View className="items-center p-8">
        <KanjiLoader />
      </View>
    );
  }

  return (
    <View className="mb-8">
      <View className="flex-row items-center mb-4">
        <Text className="text-blue-500 text-base font-bold">イベント</Text>
        <View className="flex-1 h-px bg-neutral-800 ml-3" />
      </View>

      <View className="bg-blue-950/20 border-l-4 border-blue-600 p-4 rounded-r-lg mb-5">
        <Text className="text-neutral-400 text-xs leading-5">
          Acontecimentos recentes e marcos importantes para o clã.
        </Text>
      </View>

      {events.length === 0 ? (
        <View className="bg-neutral-900/30 border border-neutral-800 rounded-lg p-8 items-center">
          <FontAwesome name="inbox" size={40} color="#525252" />
          <Text className="text-neutral-500 text-sm mt-3 text-center">
            Nenhum evento registrado ainda.
          </Text>
        </View>
      ) : (
        <View className="space-y-4">
          {events.map((event) => (
            <View
              key={event.id}
              className="flex-row items-start space-x-4 p-3 bg-black border border-neutral-800 rounded-lg"
            >
              <EventIcon type={event.event_type} />
              <View className="flex-1">
                <Text className="text-neutral-300 leading-5">{event.description}</Text>
                <Text className="text-neutral-500 text-xs mt-1">
                  {formatDistanceToNow(new Date(event.created_at), { addSuffix: true, locale: ptBR })}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
