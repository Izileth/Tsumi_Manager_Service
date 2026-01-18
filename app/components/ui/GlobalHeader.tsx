import { View, Text, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { useProfile } from '@/app/context/profile-context';
import { Feather } from '@expo/vector-icons';
export default function GlobalHeader() {
  const { profile, loading } = useProfile();
  const router = useRouter();

  return (
    <SafeAreaView className="bg-black" edges={['top']}>
      {/* Header Principal */}
      <View className="h-16 flex-row items-center justify-between px-6">
        {/* Logo */}
        <Link href="/(app)" asChild>
          <Pressable className="flex-row items-center gap-2">
            {({ pressed }) => (
              <View className={`${pressed ? 'opacity-80' : ''} flex-row items-center justify-center`}>
                <Image
                  source={require("../../../assets/images/notification_icon.png")}
                  className="w-10 h-10"
                  resizeMode="contain"
                />
                <Text className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                  Tsumi
                </Text>
              </View>
            )}
          </Pressable>
        </Link>

        {/* Navegação Central - Desktop */}
        <View className="hidden md:flex flex-row items-center gap-1">
          <Link href="/(app)/(screens)/explore" asChild>
            <Pressable className="flex-col items-center justify-center px-4 py-2">
              {({ pressed }) => (
                <>
                  <Feather name="compass" size={20} color={pressed ? '#9ca3af' : '#6b7280'} />
                  <Text className={`text-xs mt-1 font-medium ${pressed ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
                    Explorar
                  </Text>
                </>
              )}
            </Pressable>
          </Link>
          <Link href="/(app)/(screens)/feed" asChild>
            <Pressable className="flex-col items-center justify-center px-4 py-2">
              {({ pressed }) => (
                <>
                  <Feather name="home" size={20} color={pressed ? '#9ca3af' : '#6b7280'} />
                  <Text className={`text-xs mt-1 font-medium ${pressed ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
                    Feed
                  </Text>
                </>
              )}
            </Pressable>
          </Link>
          <Link href="/(app)/(screens)/clan" asChild>
            <Pressable className="flex-col items-center justify-center px-4 py-2">
              {({ pressed }) => (
                <>
                  <Feather name="users" size={20} color={pressed ? '#9ca3af' : '#6b7280'} />
                  <Text className={`text-xs mt-1 font-medium ${pressed ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
                    Clã
                  </Text>
                </>
              )}
            </Pressable>
          </Link>
        </View>

        {/* Ações à Direita */}
        <View className="flex-row items-center gap-3">
          <Link href="/(app)/(screens)/explore" asChild>
            <Pressable className="flex-col items-center justify-center px-0 py-2">
              {({ pressed }) => (
                <>
                  <Feather name="compass" size={20} color={pressed ? '#9ca3af' : '#6b7280'} />
                  <Text className={`text-xs mt-1 font-medium ${pressed ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
                    Explorar
                  </Text>
                </>
              )}
            </Pressable>
          </Link>
          <Link href="/(app)/(screens)/feed" asChild>
            <Pressable className="flex-col items-center justify-center px-0 py-2">
              {({ pressed }) => (
                <>
                  <Feather name="home" size={20} color={pressed ? '#9ca3af' : '#6b7280'} />
                  <Text className={`text-xs mt-1 font-medium ${pressed ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
                    Feed
                  </Text>
                </>
              )}
            </Pressable>
          </Link>
          <Link href="/(app)/(screens)/clan" asChild>
            <Pressable className="flex-col items-center justify-center px-4 py-2">
              {({ pressed }) => (
                <>
                  <Feather name="users" size={20} color={pressed ? '#9ca3af' : '#6b7280'} />
                  <Text className={`text-xs mt-1 font-medium ${pressed ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
                    Clã
                  </Text>
                </>
              )}
            </Pressable>
          </Link>

          {/* Avatar do Usuário */}
          <Pressable
            onPress={() => router.push('/(app)/(screens)/profile')}
            className="relative"
          >
            {({ pressed }) => (
              <View className={`${pressed ? 'opacity-80' : ''}`}>
                {loading ? (
                  <View className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700" />
                ) : profile?.avatar_url ? (
                  <Image
                    source={{ uri: profile.avatar_url }}
                    className="w-9 h-9 rounded-full border-2 border-gray-200 dark:border-gray-700"
                  />
                ) : (
                  <View className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 items-center justify-center">
                    <Feather name="user" size={18} color="white" />
                  </View>
                )}
                {/* Indicador Online */}
                <View className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-zinc-50 border-2 border-white dark:border-gray-950" />
              </View>
            )}
          </Pressable>
        </View>
      </View>


    </SafeAreaView>
  );
}