import { View, Text, ScrollView, Pressable } from "react-native";
import { Link } from "expo-router";
import { useAuth } from "../context/auth-context";

export default function HomeScreen() {
    const { logout } = useAuth();
  return (
    <ScrollView className="flex-1 bg-black">
      {/* HERO SECTION com gradiente vermelho dramático */}
      <View className="relative h-80 overflow-hidden bg-gradient-to-b from-red-950 via-red-900 to-black">
        {/* Padrão decorativo japonês */}
        <View className="absolute inset-0 opacity-5">
          <Text className="text-white text-9xl text-center mt-20">
            龍虎
          </Text>
        </View>

        {/* Conteúdo do Hero */}
        <View className="flex-1 justify-center items-center px-6 pt-14">
          <View className="items-center">

            {/* Título Principal */}
            <Text className="text-5xl font-black text-white tracking-wider text-center mb-2">
              罪
            </Text>
            <Text className="text-2xl font-bold text-red-500 tracking-widest">
              TSUMI
            </Text>
            
            <View className="h-px w-32 bg-red-600 my-4" />
            
            <Text className="text-neutral-400 text-xs tracking-[0.3em] uppercase">
              Yakuza Brotherhood
            </Text>
          </View>
        </View>

        {/* Detalhes vermelhos laterais */}
        <View className="absolute left-0 top-40 w-1 h-32 bg-red-600" />
        <View className="absolute right-0 top-40 w-1 h-32 bg-red-600" />
      </View>

      {/* CONTEÚDO PRINCIPAL */}
      <View className="px-6 pt-8">
        
        {/* Boas-vindas */}
        <View className="mb-8">
          <Text className="text-white text-3xl font-bold mb-2">
            Bem-vindo, Wakashu
          </Text>
          <Text className="text-neutral-400 text-base leading-6">
            Este é o seu caminho para ascender na hierarquia. Domine os territórios, 
            complete missões e construa seu império nas sombras de Tóquio.
          </Text>
        </View>

        {/* Seção: Hierarquia */}
        <View className="mb-8">
          <View className="flex-row items-center mb-4">
            <Text className="text-red-500 text-lg font-bold">階級</Text>
            <View className="flex-1 h-px bg-neutral-800 ml-3" />
          </View>
          
          <Text className="text-neutral-300 text-base leading-7 mb-4">
            O yakuza segue uma estrutura rígida de respeito e lealdade. 
            Seu rank atual é <Text className="text-red-500 font-bold">若衆 (Wakashu)</Text>, 
            o primeiro passo na jornada. Acumule <Text className="text-white font-semibold">pontos de lealdade</Text> para 
            subir para Kyodai e eventualmente tornar-se um Oyabun.
          </Text>
        </View>

        {/* Seção: Código Jin-Gi */}
        <View className="mb-8">
          <View className="flex-row items-center mb-4">
            <Text className="text-red-500 text-lg font-bold">仁義</Text>
            <View className="flex-1 h-px bg-neutral-800 ml-3" />
          </View>
          
          <Text className="text-neutral-300 text-base leading-7 mb-3">
            Jin-Gi representa os princípios fundamentais do yakuza: humanidade e justiça. 
            Estes valores guiam cada decisão e ação dentro da organização.
          </Text>

          <View className="bg-red-950/20 border-l-4 border-red-600 p-4 rounded-r-lg">
            <Text className="text-neutral-400 text-sm italic leading-6">
              &quot Lealdade acima de tudo. O código é absoluto. Traição é paga com sangue. 
              A honra do clã está acima da vida individual. &quot
            </Text>
          </View>
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
              <View className="flex-row items-center justify-between bg-zinc-950 p-4 rounded-lg border border-neutral-800 mb-3">
                <View className="flex-row items-center gap-3">
                  <Text className="text-white font-semibold text-base">Ver Perfil</Text>
                </View>
                <Text className="text-red-500">→</Text>
              </View>
            </Pressable>
          </Link>

          <Link href="/explore" asChild>
            <Pressable className="active:opacity-70">
              <View className="flex-row items-center justify-between bg-zinc-950 p-4 rounded-lg border border-neutral-800 mb-3">
                <View className="flex-row items-center gap-3">
                  <Text className="text-white font-semibold text-base">Explorar Territórios</Text>
                </View>
                <Text className="text-red-500">→</Text>
              </View>
            </Pressable>
          </Link>

          <Link href="/clan" asChild>
            <Pressable className="active:opacity-70">
              <View className="flex-row items-center justify-between bg-zinc-950 p-4 rounded-lg border border-neutral-800 mb-3">
                <View className="flex-row items-center gap-3">
                  <Text className="text-white font-semibold text-base">Gerenciar Clã</Text>
                </View>
                <Text className="text-red-500">→</Text>
              </View>
            </Pressable>
          </Link>

          <Link href="/market" asChild>
            <Pressable className="active:opacity-70">
              <View className="flex-row items-center justify-between bg-zinc-950 p-4 rounded-lg border border-neutral-800 mb-3">
                <View className="flex-row items-center gap-3">
                  <Text className="text-white font-semibold text-base">Mercado Negro</Text>
                </View>
                <Text className="text-red-500">→</Text>
              </View>
            </Pressable>
          </Link>

          <Link href="/missions" asChild>
            <Pressable className="active:opacity-70">
              <View className="flex-row items-center justify-between bg-zinc-950 p-4 rounded-lg border border-neutral-800 mb-3">
                <View className="flex-row items-center gap-3">
                  <Text className="text-white font-semibold text-base">Missões</Text>
                </View>
                <Text className="text-red-500">→</Text>
              </View>
            </Pressable>
          </Link>

          <Link href="/dojo" asChild>
            <Pressable className="active:opacity-70">
              <View className="flex-row items-center justify-between bg-zinc-950 p-4 rounded-lg border border-neutral-800">
                <View className="flex-row items-center gap-3">
                  <Text className="text-white font-semibold text-base">Dojo</Text>
                </View>
                <Text className="text-red-500">→</Text>
              </View>
            </Pressable>
          </Link>
        </View>

        {/* Seção: Tatuagens e Tradição */}
        <View className="mb-8">
          <View className="flex-row items-center mb-4">
            <Text className="text-red-500 text-lg font-bold">刺青</Text>
            <View className="flex-1 h-px bg-neutral-800 ml-3" />
          </View>
          
          <Text className="text-neutral-300 text-base leading-7">
            As irezumi (tatuagens tradicionais) são símbolos de comprometimento e coragem. 
            Cobrem o corpo inteiro, exceto mãos, pés e rosto, permitindo que membros 
            mantenham aparência respeitável em público. Cada desenho conta uma história 
            de lealdade e sacrifício.
          </Text>
        </View>
        
        <Pressable onPress={logout} className="active:opacity-70 mt-4 mb-4 w-full">
            <View className="bg-red-900/50 border border-red-800 rounded-lg py-3 items-center">
              <Text className="text-red-400 font-bold text-sm">Sair da Conta</Text>
            </View>
          </Pressable>

        {/* Footer com símbolo */}
        <View className="items-center py-10 mb-6">
          <View className="flex-row items-center gap-3 mb-3">
            <View className="w-12 h-px bg-neutral-800" />
            <Text className="text-neutral-700 text-2xl">罪</Text>
            <View className="w-12 h-px bg-neutral-800" />
          </View>
          <Text className="text-neutral-700 text-xs tracking-[0.25em] mb-1">
            TOKYO UNDERGROUND
          </Text>
          <Text className="text-neutral-800 text-xs">
            1945
          </Text>
        </View>

      </View>
    </ScrollView>
  );
}