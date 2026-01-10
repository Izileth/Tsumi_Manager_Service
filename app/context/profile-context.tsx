import React, { createContext, useState, useEffect, useCallback, useContext, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './auth-context';
import type { Profile } from '../lib/types';
import * as Notifications from 'expo-notifications';

type ProfileContextType = {
  profile: Profile | null;
  loading: boolean;
  error: any;
  refetchProfile: () => void;
  updateProfile: (updates: Partial<Profile>) => Promise<any>;
  uploadProfileAsset: (file: any, assetType: 'avatar' | 'banner') => Promise<string | null>;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setLoading(false);
      setProfile(null);
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
            *
          )
        `)
        .eq('id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // 'PGRST116' = no rows found
        throw fetchError;
      }
      setProfile(data as Profile);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) throw new Error('User not authenticated');
    
    const oldLevel = profile?.level;

    const { data, error: updateError } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select(`
        *,
        clans (
          *
        )
      `)
      .single();

    if (updateError) throw updateError;
    
    const newLevel = data?.level;

    if (oldLevel && newLevel && newLevel > oldLevel) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Você subiu de nível!",
          body: `Parabéns, você alcançou o nível ${newLevel}!`,
        },
        trigger: null,
      });
    }

    setProfile(data as Profile); // Update global state immediately
    return data;
  };

  const uploadProfileAsset = async (file: any, assetType: 'avatar' | 'banner') => {
    if (!user) throw new Error('User not authenticated');

    const fileExt = file.uri.split('.').pop();
    const fileName = `${assetType}-${Date.now()}.${fileExt}`;
    const filePath = `users/${user.id}/${fileName}`;

    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      name: fileName,
      type: file.type || `image/${fileExt}`,
    } as any);

    const { error: uploadError } = await supabase.storage
      .from('assets')
      .upload(filePath, formData, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('assets')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const value = {
    profile,
    loading,
    error,
    refetchProfile: fetchProfile,
    updateProfile,
    uploadProfileAsset,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
