import React, { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { View } from 'react-native';
import { AppBottomSheet } from '@/components/ui/bottom-sheet';
import { CustomButton } from '@/components/ui/custom-button';
import ClanEmblemEditor from '@/app/components/clan/ClanEmblemEditor';

type EditClanEmblemSheetProps = {
  onSave: (emblem: string[]) => void;
};

export const EditClanEmblemSheet = forwardRef(({ onSave }: EditClanEmblemSheetProps, ref) => {
  const [emblem, setEmblem] = useState<string[]>([]);
  const sheetRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    present: (currentEmblem?: string) => {
      setEmblem(currentEmblem ? currentEmblem.split('') : []);
      sheetRef.current?.present();
    },
    dismiss: () => sheetRef.current?.dismiss(),
  }));

  const handleSave = () => {
    onSave(emblem);
    sheetRef.current?.dismiss();
  };

  return (
    <AppBottomSheet
      ref={sheetRef}
      title="Editar Emblema do Clã"
      titleJP="クランの紋章を編集"
    >
      <View className="gap-4 pt-4">
        <ClanEmblemEditor initialEmblem={emblem} onEmblemChange={setEmblem} />
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
