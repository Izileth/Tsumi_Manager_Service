import React, { useState, forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AppBottomSheet } from '@/components/ui/bottom-sheet';
import KanjiDictionary from '@/components/ui/KanjiDictionary';
import { CustomButton } from '@/components/ui/custom-button';

type EditJapaneseNameSheetProps = {
  initialName: string[];
  onSave: (name: string[]) => void;
};

export const EditJapaneseNameSheet = forwardRef(({ initialName, onSave }: EditJapaneseNameSheetProps, ref) => {
  const [japaneseName, setJapaneseName] = useState(initialName);
  const sheetRef = useRef<any>(null);

  useEffect(() => {
    setJapaneseName(initialName);
  }, [initialName]);

  useImperativeHandle(ref, () => ({
    present: () => sheetRef.current?.present(),
    dismiss: () => sheetRef.current?.dismiss(),
  }));

  const handleKanjiSelect = (kanji: string) => {
    if (japaneseName.length < 5) {
      setJapaneseName([...japaneseName, kanji]);
    }
  };

  const clearJapaneseName = () => {
    setJapaneseName([]);
  };

  const handleSave = () => {
    onSave(japaneseName);
    sheetRef.current?.dismiss();
  };

  return (
    <AppBottomSheet
      ref={sheetRef}
      title="Editar Nome Japonês"
      titleJP="別名を編集"
      isLoading={false} // No explicit loading state in this component
    >
      <View className="gap-4 pt-4">
        <View className="mb-4">
          <Text className="text-neutral-400 mb-2">Nome Japonês</Text>
          <View className="bg-black p-3 rounded-lg border border-zinc-900 flex-row justify-center items-center min-h-[50px]">
            {japaneseName.map((kanji, index) => (
              <Text key={index} className="text-white text-2xl">
                {kanji}
              </Text>
            ))}
          </View>
          <TouchableOpacity onPress={clearJapaneseName}>
            <Text className="text-red-500 text-xs mt-2 text-right">Limpar</Text>
          </TouchableOpacity>
        </View>
        <View className="mb-4">
          <KanjiDictionary onSelect={handleKanjiSelect} selectedKanji={japaneseName} />
        </View>
        <CustomButton
          title="Salvar Nome"
          onPress={handleSave}
          className="w-full bg-blue-900/20 border py-3 border-blue-800"
          textClassName="text-blue-400"
        />
      </View>
    </AppBottomSheet>
  );
});

EditJapaneseNameSheet.displayName = 'EditJapaneseNameSheet';
