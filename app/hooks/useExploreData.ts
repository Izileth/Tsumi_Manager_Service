import { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import { Clan, Territory, District, GameEvent } from '@/app/lib/types';

export type EnrichedTerritory = Territory & {
  clans: Pick<Clan, 'id' | 'name' | 'tag' | 'emblem'> | null;
  districts: Pick<District, 'id' | 'name'> | null;
};

export function useExploreData() {
  const [clans, setClans] = useState<Clan[]>([]);
  const [territories, setTerritories] = useState<EnrichedTerritory[]>([]);
  const [events, setEvents] = useState<GameEvent[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [
          clansRes,
          territoriesRes,
          eventsRes,
          districtsRes
        ] = await Promise.all([
          supabase.from('clans').select('*'),
          supabase.from('territories').select(`
            *,
            clans (id, name, tag, emblem),
            districts (id, name)
          `),
          supabase.from('events').select('*').order('created_at', { descending: true }).limit(10),
          supabase.from('districts').select('*')
        ]);

        if (clansRes.error) throw clansRes.error;
        if (territoriesRes.error) throw territoriesRes.error;
        if (eventsRes.error) throw eventsRes.error;
        if (districtsRes.error) throw districtsRes.error;

        setClans(clansRes.data as Clan[]);
        setTerritories(territoriesRes.data as EnrichedTerritory[]);
        setEvents(eventsRes.data as GameEvent[]);
        setDistricts(districtsRes.data as District[]);

      } catch (error) {
        console.error('Error fetching explore data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { clans, territories, events, districts, loading };
}
