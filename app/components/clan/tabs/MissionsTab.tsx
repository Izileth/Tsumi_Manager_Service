import { View, Text, Pressable } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { KanjiLoader } from '@/components/ui/kanji-loader';
import { Mission } from '@/app/lib/types';

type MissionsTabProps = {
  missions: Mission[];
  loading: boolean;
  isOwner: boolean;
  onAdd: () => void;
  onEdit: (mission: Mission) => void;
};



// Badge de Nível

const LevelBadge = ({ level }: { level?: string | number }) => {

  if (!level) return null;



  const getLevelConfig = () => {

    const numericLevel = Number(level);

    if (numericLevel >= 10) {

      return { label: `Nível ${numericLevel}`, color: 'text-red-500', bg: 'bg-red-950/30', icon: 'exclamation-circle' };

    }

    if (numericLevel >= 5) {

      return { label: `Nível ${numericLevel}`, color: 'text-orange-500', bg: 'bg-orange-950/30', icon: 'circle' };

    }

    if (numericLevel >= 2) {

      return { label: `Nível ${numericLevel}`, color: 'text-yellow-500', bg: 'bg-yellow-950/30', icon: 'circle' };

    }

    return { label: `Nível ${numericLevel}`, color: 'text-green-500', bg: 'bg-green-950/30', icon: 'circle' };

  };



  const config = getLevelConfig();



  return (

    <View className={`${config.bg} px-2.5 py-1 rounded-full flex-row items-center`}>

      <FontAwesome name={config.icon as any} size={8} color={config.color.replace('text-', '#')} />

      <Text className={`${config.color} text-xs font-bold ml-1`}>

        {config.label}

      </Text>

    </View>

  );

};



export function MissionsTab({ missions, loading, isOwner, onAdd, onEdit }: MissionsTabProps) {

  if (loading) {

    return (

      <View className="items-center p-8">

        <KanjiLoader />

      </View>

    );

  }



  return (

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



      {missions.length === 0 ? (

        <View className="bg-neutral-900/30 border border-neutral-800 rounded-lg p-8 items-center">

          <FontAwesome name="inbox" size={40} color="#525252" />

          <Text className="text-neutral-500 text-sm mt-3 text-center">

            Nenhuma missão disponível no momento

          </Text>

        </View>

      ) : (

        missions.map((mission) => (

          <View

            key={mission.id}

            className="mb-4 rounded-lg border p-4 bg-black border-neutral-800"

          >

            {/* Header da missão */}

            <View className="mb-3">

              <View className="flex-row justify-between items-start mb-2">

                <Text className="text-white text-base font-bold flex-1 mr-2">

                  {mission.name}

                </Text>

                <LevelBadge level={mission.level} />

              </View>



              {mission.description && (

                <Text className="text-neutral-400 text-xs leading-5 mb-3">

                  {mission.description}

                </Text>

              )}

            </View>



            {/* Seção de recompensas */}

            <View className="mb-3 border-t border-neutral-800 pt-3">

              <Text className="text-neutral-500 text-xs font-semibold mb-2">

                RECOMPENSAS

              </Text>

              <Text className="text-neutral-400  text-xs leading-5">
                {`Moedas: ${mission.reward.money} - Reputação: ${mission.reward.reputation}`}
              </Text>

            </View>

            {/* Botão de gerenciamento */}

            {isOwner && (

              <Pressable className="active:opacity-70" onPress={() => onEdit(mission)}>

                <View className="bg-red-600 rounded-lg py-3 items-center flex-row justify-center">

                  <FontAwesome name="cog" size={14} color="white" />

                  <Text className="text-white font-bold text-sm ml-2">

                    GERENCIAR MISSÃO

                  </Text>

                </View>

              </Pressable>

            )}

          </View>

        ))

      )}



      {isOwner && (

        <Pressable className="active:opacity-70 mt-2" onPress={onAdd}>

          <View className="bg-red-950/20 border border-red-900/50 rounded-lg py-3 items-center flex-row justify-center">

            <FontAwesome name="plus" size={14} color="#ef4444" />

            <Text className="text-red-500 font-bold text-sm ml-2">

              CRIAR NOVA MISSÃO

            </Text>

          </View>

        </Pressable>

      )}

    </View>

  );

}
