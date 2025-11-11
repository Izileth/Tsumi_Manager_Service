import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Territory, Mission } from '../lib/types';

export const useClanAssets = (clanId: string | undefined) => {
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAssets = useCallback(async () => {
    if (!clanId) return;
    setLoading(true);

    // Fetch territories
    const { data: territoryData, error: territoryError } = await supabase
      .from('territories')
      .select('*')
      .eq('clan_id', clanId);

    if (territoryError) {
      console.error('Error fetching territories:', territoryError);
      setTerritories([]);
    } else {
      setTerritories(territoryData || []);
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
    const { error } = await supabase
      .from('territories')
      .insert([{ name, description, clan_id: clanId }]);
    
    if (error) {
      console.error('Error creating territory:', error);
    } else {
      await fetchAssets();
    }
  };

  const createMission = async (data: {
    name: string;
    description: string;
    territoryId: string;
    reward: { money: number; reputation: number };
  }) => {
    const { name, description, territoryId, reward } = data;

    const { error } = await supabase
      .from('missions')
      .insert([{ name, description, reward, territory_id: territoryId }]);

    if (error) {
      console.error('Error creating mission:', error);
    } else {
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
      await fetchAssets();
    }
  };

  const deleteTerritory = async (id: string) => {
    const { error } = await supabase
      .from('territories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting territory:', error);
    } else {
      await fetchAssets();
    }
  };

  const updateMission = async (data: {
    id: string;
    name: string;
    description: string;
    territoryId: string;
    reward: { money: number; reputation: number };
  }) => {
    const { id, name, description, territoryId, reward } = data;
    const { error } = await supabase
      .from('missions')
      .update({ name, description, reward, territory_id: territoryId })
      .eq('id', id);

    if (error) {
      console.error('Error updating mission:', error);
    } else {
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
      await fetchAssets();
    }
  };

  return { territories, missions, loading, createTerritory, createMission, updateTerritory, deleteTerritory, updateMission, deleteMission };
};
