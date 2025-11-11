import React, { useState, forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AppBottomSheet } from '@/components/ui/bottom-sheet';
import KanjiDictionary from '@/components/ui/KanjiDictionary';
import { CustomButton } from '@/components/ui/custom-button';

type EditClanEmblemSheetProps = {
  initialEmblem: string[];
  onSave: (emblem: string[]) => void;
};

export const EditClanEmblemSheet = forwardRef(({ initialEmblem, onSave }: EditClanEmblemSheetProps, ref) => {
  const [emblem, setEmblem] = useState(initialEmblem);
  const sheetRef = useRef<any>(null);

  useEffect(() => {
    setEmblem(initialEmblem);
  }, [initialEmblem]);

  useImperativeHandle(ref, () => ({
    present: () => sheetRef.current?.present(),
    dismiss: () => sheetRef.current?.dismiss(),
  }));

  const handleKanjiSelect = (kanji: string) => {
    if (emblem.length < 5) {
      setEmblem([...emblem, kanji]);
    }
  };

  const clearEmblem = () => {
    setEmblem([]);
  };

  const handleSave = () => {
    onSave(emblem);
    sheetRef.current?.dismiss();
  };

  return (
    <AppBottomSheet
      ref={sheetRef}
      title="Editar Emblema do Clã"
      titleJP="家紋を編集"
      isLoading={false} // No explicit loading state in this component
    >
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
        <CustomButton
          title="Salvar Emblema"
          onPress={handleSave}
          className="w-full bg-blue-900/20 border py-3 border-blue-800"
          textClassName="text-blue-400"
        />
      </View>
    </AppBottomSheet>
  );
});

EditClanEmblemSheet.displayName = 'EditClanEmblemSheet';
