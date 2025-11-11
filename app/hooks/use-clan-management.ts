import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/auth-context';
import { Clan, Profile } from '../lib/types';
import * as ImagePicker from 'expo-image-picker';

export type ClanManagementView = 'main' | 'join' | 'create' | 'manage' | 'edit' | 'edit-emblem';

export const useClanManagement = (profile: Profile | null | undefined, refetchProfile: () => void, onDismiss: () => void) => {
  const { user } = useAuth();
  const [view, setView] = useState<ClanManagementView>('main');
  const [clans, setClans] = useState<Clan[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tag, setTag] = useState('');
  const [emblem, setEmblem] = useState<string[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);

  const [headerTitle, setHeaderTitle] = useState('Gerenciar Clã');
  const [headerJpTitle, setHeaderJpTitle] = useState('氏族管理');

  const resetForm = useCallback(() => {
    const clan = profile?.clans;
    setName(clan?.name || '');
    setDescription(clan?.description || '');
    setTag(clan?.tag || '');
    setEmblem(clan?.emblem ? clan.emblem.split('') : []);
    setAvatarUrl(clan?.avatar_url || null);
    setBannerUrl(clan?.banner_url || null);
  }, [profile]);

  const fetchClans = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('clans')
      .select('*, profiles(username)')
      .order('name');
    if (error) Alert.alert('Erro', 'Não foi possível carregar a lista de clãs.');
    else if (data) setClans(data as any);
    setLoading(false);
  };

  const initialize = useCallback(() => {
    if (!profile) return;
    fetchClans();
    resetForm(); // Populate form with existing data if available
    if (profile.clan_id) {
      setView('manage');
      setHeaderTitle('Gerenciar Clã');
      setHeaderJpTitle('氏族管理');
    } else {
      setView('main');
      setHeaderTitle('Junte-se a um Clã');
      setHeaderJpTitle('氏族に参加');
    }
  }, [profile, resetForm]);

  const uploadImage = async (uri: string, clanId: string, type: 'avatar' | 'banner'): Promise<string | null> => {
    try {
      const fileExt = uri.split('.').pop();
      const fileName = `${type}-${Date.now()}.${fileExt}`;
      const filePath = `${clanId}/${fileName}`;
      const fileType = `image/${fileExt}`;

      const response = await fetch(uri);
      const blob = await response.blob();

      const { data, error } = await supabase.storage.from('clan-assets').upload(filePath, blob, {
        contentType: fileType,
        upsert: true,
      });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage.from('clan-assets').getPublicUrl(data.path);
      return publicUrl;
    } catch (e: any) {
      Alert.alert('Erro ao fazer upload da imagem', e.message);
      return null;
    }
  };

  const handlePickImage = async (type: 'avatar' | 'banner') => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'É necessário permitir o acesso à galeria.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'livePhotos',
      allowsEditing: true,
      aspect: type === 'avatar' ? [1, 1] : [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      if (type === 'avatar') setAvatarUrl(result.assets[0].uri);
      else setBannerUrl(result.assets[0].uri);
    }
  };

  const handleJoinClan = async (clanId: string) => {
    if (!user) return;
    setLoading(true);
    const { error } = await supabase.from('profiles').update({ clan_id: clanId }).eq('id', user.id);
    if (error) Alert.alert('Erro', 'Não foi possível entrar no clã.');
    else {
      Alert.alert('Sucesso', 'Você entrou no clã!');
      refetchProfile();
      onDismiss();
    }
    setLoading(false);
  };

  const handleCreateClan = async () => {
    if (!user || !name.trim()) {
      Alert.alert('Erro', 'O nome do clã é obrigatório.');
      return;
    }
    setLoading(true);
    try {
      const tagValue = tag.trim().toUpperCase();
      const emblemValue = emblem.join('');

      const { data: newClan, error: createError } = await supabase
        .from('clans')
        .insert({ 
          name: name.trim(), 
          description: description.trim(), 
          owner_id: user.id, 
          tag: tagValue || null, 
          emblem: emblemValue || null 
        })
        .select()
        .single();

      if (createError) throw createError;

      const finalAvatarUrl = avatarUrl ? await uploadImage(avatarUrl, newClan.id, 'avatar') : null;
      const finalBannerUrl = bannerUrl ? await uploadImage(bannerUrl, newClan.id, 'banner') : null;

      const { error: updateError } = await supabase
        .from('clans')
        .update({ avatar_url: finalAvatarUrl, banner_url: finalBannerUrl })
        .eq('id', newClan.id);
      
      if (updateError) throw updateError;

      const { error: joinError } = await supabase.from('profiles').update({ clan_id: newClan.id }).eq('id', user.id);
      if (joinError) throw joinError;

      Alert.alert('Sucesso', 'Clã criado e você entrou nele!');
      refetchProfile();
      onDismiss();
    } catch (e: any) {
      if (e.code === '23505') { // Unique constraint violation
        Alert.alert('Erro', 'Este nome de clã já está em uso. Por favor, escolha outro.');
      } else {
        Alert.alert('Erro ao criar clã', e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveClan = async () => {
    if (!user) return;
    Alert.alert(
      "Sair do Clã",
      "Tem certeza que deseja sair do seu clã atual?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            const { error } = await supabase.from('profiles').update({ clan_id: null }).eq('id', user.id);
            if (error) {
              Alert.alert('Erro', 'Não foi possível sair do clã.');
            } else {
              Alert.alert('Sucesso', 'Você saiu do clã.');
              refetchProfile();
              onDismiss();
            }
            setLoading(false);
          },
        },
      ]
    );
  };

  const handleUpdateClan = async () => {
    if (!user || !profile?.clans) return;
    if (!name.trim()) {
      Alert.alert('Erro', 'O nome do clã é obrigatório.');
      return;
    }
    setLoading(true);
    try {
      const finalAvatarUrl = avatarUrl ? await uploadImage(avatarUrl, profile.clans.id, 'avatar') : null;
      const finalBannerUrl = bannerUrl ? await uploadImage(bannerUrl, profile.clans.id, 'banner') : null;
      const tagValue = tag.trim().toUpperCase();
      const emblemValue = emblem.join('');

      const updates = {
        name: name.trim(),
        description: description.trim(),
        tag: tagValue || null,
        emblem: emblemValue || null,
        avatar_url: finalAvatarUrl,
        banner_url: finalBannerUrl,
      };

      const { error } = await supabase.from('clans').update(updates).eq('id', profile.clans.id);
      if (error) throw error;

      Alert.alert('Sucesso', 'Clã atualizado!');
      refetchProfile();
      setView('manage');
    } catch (e: any) {
      if (e.code === '23505') { // Unique constraint violation
        Alert.alert('Erro', 'Este nome de clã já está em uso. Por favor, escolha outro.');
      } else {
        Alert.alert('Erro ao atualizar clã', e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClan = async () => {
    if (!user || !profile?.clans) return;
    Alert.alert(
      "Excluir Clã",
      "Isso é permanente e irá remover todos os membros do clã. Tem certeza?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            const { error } = await supabase.from('clans').delete().eq('id', profile.clans!.id);
            if (error) {
              Alert.alert('Erro', 'Não foi possível excluir o clã.');
            } else {
              Alert.alert('Sucesso', 'Clã excluído.');
              refetchProfile();
              onDismiss();
            }
            setLoading(false);
          },
        },
      ]
    );
  };

  const handleSetView = (newView: ClanManagementView, title: string, jpTitle: string) => {
    setView(newView);
    setHeaderTitle(title);
    setHeaderJpTitle(jpTitle);
  };

  return {
    view, clans, loading, name, setName, description, setDescription, tag, setTag, emblem, setEmblem, avatarUrl, bannerUrl,
    headerTitle, headerJpTitle, isOwner: profile?.clans?.owner_id === user?.id,
    initialize, handlePickImage, handleJoinClan, handleCreateClan, handleLeaveClan, handleUpdateClan, handleDeleteClan, handleSetView,
  };
};