import { View, Text, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { Profile } from '@/app/lib/types';
import { CustomButton } from '@/components/ui/custom-button';

type HomeContentProps = {
  profile: Profile;
  handleLogout: () => void;
  loggingOut: boolean;
};

export function HomeContent({ profile, handleLogout, loggingOut }: HomeContentProps) {
  return (
    <View className="px-6 -mt-8 relative z-10">
      {/* Boas-vindas */}
      <View className="mb-8 pt-8">
        <Text className="text-white text-3xl font-bold mb-2">
          Bem-vindo, {profile.username || 'Wakashu'}
        </Text>
        <Text className="text-neutral-400 text-base leading-6">
          Este é o seu caminho para ascender na hierarquia. Entre em um clã, complete missoes e
          construa seu império nas sombras do submundo.
        </Text>
      </View>

      {/* Seção: Hierarquia */}
      <View className="mb-8">
        <View className="flex-row items-center mb-4">
          <Text className="text-red-500 text-lg font-bold">階級</Text>
          <View className="flex-1 h-px bg-neutral-800 ml-3" />
        </View>

        <Text className="text-neutral-300 text-base leading-7 mb-4">
          O submundo segue uma estrutura rígida de respeito e lealdade. Seu rank atual é{' '}
          <Text className="text-red-500 font-bold">
            {profile.rank_jp || '若衆'} ({profile.rank || 'Wakashu'})
          </Text>
          , baseado em sua posição no submundo. Acumule{' '}
          <Text className="text-white font-semibold">pontos de lealdade</Text> para subir para
          Kyodai e eventualmente tornar-se um Oyabun.
        </Text>
      </View>

      {/* Seção: Operações */}
      <View className="mb-8">
        <View className="flex-row items-center mb-4">
          <Text className="text-red-500 text-lg font-bold">作戦</Text>
          <View className="flex-1 h-px bg-neutral-800 ml-3" />
        </View>

        <Text className="text-neutral-300 text-base leading-7 mb-4">
          Gerencie seus territórios, coordene seu clã e execute missões estratégicas. Cada ação
          fortalece sua posição no submundo.
        </Text>

        <Link href="/profile" asChild>
          <Pressable className="active:opacity-70">
            <View className="flex-row items-center justify-between bg-black p-4 rounded-lg border border-neutral-800 mb-3">
              <View className="flex-row items-center gap-3">
                <Text className="text-white font-semibold text-base">Ver Perfil</Text>
              </View>
              <Text className="text-red-500">→</Text>
            </View>
          </Pressable>
        </Link>

        <Link href="/explore" asChild>
          <Pressable className="active:opacity-70">
            <View className="flex-row items-center justify-between bg-black p-4 rounded-lg border border-neutral-800 mb-3">
              <View className="flex-row items-center gap-3">
                <Text className="text-white font-semibold text-base">Explorar Territórios</Text>
              </View>
              <Text className="text-red-500">→</Text>
            </View>
          </Pressable>
        </Link>

        
        <Link href="/feed" asChild>
          <Pressable className="active:opacity-70">
            <View className="flex-row items-center justify-between bg-black p-4 rounded-lg border border-neutral-800 mb-3">
              <View className="flex-row items-center gap-3">
                <Text className="text-white font-semibold text-base">Explorar Feed</Text>
              </View>
              <Text className="text-red-500">→</Text>
            </View>
          </Pressable>
        </Link>

        <Link href="/clan" asChild>
          <Pressable className="active:opacity-70">
            <View className="flex-row items-center justify-between bg-black p-4 rounded-lg border border-neutral-800 mb-3">
              <View className="flex-row items-center gap-3">
                <Text className="text-white font-semibold text-base">Gerenciar Clã</Text>
              </View>
              <Text className="text-red-500">→</Text>
            </View>
          </Pressable>
        </Link>
      </View>

      <CustomButton
        title="Sair da Conta"
        onPress={handleLogout}
        isLoading={loggingOut}
        className="bg-red-600 rounded-sm p-3 active:bg-red-700 shadow-lg shadow-red-600/40 w-full"
        textClassName="text-sm font-bold text-white tracking-wide"
      />

      {/* Footer com símbolo */}
      <View className="items-center py-10 mb-6">
        <View className="flex-row items-center gap-3 mb-3">
          <View className="w-12 h-px bg-neutral-800" />
          <Text className="text-neutral-700 text-2xl">罪</Text>
          <View className="w-12 h-px bg-neutral-800" />
        </View>
        <Text className="text-neutral-700 text-xs tracking-[0.25em] mb-1">
          WELCOME TO THE UNDERWORLD
        </Text>
        <Text className="text-neutral-800 text-xs">2025</Text>
      </View>
    </View>
  );
}
