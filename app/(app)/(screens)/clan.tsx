import { View, Text, ScrollView } from "react-native";
import { useState, useRef } from "react";
import { useUserProfile } from "@/app/hooks/useUserProfile";
import { useClanAssets } from "@/app/hooks/useClanAssets";
import { useClanMembers } from "@/app/hooks/useClanMembers";
import { Territory, Mission } from "@/app/lib/types";

import { GenericTabs, Tab } from "@/components/ui/GenericTabs";
import { AddTerritorySheet } from "@/app/components/clan/AddTerritorySheet";
import { AddMissionSheet } from "@/app/components/clan/AddMissionSheet";
import { EditTerritorySheet } from "@/app/components/clan/EditTerritorySheet";
import { EditMissionSheet } from "@/app/components/clan/EditMissionSheet";
import { MembersTab } from "@/app/components/clan/tabs/MembersTab";
import { TerritoriesTab } from "@/app/components/clan/tabs/TerritoriesTab";
import { MissionsTab } from "@/app/components/clan/tabs/MissionsTab";
import { RecruitTab } from "@/app/components/clan/tabs/RecruitTab";

type ClanTab = "members" | "territories" | "missions" | "recruit";

export default function ClanScreen() {
  const [selectedTab, setSelectedTab] = useState<ClanTab>("members");
  const { profile } = useUserProfile();
  
  const isOwner = profile?.id === profile?.clans?.owner_id;

  const { territories, missions, loading: assetsLoading, createTerritory, createMission, updateTerritory, deleteTerritory, updateMission, deleteMission } = useClanAssets(profile?.clans?.id);
  const { members, recruitableMembers, loading: membersLoading, recruitMember } = useClanMembers(profile?.clans?.id, isOwner, profile?.id);

  const addTerritorySheetRef = useRef<any>(null);
  const addMissionSheetRef = useRef<any>(null);
  const editTerritorySheetRef = useRef<any>(null);
  const editMissionSheetRef = useRef<any>(null);

  const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(null);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);

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

  const clanTabs: Tab<ClanTab>[] = [
    { label: 'Membros', value: 'members' },
    { label: 'Territórios', value: 'territories' },
    { label: 'Missões', value: 'missions' },
    ...(isOwner ? [{ label: 'Recrutar', value: 'recruit' as ClanTab }] : []),
  ];

  const renderContent = () => {
    switch (selectedTab) {
      case 'members':
        return <MembersTab members={members} loading={membersLoading} />;
      case 'territories':
        return <TerritoriesTab territories={territories} loading={assetsLoading} isOwner={isOwner} onAdd={() => addTerritorySheetRef.current?.present()} onEdit={openEditTerritorySheet} />;
      case 'missions':
        return <MissionsTab missions={missions} loading={assetsLoading} isOwner={isOwner} onAdd={() => addMissionSheetRef.current?.present()} onEdit={openEditMissionSheet} />;
      case 'recruit':
        return <RecruitTab recruitableMembers={recruitableMembers} loading={membersLoading} onRecruit={recruitMember} />;
      default:
        return null;
    }
  };

  const clanName = profile?.clans?.name || "Nenhum Clã";
  const clanTag = profile?.clans?.tag || "";
  const clanEmblem = profile?.clans?.emblem || "組";
  const activeMembersCount = members.length;

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

          <GenericTabs
            tabs={clanTabs}
            selectedTab={selectedTab}
            onTabPress={setSelectedTab}
          />

          {renderContent()}

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