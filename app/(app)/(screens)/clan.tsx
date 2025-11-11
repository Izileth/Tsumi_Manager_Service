import { View, Text, ScrollView, Pressable, Image } from "react-native";
import { useState, useEffect, useCallback, useRef } from "react";
import { useUserProfile } from "@/app/hooks/useUserProfile";
import { useClanManagement } from "@/app/hooks/use-clan-management";
import { useClanAssets } from "@/app/hooks/useClanAssets";
import { supabase } from "@/app/lib/supabase";
import { Territory, Mission } from "@/app/lib/types";

import { CustomTabs } from "@/components/ui/custom-tabs";
import { AddTerritorySheet } from "@/app/components/clan/AddTerritorySheet";
import { AddMissionSheet } from "@/app/components/clan/AddMissionSheet";
import { EditTerritorySheet } from "@/app/components/clan/EditTerritorySheet";
import { KanjiLoader } from "@/components/ui/kanji-loader";
import { EditMissionSheet } from "@/app/components/clan/EditMissionSheet";

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

type TabOption = "members" | "territories" | "missions" | "recruit";

export default function ClanScreen() {
  const [selectedTab, setSelectedTab] = useState<TabOption>("members");
  const { profile, refetch: refetchProfile } = useUserProfile();
  const [dynamicClanMembers, setDynamicClanMembers] = useState<DynamicClanMember[]>([]);
  const [recruitableMembers, setRecruitableMembers] = useState<DynamicClanMember[]>([]);
  const { territories, missions, loading: assetsLoading, createTerritory, createMission, updateTerritory, deleteTerritory, updateMission, deleteMission } = useClanAssets(profile?.clans?.id);
  
  const addTerritorySheetRef = useRef<any>(null);
  const addMissionSheetRef = useRef<any>(null);
  const editTerritorySheetRef = useRef<any>(null);
  const editMissionSheetRef = useRef<any>(null);

  const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(null);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);


  // Placeholder onDismiss for useClanManagement
  const onDismiss = useCallback(() => {
    // In a real scenario, this might navigate back or close a modal
    console.log("Clan management dismissed.");
  }, []);


  const { view, clans, loading } = useClanManagement(profile, refetchProfile, onDismiss);

  useEffect(() => {
    const fetchClanMembers = async () => {
      if (!profile?.clans?.id) {
        setDynamicClanMembers([]);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, rank, rank_jp, bio, loyalty, strength, intelligence') // Select relevant profile fields
        .eq('clan_id', profile.clans.id);

      if (error) {
        console.error("Error fetching clan members:", error);
        setDynamicClanMembers([]);
      } else {
        setDynamicClanMembers(data as DynamicClanMember[]);
      }
    };

    fetchClanMembers();
  }, [profile?.clans?.id]);

  useEffect(() => {
    const fetchRecruitableMembers = async () => {
      if (!profile?.clans?.id || profile?.id !== profile?.clans?.owner_id) {
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

    fetchRecruitableMembers();
  }, [profile?.clans?.id, profile?.id, profile?.clans?.owner_id]);


  useEffect(() => {
    const fetchClanMembers = async () => {
      if (!profile?.clans?.id) {
        setDynamicClanMembers([]);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, rank, rank_jp, bio, loyalty, strength, intelligence') // Select relevant profile fields
        .eq('clan_id', profile.clans.id);

      if (error) {
        console.error("Error fetching clan members:", error);
        setDynamicClanMembers([]);
      } else {
        setDynamicClanMembers(data as DynamicClanMember[]);
      }
    };

    fetchClanMembers();
  }, [profile?.clans?.id]);

  const handleAddTerritory = async (name: string, description: string) => {
    await createTerritory(name, description);
  };

  const handleAddMission = async (data: { name: string; description: string; territoryId: string; reward: { money: number; reputation: number; }; }) => {
    await createMission(data);
  };

  const handleUpdateTerritory = async (id: string, name: string, description: string) => {
    await updateTerritory(id, name, description);
  };

  const handleDeleteTerritory = async (id: string) => {
    await deleteTerritory(id);
  };

  const handleUpdateMission = async (data: { id: string; name: string; description: string; territoryId: string; reward: { money: number; reputation: number; }; }) => {
    await updateMission(data);
  };

  const handleDeleteMission = async (id: string) => {
    await deleteMission(id);
  };

  const openEditTerritorySheet = (territory: Territory) => {
    setSelectedTerritory(territory);
    editTerritorySheetRef.current?.present();
  };

  const openEditMissionSheet = (mission: Mission) => {
    setSelectedMission(mission);
    editMissionSheetRef.current?.present();
  };

  const clanName = profile?.clans?.name || "Nenhum Clã";
  const clanTag = profile?.clans?.tag || "";
  const clanEmblem = profile?.clans?.emblem || "組"; // Default emblem
  const activeMembersCount = dynamicClanMembers.length;

  return (
    <>
      <ScrollView className="flex-1 bg-black">
        {/* HEADER */}
        <View className="relative h-56 overflow-hidden bg-gradient-to-b from-red-950 via-red-900 to-black">
          <View className="absolute inset-0 opacity-5">
            <Text className="text-white text-9xl text-center mt-16">{clanEmblem}</Text>
          </View>

          <View className="flex-1 justify-center items-center px-6 pt-14">
            <Text className="text-4xl font-black text-white tracking-wider text-center mb-2">
              {clanName}
            </Text>
            <Text className="text-xl font-bold text-red-500 tracking-widest mb-3">
              {clanTag}
            </Text>
            <View className="h-px w-28 bg-red-600 mb-2" />
            <Text className="text-neutral-400 text-xs tracking-[0.3em] uppercase">
              Clan Management
            </Text>
          </View>

          <View className="absolute left-0 top-32 w-1 h-20 bg-red-600" />
          <View className="absolute right-0 top-32 w-1 h-20 bg-red-600" />
        </View>

        {/* CONTEÚDO */}
        <View className="px-6 pt-6">

          {/* Status do Clã */}
          <View className="bg-black border border-zinc-900 rounded-lg p-5 mb-6">
            <Text className="text-neutral-500 text-xs uppercase tracking-wider mb-3">
              Status da Família
            </Text>
            <View className="flex-row justify-between mb-4">
              <View>
                <Text className="text-white text-2xl font-bold mb-1">{clanName}</Text>
                <Text className="text-red-500 text-sm font-semibold">{clanTag}</Text>
              </View>
              <View className="items-end">
                <Text className="text-neutral-500 text-xs mb-1">Membros Ativos</Text>
                <Text className="text-white text-2xl font-bold">{activeMembersCount}</Text>
              </View>
            </View>

            <View className="flex-row gap-4">
              <View className="flex-1">
                <Text className="text-neutral-500 text-xs mb-1">Poder Total</Text>
                <View className="bg-neutral-900 h-2 rounded-full overflow-hidden">
                  <View className="bg-red-600 h-full" style={{ width: `${(profile?.clans?.power || 0) / 100}%` }} />
                </View>
                <Text className="text-white text-sm font-semibold mt-1">{profile?.clans?.power || 0}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-neutral-500 text-xs mb-1">Reputação</Text>
                <View className="bg-neutral-900 h-2 rounded-full overflow-hidden">
                  <View className="bg-yellow-600 h-full" style={{ width: `${(profile?.clans?.reputation || 0) / 1000}%` }} />
                </View>
                <Text className="text-white text-sm font-semibold mt-1">{profile?.clans?.reputation || 0}</Text>
              </View>
            </View>
          </View>

          {/* Tabs de Navegação */}
            <CustomTabs 
            selectedTab={selectedTab} 
              setSelectedTab={setSelectedTab}
              isOwner={profile?.id === profile?.clans?.owner_id}
            />

          {/* MEMBROS TAB */}
          {selectedTab === "members" && (
            <View className="mb-8">
              <View className="flex-row items-center mb-4">
                <Text className="text-red-500 text-base font-bold">構成員</Text>
                <View className="flex-1 h-px bg-neutral-800 ml-3" />
              </View>

              {dynamicClanMembers.map((member) => (
                <View
                  key={member.id}
                  className="bg-black border border-zinc-900 rounded-lg p-4 mb-3"
                >
                  <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-row items-center gap-3 flex-1">
                      {/* Placeholder for avatar, replace with Image component if avatar_url is available */}
                      {member.avatar_url ? (
                        <View className="w-14 h-14 rounded-full overflow-hidden">
                          <Image source={{ uri: member.avatar_url }} className="w-14 h-14 rounded-full" />
                        </View>
                      ) : (
                        <View className="w-14 h-14 bg-zinc-950 rounded-full flex items-center justify-center">
                          <Text className="text-zinc-600 text-2xl  font-bold">{member.username.charAt(0).toUpperCase()}</Text>
                        </View>
                      )}
                      <View className="flex-1 ">
                        <Text className="text-white text-base font-bold mb-1">
                          {member.username}
                        </Text>
                        <View className="flex-row items-center gap-2">
                          <Text className="text-red-500 text-xs font-semibold">
                            {member.rank_jp}
                          </Text>
                          <Text className="text-neutral-600 text-xs">•</Text>
                          <Text className="text-neutral-400 text-xs">
                            {member.rank}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View className={`px-3 py-1 rounded-full bg-green-950/30`}>
                      <Text className={`text-xs font-semibold text-green-500`}>
                        ATIVO
                      </Text>
                    </View>
                  </View>

                  <Text className="text-neutral-500 text-xs mb-3">
                    Especialidade: <Text className="text-neutral-400">{member.bio || "N/A"}</Text>
                  </Text>

                  {/* Static progress bars for now */}
                  <View className="gap-2">
                    <View>
                      <View className="flex-row justify-between mb-1">
                        <Text className="text-neutral-500 text-xs">Lealdade</Text>
                        <Text className="text-white text-xs font-semibold">{member.loyalty}%</Text>
                      </View>
                      <View className="bg-neutral-900 h-1.5 rounded-full overflow-hidden">
                        <View className="bg-red-600 h-full" style={{ width: `${member.loyalty}%` }} />
                      </View>
                    </View>

                    <View className="flex-row gap-2">
                      <View className="flex-1">
                        <View className="flex-row justify-between mb-1">
                          <Text className="text-neutral-500 text-xs">Força</Text>
                          <Text className="text-white text-xs">{member.strength}</Text>
                        </View>
                        <View className="bg-neutral-900 h-1.5 rounded-full overflow-hidden">
                          <View className="bg-orange-600 h-full" style={{ width: `${member.strength}%` }} />
                        </View>
                      </View>

                      <View className="flex-1">
                        <View className="flex-row justify-between mb-1">
                          <Text className="text-neutral-500 text-xs">Intel.</Text>
                          <Text className="text-white text-xs">{member.intelligence}</Text>
                        </View>
                        <View className="bg-neutral-900 h-1.5 rounded-full overflow-hidden">
                          <View className="bg-blue-600 h-full" style={{ width: `${member.intelligence}%` }} />
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* RECRUIT TAB */}
          {selectedTab === "recruit" && (
            <View className="mb-8">
              <View className="flex-row items-center mb-4">
                <Text className="text-red-500 text-base font-bold">勧誘</Text>
                <View className="flex-1 h-px bg-neutral-800 ml-3" />
              </View>

              {recruitableMembers.map((member) => (
                <View
                  key={member.id}
                  className="bg-black border border-zinc-900 rounded-lg p-4 mb-3"
                >
                  <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-row items-center gap-3 flex-1">
                      {/* Placeholder for avatar, replace with Image component if avatar_url is available */}
                      {member.avatar_url ? (
                        <View className="w-14 h-14 rounded-full overflow-hidden">
                          <Image source={{ uri: member.avatar_url }} className="w-14 h-14 rounded-full" />
                        </View>
                      ) : (
                        <View className="w-14 h-14 bg-zinc-950 rounded-full flex items-center justify-center">
                          <Text className="text-zinc-600 text-2xl  font-bold">{member.username.charAt(0).toUpperCase()}</Text>
                        </View>
                      )}
                      <View className="flex-1 ">
                        <Text className="text-white text-base font-bold mb-1">
                          {member.username}
                        </Text>
                        <View className="flex-row items-center gap-2">
                          <Text className="text-red-500 text-xs font-semibold">
                            {member.rank_jp}
                          </Text>
                          <Text className="text-neutral-600 text-xs">•</Text>
                          <Text className="text-neutral-400 text-xs">
                            {member.rank}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <Pressable
                      onPress={async () => {
                        if (!profile?.clans?.id) return;
                        const { error } = await supabase
                          .from('profiles')
                          .update({ clan_id: profile.clans.id })
                          .eq('id', member.id);
                        if (error) {
                          console.error("Error recruiting member:", error);
                        } else {
                          refetchProfile();
                        }
                      }}
                      className="active:opacity-70"
                    >
                      <View className="bg-red-600 px-4 mt-3 py-2 rounded-lg">
                        <Text className="text-white text-xs font-bold">RECRUTAR</Text>
                      </View>
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          )}


          {/* TERRITÓRIOS TAB */}
          {selectedTab === "territories" && (
            <View className="mb-8">
              <View className="flex-row items-center mb-4">
                <Text className="text-red-500 text-base font-bold">縄張り</Text>
                <View className="flex-1 h-px bg-neutral-800 ml-3" />
              </View>

              {assetsLoading ? <View className="items-center p-8"><KanjiLoader /></View> : territories.map((territory) => (
                <View
                  key={territory.id}
                  className="bg-black border border-zinc-900 rounded-lg p-4 mb-3"
                >
                  <View className="flex-row justify-between items-start mb-3">
                    <View>
                      <Text className="text-white text-lg font-bold mb-1">
                        {territory.name}
                      </Text>
                      <Text className="text-neutral-400 text-xs">
                        {territory.description || "Sem descrição."}
                      </Text>
                    </View>
                    {profile?.id === profile?.clans?.owner_id && (
                      <Pressable className="active:opacity-70" onPress={() => openEditTerritorySheet(territory)}>
                        <View className="bg-red-600 px-4 py-2 rounded-lg">
                          <Text className="text-white text-xs font-bold">GERENCIAR</Text>
                        </View>
                      </Pressable>
                    )}
                  </View>
                </View>
              ))}

              {profile?.id === profile?.clans?.owner_id && (
                <Pressable className="active:opacity-70 mt-2" onPress={() => addTerritorySheetRef.current?.present()}>
                  <View className="bg-red-950/20 border border-red-900/50 rounded-lg py-3 items-center">
                    <Text className="text-red-500 font-bold text-sm">+ EXPANDIR PARA NOVO TERRITÓRIO</Text>
                  </View>
                </Pressable>
              )}
            </View>
          )}

          {/* MISSÕES TAB */}
          {selectedTab === "missions" && (
            <View className="mb-8">
              <View className="flex-row items-center mb-4">
                <Text className="text-red-500 text-base font-bold">任務</Text>
                <View className="flex-1 h-px bg-neutral-800 ml-3" />
              </View>

              <View className="bg-red-950/20 border-l-4 border-red-600 p-4 rounded-r-lg mb-5">
                <Text className="text-neutral-400 text-xs leading-5">
                  Missões fortalecem o controle territorial e geram recursos. Escolha seus
                  membros sabiamente baseado na dificuldade da operação.
                </Text>
              </View>

              {assetsLoading ? <View className="items-center p-8"><KanjiLoader /></View> : missions.map((mission) => {
                return (
                  <View
                    key={mission.id}
                    className={`mb-4 rounded-lg border p-4 bg-zinc-950 border-neutral-800`}
                  >
                    <View className="flex-row justify-between items-start mb-3">
                      <View className="flex-1">
                        <Text className="text-white text-base font-bold mb-1">
                          {mission.name}
                        </Text>
                        <Text className="text-neutral-400 text-xs">
                          {mission.description || "Sem descrição."}
                        </Text>
                      </View>
                      <View className="bg-green-950/30 px-3 py-1 rounded-full">
                        <Text className="text-green-500 text-xs font-bold">
                          {JSON.stringify(mission.reward)}
                        </Text>
                      </View>
                    </View>

                    {profile?.id === profile?.clans?.owner_id && (
                      <Pressable className="active:opacity-70" onPress={() => openEditMissionSheet(mission)}>
                        <View className="bg-red-600 rounded-lg py-3 items-center">
                          <Text className="text-white font-bold text-sm">
                            GERENCIAR MISSÃO
                          </Text>
                        </View>
                      </Pressable>
                    )}
                  </View>
                );
              })}
               {profile?.id === profile?.clans?.owner_id && (
                <Pressable className="active:opacity-70 mt-2" onPress={() => addMissionSheetRef.current?.present()}>
                  <View className="bg-red-950/20 border border-red-900/50 rounded-lg py-3 items-center">
                    <Text className="text-red-500 font-bold text-sm">+ CRIAR NOVA MISSÃO</Text>
                  </View>
                </Pressable>
              )}
            </View>
          )}

          {/* Footer */}
          <View className="items-center py-8 mb-6">
            <View className="flex-row items-center gap-3 mb-3">
              <View className="w-12 h-px bg-neutral-800" />
              <Text className="text-neutral-700 text-xl">組</Text>
              <View className="w-12 h-px bg-neutral-800" />
            </View>
            <Text className="text-neutral-700 text-xs tracking-[0.25em]">
              FAMILY FIRST
            </Text>
          </View>
        </View>
      </ScrollView>
      <AddTerritorySheet ref={addTerritorySheetRef} onSubmit={handleAddTerritory} />
      <AddMissionSheet ref={addMissionSheetRef} onSubmit={handleAddMission} territories={territories} />
      <EditTerritorySheet ref={editTerritorySheetRef} territory={selectedTerritory} onUpdate={handleUpdateTerritory} onDelete={handleDeleteTerritory} />
      <EditMissionSheet ref={editMissionSheetRef} mission={selectedMission} territories={territories} onUpdate={handleUpdateMission} onDelete={handleDeleteMission} />
    </>
  );
}