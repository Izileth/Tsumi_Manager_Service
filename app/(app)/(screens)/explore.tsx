import { View, Text, ScrollView, Pressable } from "react-native";
import { useState } from "react";
import { useExploreData } from "@/app/hooks/useExploreData";
import { KanjiLoader } from "@/components/ui/kanji-loader";
import { Dashboard } from "@/app/components/explore/Dashboard";
import { TerritoryMap } from "@/app/components/explore/TerritoryMap";
import { ClansList } from "@/app/components/explore/ClansList";
import { TerritoriesList } from "@/app/components/explore/TerritoriesList";

export default function ExploreScreen() {
  const [expandedSection, setExpandedSection] = useState<string | null>('dashboard');
  const { clans, territories, events, districts, loading } = useExploreData();

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
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
        {loading ? (
          <View className="flex-1 justify-center items-center p-8">
            <KanjiLoader />
          </View>
        ) : (
          <>
            {/* SEÇÃO: Dashboard */}
            <CollapsibleSection
              title="Dashboard do Submundo"
              isExpanded={expandedSection === "dashboard"}
              onToggle={() => toggleSection("dashboard")}
            >
              <Dashboard events={events} clans={clans} territories={territories} />
            </CollapsibleSection>

            {/* SEÇÃO: Mapa de Territórios */}
            <CollapsibleSection
              title="Mapa de Territórios"
              isExpanded={expandedSection === "map"}
              onToggle={() => toggleSection("map")}
            >
              <TerritoryMap districts={districts} territories={territories} />
            </CollapsibleSection>

            {/* SEÇÃO: Clãs */}
            <CollapsibleSection
              title="Clãs em Atividade"
              isExpanded={expandedSection === "clans"}
              onToggle={() => toggleSection("clans")}
            >
              <ClansList clans={clans} />
            </CollapsibleSection>

            {/* SEÇÃO: Lista de Territórios */}
            <CollapsibleSection
              title="Lista de Territórios"
              isExpanded={expandedSection === "territories"}
              onToggle={() => toggleSection("territories")}
            >
              <TerritoriesList territories={territories} />
            </CollapsibleSection>
          </>
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

// COMPONENTE: Seção Colapsável
function CollapsibleSection({ 
  title, 
  isExpanded, 
  onToggle, 
  children 
}: { 
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <View className="mb-6">
      <Pressable 
        onPress={onToggle}
        className="active:opacity-70"
      >
        <View className="flex-row items-center justify-between bg-black p-4 rounded-lg border border-zinc-950">
          <Text className="text-white font-bold text-base">{title}</Text>
          <Text className="text-red-500 text-xl">
            {isExpanded ? "−" : "+"}
          </Text>
        </View>
      </Pressable>
      
      {isExpanded && (
        <View className="bg-black border-x border-b border-zinc-950 rounded-b-lg p-4 -mt-1">
          {children}
        </View>
      )}
    </View>
  );
}