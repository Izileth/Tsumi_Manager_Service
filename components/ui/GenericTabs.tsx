import { View, Text, Pressable, ScrollView, Animated } from 'react-native';
import { useEffect, useRef } from 'react';

export type Tab<T extends string> = {
  label: string;
  value: T;
};

interface TabItemProps<T extends string> {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

const TabItem = <T extends string>({ label, isSelected, onPress }: TabItemProps<T>) => {
  const scaleAnim = useRef(new Animated.Value(isSelected ? 1 : 0.95)).current;
  const borderAnim = useRef(new Animated.Value(isSelected ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: isSelected ? 1 : 0.95,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
      Animated.timing(borderAnim, {
        toValue: isSelected ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  }, [isSelected]);

  const borderHeight = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 3],
  });

  const borderOpacity = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <Pressable onPress={onPress} style={{ opacity: 1 }}>
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
          paddingHorizontal: 20,
          paddingVertical: 12,
          backgroundColor: '#000000',
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#000000',
          position: 'relative',
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontWeight: '600',
            color: isSelected ? '#ffffff' : '#a3a3a3',
          }}
        >
          {label}
        </Text>
        <Animated.View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: borderHeight,
            backgroundColor: '#dc2626',
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
            opacity: borderOpacity,
          }}
        />
      </Animated.View>
    </Pressable>
  );
};

interface GenericTabsProps<T extends string> {
  tabs: Tab<T>[];
  selectedTab: T;
  onTabPress: (tab: T) => void;
}

export function GenericTabs<T extends string>({ tabs, selectedTab, onTabPress }: GenericTabsProps<T>) {
  return (
    <View style={{ marginBottom: 24 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {tabs.map((tab) => (
            <TabItem
              key={tab.value}
              label={tab.label}
              isSelected={selectedTab === tab.value}
              onPress={() => onTabPress(tab.value)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
