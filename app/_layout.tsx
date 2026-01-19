import { Slot, useSegments, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { ProfileProvider } from "./context/profile-context";
import { AuthProvider, useAuth } from "./context/auth-context";
import LoadingScreen from "./_loading";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { View } from 'react-native';
import Toast from 'react-native-toast-message';
import { toastConfig } from '@/components/ui/toast-config';
import '@/global.css';

import GlobalHeader from "./components/ui/GlobalHeader";

const RootLayoutNav = () => {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [isSplashAnimationFinished, setSplashAnimationFinished] = useState(false);
  const [isAppReady, setAppReady] = useState(false);

  const opacity = useSharedValue(1);

  // This useEffect hook contains the route protection logic.
  // It runs inside the component that renders the <Slot />,
  // which is the correct place for it.
  useEffect(() => {
    // Wait until auth is loaded and splash animation is done
    if (loading || !isSplashAnimationFinished) return;

    // An auth flow route is one that lives in the (auth) or (password) groups.
    const inAuthFlow = segments[1] === '(auth)' || segments[1] === '(password)';

    // If the user is not signed in and is not in an auth flow route,
    // redirect to the login page.
    if (!user && !inAuthFlow) {
      router.replace('/(app)/(auth)/login');
    } 
    // If the user is signed in and is trying to access an auth flow route,
    // redirect to the main app screen.
    else if (user && inAuthFlow) {
      router.replace('/(app)');
    }
  }, [user, loading, segments, router, isSplashAnimationFinished]);

  // This useEffect handles the splash screen fade-out animation.
  useEffect(() => {
    if (!loading && isSplashAnimationFinished) {
      opacity.value = withTiming(0, { duration: 400 }, (finished) => {
        if (finished) {
          runOnJS(setAppReady)(true);
        }
      });
    }
  }, [loading, isSplashAnimationFinished, opacity]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <View style={{ flex: 1 }}>

      <Slot />
      <StatusBar style="light" backgroundColor="#000000" translucent />

      {/* The splash screen is an overlay that fades out, it no longer replaces the Slot */}
      {!isAppReady && (
        <Animated.View style={[{ flex: 1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }, animatedStyle]}>
          <LoadingScreen onAnimationEnd={() => setSplashAnimationFinished(true)} />
        </Animated.View>
      )}
      <Toast config={toastConfig} />
    </View>
  );
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <RootLayoutNav />
      </ProfileProvider>
    </AuthProvider>
  );
}
