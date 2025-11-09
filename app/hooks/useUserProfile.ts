import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/auth-context';

export const useUserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
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
      // Remove .single() to handle cases where no profile exists without throwing an error.
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id);

      if (fetchError) {
        throw fetchError;
      }

      // data is now an array. It might be empty or contain one profile.
      if (data && data.length > 0) {
        setProfile(data[0]);
      } else {
        // No profile found for this user.
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
