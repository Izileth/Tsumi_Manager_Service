import { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';

type DynamicClanMember = {
  id: string;
  username: string;
  avatar_url: string | null;
  rank: string;
  rank_jp: string;
  bio: string | null;
  loyalty: number;
  strength: number;
  intelligence: number;
};

export function useClanMembers(clanId?: string, isOwner?: boolean, ownerId?: string) {
  const [members, setMembers] = useState<DynamicClanMember[]>([]);
  const [recruitableMembers, setRecruitableMembers] = useState<DynamicClanMember[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    if (!clanId) {
      setMembers([]);
      return;
    }
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, avatar_url, rank, rank_jp, bio, loyalty, strength, intelligence')
      .eq('clan_id', clanId);

    if (error) {
      console.error("Error fetching clan members:", error);
      setMembers([]);
    } else {
      setMembers(data as DynamicClanMember[]);
    }
  };

  const fetchRecruitableMembers = async () => {
    if (!clanId || !isOwner) {
      setRecruitableMembers([]);
      return;
    }
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, avatar_url, rank, rank_jp, bio, loyalty, strength, intelligence')
      .is('clan_id', null);

    if (error) {
      console.error("Error fetching recruitable members:", error);
      setRecruitableMembers([]);
    } else {
      setRecruitableMembers(data as DynamicClanMember[]);
    }
  };

  const recruitMember = async (memberId: string) => {
    if (!clanId) return;
    const { error } = await supabase
      .from('profiles')
      .update({ clan_id: clanId })
      .eq('id', memberId);
    if (error) {
      console.error("Error recruiting member:", error);
    } else {
      // Refetch both lists
      await Promise.all([fetchMembers(), fetchRecruitableMembers()]);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchMembers(),
      fetchRecruitableMembers()
    ]).finally(() => setLoading(false));
  }, [clanId, isOwner]);

  return { members, recruitableMembers, loading, recruitMember };
}
