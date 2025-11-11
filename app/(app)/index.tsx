import { useState, useRef } from "react";
import { View, Text, Pressable, Image, Animated } from "react-native";
import { Link } from "expo-router";
import { useAuth } from "../context/auth-context";
import { useUserProfile } from "../hooks/useUserProfile";
import { CustomButton } from "@/components/ui/custom-button";
import { KanjiLoader } from "@/components/ui/kanji-loader";

export default function HomeScreen() {
  const { logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const { profile, loading, error } = useUserProfile();
  
  // Animação do símbolo
  const scrollY = useRef(new Animated.Value(0)).current;
  const symbolOpacity = scrollY.interpolate({
    inputRange: [-100, -50, 0],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });
  
  const symbolScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.2, 0.8],
    extrapolate: 'clamp',
  });

  const symbolTranslateY = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [0, -50],
    extrapolate: 'clamp',
  });

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <KanjiLoader />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <Text className="text-red-500">Erro ao carregar o perfil.</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View className="flex-1 justify-center items-center bg-black px-6">
        <Text className="text-white text-xl font-bold text-center mb-4">Crie seu Perfil</Text>
        <Text className="text-neutral-400 text-center mb-6">Complete seu perfil para começar sua jornada.</Text>
        <Link href="/profile" asChild>
          <Pressable className="p-3 bg-red-600 rounded-lg">
            <Text className="text-white font-bold">Criar Perfil</Text>
          </Pressable>
        </Link>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      {/* Símbolo fixo no topo - revelado ao fazer pull */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          opacity: symbolOpacity,
          transform: [
            { scale: symbolScale },
            { translateY: symbolTranslateY }
          ],
        }}
        pointerEvents="none"
      >
        <View className="items-center py-10">
          <View className="flex-row items-center gap-3">
            <View className="w-12 h-px bg-neutral-800" />
            <Text className="text-neutral-700 text-2xl">罪</Text>
            <View className="w-12 h-px bg-neutral-800" />
          </View>
        </View>
      </Animated.View>

      <Animated.ScrollView
        className="flex-1"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        bounces={true}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER MELHORADO */}
        <View className="relative h-96">
          {/* Banner de fundo */}
          {profile.banner_url ? (
            <Image
              source={{ uri: profile.banner_url }}
              className="absolute inset-0 w-full h-full"
            />
          ) : (
            <View className="absolute inset-0 bg-gradient-to-b from-red-950 via-red-900 to-black" />
          )}

          {/* Overlay com gradiente suave que vai escurecendo */}
          <View className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black" />

          {/* Padrão decorativo japonês sutil */}
          <View className="absolute inset-0 opacity-5">
            <Text className="text-red-500 text-9xl text-center mt-8">罪</Text>
          </View>

          {/* Conteúdo do Header */}
          <View className="flex-1 z-50 justify-end pb-6 px-6">
            {/* Avatar e Info Principal */}
            <View className="flex-row items-end mb-6">
              {/* Avatar com borda animada */}
              <View className="relative">
                <View className="absolute -inset-1 bg-gradient-to-br from-red-600 via-red-500 to-orange-600 rounded-full blur-sm" />
                <Image
                  source={{
                    uri: profile.avatar_url || `https://placehold.co/200x200/000000/FFF?text=${profile.username?.charAt(0)}`
                  }}
                  className="w-28 h-28 rounded-full border-4 border-black relative"
                />
                {/* Badge de nível */}
                <View className="absolute -bottom-2 -right-2 bg-red-600 rounded-full px-3 py-1 border-2 border-black">
                  <Text className="text-white text-xs font-bold">Lv {profile.level || 1}</Text>
                </View>
              </View>

              {/* Nome e Rank */}
              <View className="flex-1 ml-4 mb-2">
                <Text className="text-white text-2xl font-bold tracking-tight">
                  {profile.username}
                </Text>
                {profile.username_jp && (
                  <Text className="text-red-400 text-lg font-semibold mt-0.5">
                    {profile.username_jp}
                  </Text>
                )}
                <View className="flex-row items-center mt-2 gap-2">
                  <View className="bg-red-950/60 px-3 py-1 rounded-full border border-red-800/40">
                    <Text className="text-red-400 text-xs font-bold">
                      {profile.rank_jp || '若衆'}
                    </Text>
                  </View>
                  <Text className="text-neutral-500 text-xs">•</Text>
                  <Text className="text-neutral-400 text-xs">
                    {profile.rank || 'Wakashu'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Stats Cards */}
            <View className="flex-row gap-3">
              {/* Lealdade */}
              <View className="flex-1 bg-black/80 backdrop-blur-sm rounded-xl p-3 border border-zinc-800/50">
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="text-neutral-400 text-xs">Lealdade</Text>
                  <Text className="text-red-500 text-xs">忠</Text>
                </View>
                <Text className="text-white text-lg font-bold">
                  {profile.level || 0}
                </Text>
                <View className="h-1 bg-zinc-800 rounded-full mt-2 overflow-hidden">
                  <View
                    className="h-full bg-gradient-to-r from-red-600 to-red-500 rounded-full"
                    style={{ width: `${Math.min((profile.level || 0) / 10, 100)}%` }}
                  />
                </View>
              </View>

              {/* Clã */}
              <View className="flex-1 bg-black/80 backdrop-blur-sm rounded-xl p-3 border border-zinc-800/50">
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="text-neutral-400 text-xs">Clã</Text>
                  <Text className="text-red-500 text-xs">組</Text>
                </View>
                <Text className="text-white text-base font-bold" numberOfLines={1}>
                  {profile.clans?.name || 'Sem Clã'}
                </Text>
                <Text className="text-neutral-500 text-xs mt-1">
                  {profile.clans?.name ? 'Membro' : 'Independente'}
                </Text>
              </View>

              {/* Territórios */}
              <View className="flex-1 bg-black/80 backdrop-blur-sm rounded-xl p-3 border border-zinc-800/50">
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="text-neutral-400 text-xs">Território</Text>
                  <Text className="text-red-500 text-xs">地</Text>
                </View>
                <Text className="text-white text-lg font-bold">
                  {profile.level_name_jp || '0'}
                </Text>
                <Text className="text-neutral-500 text-xs mt-1">
                  Principal
                </Text>
              </View>
            </View>
          </View>

          <View className="absolute top-0 inset-0 bg-black/20" />
          <View className="absolute bottom-0 inset-0 bg-black/95" />
          {/* Detalhes vermelhos laterais */}
          <View className="absolute left-0 top-40 w-1 h-32 bg-red-600" />
          <View className="absolute right-0 top-40 w-1 h-32 bg-red-600" />
        </View>

        {/* CONTEÚDO PRINCIPAL */}
        <View className="px-6 -mt-8 relative z-10">
          {/* Boas-vindas */}
          <View className="mb-8 pt-8">
            <Text className="text-white text-3xl font-bold mb-2">
              Bem-vindo, {profile.username || 'Wakashu'}
            </Text>
            <Text className="text-neutral-400 text-base leading-6">
              Este é o seu caminho para ascender na hierarquia. Entre em um clã,
              complete missoes e construa seu império nas sombras do submundo.
            </Text>
          </View>

          {/* Seção: Hierarquia */}
          <View className="mb-8">
            <View className="flex-row items-center mb-4">
              <Text className="text-red-500 text-lg font-bold">階級</Text>
              <View className="flex-1 h-px bg-neutral-800 ml-3" />
            </View>

            <Text className="text-neutral-300 text-base leading-7 mb-4">
              O submundo segue uma estrutura rígida de respeito e lealdade.
              Seu rank atual é <Text className="text-red-500 font-bold">{profile.rank_jp || '若衆'} ({profile.rank || 'Wakashu'})</Text>,
              o primeiro passo na jornada. Acumule <Text className="text-white font-semibold">pontos de lealdade</Text> para
              subir para Kyodai e eventualmente tornar-se um Oyabun.
            </Text>
          </View>

          {/* Seção: Operações */}
          <View className="mb-8">
            <View className="flex-row items-center mb-4">
              <Text className="text-red-500 text-lg font-bold">作戦</Text>
              <View className="flex-1 h-px bg-neutral-800 ml-3" />
            </View>

            <Text className="text-neutral-300 text-base leading-7 mb-4">
              Gerencie seus territórios, coordene seu clã e execute missões estratégicas.
              Cada ação fortalece sua posição no submundo.
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
            <Text className="text-neutral-800 text-xs">
              2025
            </Text>
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}