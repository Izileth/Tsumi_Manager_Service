import React, { useState, useCallback } from 'react';
import { View, FlatList, Image, useWindowDimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

type PostImageCarouselProps = {
  images: string[];
};

export function PostImageCarousel({ images }: PostImageCarouselProps) {
  const { width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);

  // Define a largura do item do carrossel. 
  // Subtraímos 32 para levar em conta o padding horizontal do contêiner (px-4 = 16 de cada lado).
  const carouselItemWidth = width - 32;

  const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  }, [activeIndex]);

  const renderItem = ({ item }: { item: string }) => (
    <View style={{ width: carouselItemWidth }}>
      <Image
        source={{ uri: item }}
        className="h-64 rounded-lg"
        resizeMode="cover"
      />
    </View>
  );

  return (
    <View className="relative my-3 rounded-lg">
      <FlatList
        data={images}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item}-${index}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16} // Otimiza a frequência de eventos de rolagem
        decelerationRate="fast"
        bounces={false}
      />
      {/* Indicadores de Paginação */}
      {images.length > 1 && (
        <View className="absolute bottom-2 left-0 right-0 flex-row justify-center items-center space-x-2">
          {images.map((_, index) => (
            <View
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeIndex === index ? 'w-4 bg-white' : 'w-2 bg-white/50'
              }`}
            />
          ))}
        </View>
      )}
      {/* Gradiente para dar legibilidade aos indicadores */}
      <View className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-black/50 to-transparent rounded-b-lg pointer-events-none" />
    </View>
  );
}
