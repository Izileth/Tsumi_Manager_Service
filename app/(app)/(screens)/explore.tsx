import { View, Text, ScrollView } from "react-native";
import { useState } from "react";
import { useExploreData } from "@/app/hooks/useExploreData";
import { KanjiLoader } from "@/components/ui/kanji-loader";
import { Dashboard } from "@/app/components/explore/Dashboard";
import { TerritoryMapList } from "@/app/components/explore/TerritoryMap";
import { ClansList } from "@/app/components/explore/ClansList";
import { TerritoriesList } from "@/app/components/explore/TerritoriesList";
import { GenericTabs, Tab } from "@/components/ui/GenericTabs";

type ExploreTab = 'dashboard' | 'map' | 'clans' | 'territories';

const exploreTabs: Tab<ExploreTab>[] = [
  { label: 'Dashboard', value: 'dashboard' },
  { label: 'Mapa', value: 'map' },
  { label: 'Clãs', value: 'clans' },
  { label: 'Territórios', value: 'territories' },
];

export default function ExploreScreen() {
  const [selectedTab, setSelectedTab] = useState<ExploreTab>('dashboard');
  const { clans, territories, events, districts, loading } = useExploreData();

  const renderContent = () => {
    switch (selectedTab) {
      case 'dashboard':
        return <Dashboard events={events} clans={clans} territories={territories} />;
      case 'map':
        return <TerritoryMapList districts={districts} territories={territories} />;
      case 'clans':
        return <ClansList clans={clans} />;
      case 'territories':
        return <TerritoriesList territories={territories} />;
      default:
        return null;
    }
  };

  return (
    <ScrollView className="flex-1 bg-black">
      {/* HERO HEADER */}
      <View className="relative h-64 overflow-hidden bg-gradient-to-b from-red-950 via-red-900 to-black">
        <View className="absolute inset-0 opacity-5">
          <Text className="text-white text-8xl text-center mt-16">
            探索
          </Text>
        </View>

  
        <View className="flex-1 justify-end px-6 pb-8">
          <Text className="text-red-500 text-sm font-bold tracking-[0.2em] uppercase mb-2">
            Territórios e Poder
          </Text>
          <Text className="text-white text-4xl font-black mb-2">
            Explore
          </Text>
          <Text className="text-neutral-400 text-base">
            Descubra os segredos do submundo de Tóquio
          </Text>
        </View>

        <View className="absolute right-0 top-20 w-1 h-24 bg-red-600" />
      </View>

      <View className="px-6 pt-8">
        <GenericTabs
          tabs={exploreTabs}
          selectedTab={selectedTab}
          onTabPress={setSelectedTab}
        />

        {loading ? (
          <View className="flex-1 justify-center items-center p-8">
            <KanjiLoader />
          </View>
        ) : (
          <View>
            {renderContent()}
          </View>
        )}

        {/* Footer */}
        <View className="items-center py-12">
          <View className="flex-row items-center gap-3 mb-3">
            <View className="w-12 h-px bg-neutral-800" />
            <Text className="text-neutral-700 text-xl">罪</Text>
            <View className="w-12 h-px bg-neutral-800" />
          </View>
          <Text className="text-neutral-700 text-xs tracking-[0.2em]">
            CONHECIMENTO É PODER
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}