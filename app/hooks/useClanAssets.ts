import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Territory, Mission, ClanEvent } from '../lib/types';
import { useAuth } from '../context/auth-context';
import Toast from 'react-native-toast-message';
import * as Notifications from 'expo-notifications';

export const useClanAssets = (clanId: string | undefined) => {
  const { user } = useAuth();
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [events, setEvents] = useState<ClanEvent[]>([]);
  const [availableTerritories, setAvailableTerritories] = useState<Territory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAssets = useCallback(async () => {
    if (!clanId) return;
    setLoading(true);

    const [territoryRes, eventRes, availableTerritoriesRes] = await Promise.all([
      supabase.from('territories').select('*').eq('clan_id', clanId),
      supabase.from('clan_events').select('*').eq('clan_id', clanId).order('created_at', { ascending: false }),
      supabase.from('territories').select('*').is('clan_id', null),
    ]);

    const { data: territoryData, error: territoryError } = territoryRes;
    if (territoryError) {
      console.error('Error fetching territories:', territoryError);
      setTerritories([]);
    } else {
      setTerritories(territoryData || []);
    }

    if (eventRes.error) {
      console.error('Error fetching events:', eventRes.error);
      setEvents([]);
    } else {
      setEvents(eventRes.data || []);
    }

    if (availableTerritoriesRes.error) {
      console.error('Error fetching available territories:', availableTerritoriesRes.error);
      setAvailableTerritories([]);
    } else {
      setAvailableTerritories(availableTerritoriesRes.data || []);
    }

    // Fetch missions based on territories
    if (territoryData && territoryData.length > 0) {
      const territoryIds = territoryData.map(t => t.id);
      const { data: missionData, error: missionError } = await supabase
        .from('missions')
        .select('*')
        .in('territory_id', territoryIds);

      if (missionError) {
        console.error('Error fetching missions:', missionError);
        setMissions([]);
      } else {
        setMissions(missionData || []);
      }
    } else {
      setMissions([]);
    }

    setLoading(false);
  }, [clanId]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const createTerritory = async (name: string, description: string) => {
    if (!clanId) return;
    const { data, error } = await supabase
      .from('territories')
      .insert([{ name, description, clan_id: clanId }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating territory:', error);
    } else if (data) {
      await supabase.from('clan_events').insert({
        clan_id: clanId,
        event_type: 'territory_created', // Novo tipo de evento para criação
        description: `Um novo território, ${name}, foi estabelecido.`,
        metadata: { territory_id: data.id }
      });
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Novo território estabelecido!",
          body: `O território ${name} foi estabelecido.`,
        },
        trigger: null,
      });
      Toast.show({ type: "success", text1: "Sucesso", text2: "Território criado.", position: "top", visibilityTime: 3000 });
      await fetchAssets();
    }
  };

  const annexTerritory = async (territoryId: string) => {
    if (!clanId) return;
    const { data, error } = await supabase
      .from('territories')
      .update({ clan_id: clanId })
      .eq('id', territoryId)
      .select();
    
    if (error) {
      console.error('Error annexing territory:', error);
    } else if (data && data.length > 0) {
      const annexedTerritory = data[0];
      await supabase.from('clan_events').insert({
        clan_id: clanId,
        event_type: 'territory_annexed',
        description: `O território ${annexedTerritory.name} foi anexado.`,
        metadata: { territory_id: annexedTerritory.id }
      });
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Novo território anexado!",
          body: `O território ${annexedTerritory.name} foi anexado.`,
        },
        trigger: null,
      });
      Toast.show({ type: "success", text1: "Sucesso", text2: "Território anexado.", position: "top", visibilityTime: 3000 });
      await fetchAssets();
    }
  };

  const createMission = async (data: {
    name: string;
    description: string;
    territoryId: string;
    reward: { money: number; reputation: number };
    level: number;
  }) => {
    const { name, description, territoryId, reward, level } = data;

    const { data: newMission, error } = await supabase
      .from('missions')
      .insert([{ name, description, reward, territory_id: territoryId, level }])
      .select()
      .single();

    if (error) {
      console.error('Error creating mission:', error);
    } else if (newMission) {
      await supabase.from('clan_events').insert({
        clan_id: clanId,
        event_type: 'mission_created',
        description: `Nova missão disponível: ${name}.`,
        metadata: { mission_id: newMission.id }
      });
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Nova missão disponível!",
          body: `A missão "${name}" está agora disponível.`,
        },
        trigger: null,
      });
      Toast.show({ type: "success", text1: "Sucesso", text2: "Missão criada.", position: "top", visibilityTime: 3000 });
      await fetchAssets();
    }
  };

  const completeMission = async (missionId: string) => {
    if (!user) return;
    const { error } = await supabase.rpc('complete_mission', {
      p_mission_id: missionId,
      p_member_id: user.id,
    });

    if (error) {
      console.error('Error completing mission:', error);
    } else {
      Toast.show({ type: "success", text1: "Sucesso", text2: "Missão completada.", position: "top", visibilityTime: 3000 });
      await fetchAssets();
    }
  };

  const updateTerritory = async (id: string, name: string, description: string) => {
    const { error } = await supabase
      .from('territories')
      .update({ name, description })
      .eq('id', id);
    
    if (error) {
      console.error('Error updating territory:', error);
    } else {
      Toast.show({ type: "success", text1: "Sucesso", text2: "Território atualizado.", position: "top", visibilityTime: 3000 });
      await fetchAssets();
    }
  };

  const deleteTerritory = async (id: string) => {
    const { error } = await supabase
      .from('territories')
      .update({ clan_id: null })
      .eq('id', id);

    if (error) {
      console.error('Error abandoning territory:', error);
    } else {
      Toast.show({ type: "success", text1: "Sucesso", text2: "Território abandonado.", position: "top", visibilityTime: 3000 });
      await fetchAssets();
    }
  };

  const updateMission = async (data: {
    id: string;
    name: string;
    description: string;
    territoryId: string;
    reward: { money: number; reputation: number };
    level: number;
  }) => {
    const { id, name, description, territoryId, reward, level } = data;
    const { error } = await supabase
      .from('missions')
      .update({ name, description, reward, territory_id: territoryId, level })
      .eq('id', id);

    if (error) {
      console.error('Error updating mission:', error);
    } else {
      Toast.show({ type: "success", text1: "Sucesso", text2: "Missão atualizada.", position: "top", visibilityTime: 3000 });
      await fetchAssets();
    }
  };

  const deleteMission = async (id: string) => {
    const { error } = await supabase
      .from('missions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting mission:', error);
    } else {
      Toast.show({ type: "success", text1: "Sucesso", text2: "Missão deletada.", position: "top", visibilityTime: 3000 });
      await fetchAssets();
    }
  };

  return { territories, missions, events, availableTerritories, loading, createTerritory, annexTerritory, createMission, completeMission, updateTerritory, deleteTerritory, updateMission, deleteMission };
};
