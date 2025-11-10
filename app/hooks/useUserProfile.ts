import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/auth-context';

type Profile = {
  id: string;
  username: string;
  username_jp: string;
  level: number;
  bio: string;
  slug: string;
  website: string;
  github: string;
  twitter: string;
  avatar_url: string;
  banner_url: string;
  rank: string;
  rank_jp: string;
  joined_date: string;
  updated_at: string;
  clans: {
    name: string;
  } | null;
};

export const useUserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('profiles')
                .select(`
          *,
          clans (
            *,
            profiles (
              username
            )
          )
        `)
        .eq('id', user.id);

      if (fetchError) {
        throw fetchError;
      }

      if (data && data.length > 0) {
        setProfile(data[0] as Profile);
      } else {
        setProfile(null);
      }

    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, loading, error, refetch: fetchProfile };
};
