import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import KanjiDictionary from '@/components/ui/KanjiDictionary';

type ClanEmblemEditorProps = {
  initialEmblem: string[];
  onEmblemChange: (emblem: string[]) => void;
};

export default function ClanEmblemEditor({ initialEmblem, onEmblemChange }: ClanEmblemEditorProps) {
  const [emblem, setEmblem] = useState(initialEmblem);

  useEffect(() => {
    setEmblem(initialEmblem);
  }, [initialEmblem]);

  const handleKanjiSelect = (kanji: string) => {
    if (emblem.length < 4) {
      const newEmblem = [...emblem, kanji];
      setEmblem(newEmblem);
      onEmblemChange(newEmblem);
    }
  };

  const clearEmblem = () => {
    setEmblem([]);
    onEmblemChange([]);
  };

  return (
    <View className="gap-4 pt-4">
      <View className="mb-4">
        <Text className="text-neutral-400 mb-2">Emblema</Text>
        <View className="bg-black p-3 rounded-lg border border-zinc-900 flex-row justify-center items-center min-h-[50px]">
          {emblem.map((kanji, index) => (
            <Text key={index} className="text-white text-2xl">
              {kanji}
            </Text>
          ))}
        </View>
        <TouchableOpacity onPress={clearEmblem}>
          <Text className="text-red-500 text-xs mt-2 text-right">Limpar</Text>
        </TouchableOpacity>
      </View>
      <View className="mb-4">
        <KanjiDictionary onSelect={handleKanjiSelect} selectedKanji={emblem} />
      </View>
    </View>
  );
}
