import { useState, useRef } from 'react';
import { View, Text, Animated, Pressable } from 'react-native';
import { useAuth } from '../context/auth-context';
import { useProfile } from '../context/profile-context';
import { KanjiLoader } from '@/components/ui/kanji-loader';
import { CreateProfilePrompt } from '@/app/components/home/CreateProfilePrompt';
import { PullToRevealSymbol } from '@/app/components/home/PullToRevealSymbol';
import { HomeHeader } from '@/app/components/home/HomeHeader';
import { HomeContent } from '@/app/components/home/HomeContent';
import { useRouter } from 'expo-router';
export default function HomeScreen() {
  const { logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const { profile, loading, error } = useProfile();
  const router = useRouter();


  const scrollY = useRef(new Animated.Value(0)).current;

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
    return <CreateProfilePrompt />;
  }

  return (
    <View className="flex-1 bg-black">
      <PullToRevealSymbol scrollY={scrollY} />

      <Animated.ScrollView
        className="flex-1"
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        })}
        scrollEventThrottle={16}
        bounces={true}
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader profile={profile} />
        <HomeContent profile={profile} handleLogout={handleLogout} loggingOut={loggingOut} />
        <Pressable onPress={() => router.push('/(app)/(screens)/feed')} className="mt-8 mb-16 mx-auto px-6 py-3 bg-red-600 rounded-full shadow-lg shadow-red-600/50">
          <Text className="text-white text-lg font-semibold">Ver Feed</Text>
        </Pressable>
      </Animated.ScrollView>
    </View>
  );
}