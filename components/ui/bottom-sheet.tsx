import React, { forwardRef, useImperativeHandle, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  Modal,
  Animated,
  PanResponder,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const DEFAULT_SNAP_POINT = SCREEN_HEIGHT * 1.0; // 99% of screen height

type AppBottomSheetProps = {
  title?: string;
  titleJP?: string;
  children: React.ReactNode;
  snapPoints?: (string | number)[]; // Not used in custom implementation, but kept for compatibility
  onDismiss?: () => void;
};

export const AppBottomSheet = forwardRef<any, AppBottomSheetProps>(
  ({ title, titleJP, children, onDismiss }, ref) => {
    const insets = useSafeAreaInsets();
    const [isVisible, setIsVisible] = useState(false);
    const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const currentHeight = useRef(DEFAULT_SNAP_POINT); // Track current height for PanResponder

    const animateOpen = useCallback(() => {
      setIsVisible(true);
      Animated.spring(translateY, {
        toValue: SCREEN_HEIGHT - DEFAULT_SNAP_POINT,
        damping: 15,
        stiffness: 100,
        useNativeDriver: true,
      }).start();
    }, [translateY]);

    const animateClose = useCallback(() => {
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setIsVisible(false);
        if (onDismiss) onDismiss();
      });
    }, [translateY, onDismiss]);

    useImperativeHandle(ref, () => ({
      present: animateOpen,
      dismiss: animateClose,
    }));

    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gestureState) => {
          // Only allow dragging down from the top part of the sheet
          // or if the scroll view is at the top and user is dragging down
          return gestureState.dy > 0 && gestureState.y0 < (SCREEN_HEIGHT - currentHeight.current + 50);
        },
        onPanResponderMove: (_, gestureState) => {
          if (gestureState.dy > 0) { // Only drag down
            translateY.setValue(SCREEN_HEIGHT - currentHeight.current + gestureState.dy);
          }
        },
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dy > 50) { // If dragged down more than 50 pixels
            animateClose();
          } else {
            // Snap back to open position
            Animated.spring(translateY, {
              toValue: SCREEN_HEIGHT - currentHeight.current,
              damping: 15,
              stiffness: 100,
              useNativeDriver: true,
            }).start();
          }
        },
      })
    ).current;

    if (!isVisible) return null;

    return (
      <Modal transparent visible={isVisible} onRequestClose={animateClose}>
        <Pressable className="flex-1 bg-black/50" onPress={animateClose}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
          >
            <Animated.View
              style={{
                transform: [{ translateY }],
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                width: '100%', // Full width
                height: DEFAULT_SNAP_POINT + insets.bottom, // Adjust height for safe area
                backgroundColor: '#000000',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                overflow: 'hidden',
              }}
              {...panResponder.panHandlers}
            >
              {/* Handle Indicator */}
              <View className="w-full items-center py-3">
                <View className="w-16 h-1.5 bg-black rounded-full" />
              </View>

              {/* Header */}
              {(title || titleJP) && (
                <View className="border-b border-neutral-800 px-6 pt-4 pb-4">
                  {titleJP && (
                    <Text className="text-red-500 text-2xl font-black tracking-wider text-center mb-1">
                      {titleJP}
                    </Text>
                  )}
                  {title && (
                    <Text className="text-white text-lg font-semibold text-center">
                      {title}
                    </Text>
                  )}
                  <View className="flex-row justify-center items-center gap-2 mt-3">
                    <View className="w-8 h-px bg-red-600" />
                    <Text className="text-neutral-700 text-xs">龍</Text>
                    <View className="w-8 h-px bg-red-600" />
                  </View>
                </View>
              )}

              {/* Content */}
              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: insets.bottom + 20 }}
              >
                {children}
              </ScrollView>
            </Animated.View>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>
    );
  }
);

AppBottomSheet.displayName = 'AppBottomSheet';