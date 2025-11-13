import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/app/lib/supabase';

type DynamicClanMember = {
  id: string;
  username:string;
  avatar_url: string | null;
  rank: string;
  rank_jp: string;
  bio: string | null;
  level: number;
  loyalty: number;
  strength: number;
  intelligence: number;
};

const loyaltyByRank: { [key: string]: number } = {
  'Wakashu': 50,
  'Kyodai': 55,
  'Shatei': 60,
  'Chui': 65,
  'Komon': 70,
  'Shingiin': 75,
  'Kaikei': 80,
  'Wakagashira': 90,
  'Oyabun': 95,
};

const calculateAttributes = (
  member: DynamicClanMember,
  isClanMember: boolean,
  clanOwnerId?: string
): DynamicClanMember => {
  const strength = 20 + (member.level * 15);
  const intelligence = 20 + (member.level * 15);
  let loyalty = 50; // Default loyalty for non-members or fallback

  if (isClanMember) {
    if (member.id === clanOwnerId) {
      loyalty = 100;
    } else {
      loyalty = loyaltyByRank[member.rank] || 50;
    }
  }

  return { ...member, strength, intelligence, loyalty };
};

export function useClanMembers(clanId?: string, isOwner?: boolean, ownerId?: string) {
  const [members, setMembers] = useState<DynamicClanMember[]>([]);
  const [recruitableMembers, setRecruitableMembers] = useState<DynamicClanMember[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = useCallback(async () => {
    if (!clanId) {
      setMembers([]);
      return;
    }
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, avatar_url, rank, rank_jp, bio, level, loyalty, strength, intelligence')
      .eq('clan_id', clanId);

    if (error) {
      console.error("Error fetching clan members:", error);
      setMembers([]);
    } else {
      const calculatedMembers = data.map(m => calculateAttributes(m as DynamicClanMember, true, ownerId));
      setMembers(calculatedMembers);
    }
  }, [clanId, ownerId]);

  const fetchRecruitableMembers = useCallback(async () => {
    if (!clanId || !isOwner) {
      setRecruitableMembers([]);
      return;
    }
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, avatar_url, rank, rank_jp, bio, level, loyalty, strength, intelligence')
      .is('clan_id', null);

    if (error) {
      console.error("Error fetching recruitable members:", error);
      setRecruitableMembers([]);
    } else {
      const calculatedMembers = data.map(m => calculateAttributes(m as DynamicClanMember, false));
      setRecruitableMembers(calculatedMembers);
    }
  }, [clanId, isOwner]);

  const recruitMember = async (memberId: string) => {
    if (!clanId) return;
    const { error } = await supabase
      .from('profiles')
      .update({ clan_id: clanId })
      .eq('id', memberId);
    if (error) {
      console.error("Error recruiting member:", error);
    } else {
      await Promise.all([fetchMembers(), fetchRecruitableMembers()]);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchMembers(),
      fetchRecruitableMembers()
    ]).finally(() => setLoading(false));
  }, [fetchMembers, fetchRecruitableMembers]);

  return { members, recruitableMembers, loading, recruitMember };
}
