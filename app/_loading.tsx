import { View, Text, useWindowDimensions } from "react-native";
import { useEffect, useCallback } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withDelay,
  runOnJS,
} from "react-native-reanimated";

type LoadingScreenProps = {
  onAnimationEnd: () => void;
};

export default function LoadingScreen({ onAnimationEnd }: LoadingScreenProps) {
  const dimensions = useWindowDimensions();
  
  // Valores compartilhados para animação
  const logoScale = useSharedValue(1);
  const logoPositionY = useSharedValue(0);
  const logoOpacity = useSharedValue(1);
  const rotateValue = useSharedValue(0);
  const contentOpacity = useSharedValue(0);

  // Estilos animados do logo
  const logoAnimatedStyles = useAnimatedStyle(() => ({
    transform: [
      { scale: logoScale.value },
      { translateY: logoPositionY.value },
      { rotate: `${rotateValue.value}deg` },
    ],
    opacity: logoOpacity.value,
  }));

  // Estilos animados do círculo externo
  const circleAnimatedStyles = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotateValue.value * 2}deg` },
      { scale: logoScale.value },
    ],
    opacity: logoOpacity.value,
  }));

  // Estilos animados do conteúdo
  const contentAnimatedStyles = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const onEndSplash = useCallback(() => {
    onAnimationEnd();
  }, [onAnimationEnd]);

  const startAnimation = useCallback(() => {
    // Fase 1: Pulse inicial do logo (escala)
    logoScale.value = withSequence(
      withTiming(0.8, { duration: 400 }),
      withTiming(1.2, { duration: 400 }),
      withTiming(1, { duration: 400 }, (finished) => {
        if (finished) {
          // Fase 2: Rotação suave
          rotateValue.value = withTiming(360, { duration: 800 }, (finished) => {
            if (finished) {
              // Fase 3: Logo desce um pouco e conteúdo aparece
              logoPositionY.value = withTiming(50, { duration: 600 }, () => {
                contentOpacity.value = withTiming(1, { duration: 400 });
              });

              // Fase 4: Após delay, logo sobe e desaparece
              logoPositionY.value = withDelay(
                1200,
                withTiming(-dimensions.height, { duration: 1200 })
              );
              
              logoOpacity.value = withDelay(
                1800,
                withTiming(0, { duration: 400 }, (finished) => {
                  if (finished) {
                    runOnJS(onEndSplash)();
                  }
                })
              );
            }
          });
        }
      })
    );
  }, [dimensions, onEndSplash, contentOpacity, logoOpacity, logoPositionY, logoScale, rotateValue]);

  useEffect(() => {
    startAnimation();
  }, [startAnimation]);

  return (
    <View className="flex-1 bg-black justify-center items-center">
      {/* Gradient Effects */}
      <View className="absolute -top-24 -right-24 w-72 h-72 bg-red-600 opacity-10 rounded-full blur-3xl" />
      <View className="absolute -bottom-36 -left-36 w-96 h-96 bg-orange-900 opacity-5 rounded-full blur-3xl" />

      {/* Círculo Externo Rotativo */}
      <Animated.View 
        style={[circleAnimatedStyles]}
        className="absolute"
      >
        <View className="w-40 h-40 border-2 border-transparent border-t-red-600 border-r-red-600/40 rounded-full" />
      </Animated.View>

      <Animated.View 
        style={[circleAnimatedStyles]}
        className="absolute"
      >
        <View className="w-40 h-40 border-2 border-transparent border-b-red-500/60 border-l-red-500/20 rounded-full" />
      </Animated.View>

      {/* Logo Central Animado */}
      <Animated.View style={[logoAnimatedStyles]}>
        <View className="w-24 h-24 rounded-full bg-transparent border-4 border-red-600 justify-center items-center shadow-lg shadow-red-600/60">
          <Text className="text-4xl text-red-600 font-bold">罪</Text>
        </View>
      </Animated.View>

      {/* Conteúdo que aparece */}
      <Animated.View 
        style={[contentAnimatedStyles]}
        className="absolute items-center mt-32"
      >
        <Text className="text-white text-2xl font-bold tracking-wider mb-1">
          紅龍組
        </Text>
        <Text className="text-red-500 text-base font-semibold tracking-widest">
          プラットフォーム
        </Text>
        <View className="h-px w-24 bg-red-600 mt-3 mb-2" />
        <Text className="text-neutral-500 text-xs tracking-[0.3em] uppercase">
          Welcome to the underworld
        </Text>
      </Animated.View>
    </View>
  );
}