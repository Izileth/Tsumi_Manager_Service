
import { Slot, useRouter, useSegments } from "expo-router";

import { useEffect, useState } from "react";

import { StatusBar } from "expo-status-bar";

import { AuthProvider, useAuth } from "./auth-context";

import LoadingScreen from "./_loading";

import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';

import { View } from 'react-native';

import '@/global.css';


const InitialLayout = () => {

  const { isAuthenticated } = useAuth();

  const segments = useSegments();

  const router = useRouter();

  

  const [isSplashAnimationFinished, setSplashAnimationFinished] = useState(false);

  const [isAppReady, setAppReady] = useState(false);




  const opacity = useSharedValue(1);



  useEffect(() => {
    if (!isSplashAnimationFinished) return;

    const inAppGroup = segments[0] === "(app)";

    if (isAuthenticated) {
      if (!inAppGroup) {
        router.replace("/(app)");
      }
    }
    else {
      if (inAppGroup) {
        router.replace("/login");
      } else if (!segments?.[0]) {
        router.replace("/login");
      }
    }
  }, [isAuthenticated, isSplashAnimationFinished, segments, router]);



  useEffect(() => {

    if (isSplashAnimationFinished) {

      opacity.value = withTiming(0, { duration: 400 }, (finished) => {

        if (finished) {

          runOnJS(setAppReady)(true);

        }

      });

    }

  }, [isSplashAnimationFinished, opacity]);



  const animatedStyle = useAnimatedStyle(() => {

    return {

      opacity: opacity.value,

    };

  });



  return (

    <View style={{ flex: 1 }}>

      <Slot />

      <StatusBar style="light" backgroundColor="#000000" translucent />



      {!isAppReady && (

        <Animated.View style={[{ flex: 1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }, animatedStyle]}>

          <LoadingScreen onAnimationEnd={() => setSplashAnimationFinished(true)} />

        </Animated.View>

      )}

    </View>

  );

};

export default function RootLayout() {
  return (
    <AuthProvider>
      <InitialLayout />
    </AuthProvider>
  );
}
