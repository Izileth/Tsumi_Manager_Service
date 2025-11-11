import React, { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { View, Text, TextInput } from 'react-native';
import { AppBottomSheet } from '@/components/ui/bottom-sheet';
import { CustomButton } from '@/components/ui/custom-button';

type AddTerritorySheetProps = {
  onSubmit: (name: string, description: string) => Promise<void>;
};

export const AddTerritorySheet = forwardRef(({ onSubmit }: AddTerritorySheetProps, ref) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const sheetRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    present: () => sheetRef.current?.present(),
    dismiss: () => sheetRef.current?.dismiss(),
  }));

  const handleSubmit = async () => {
    setIsLoading(true);
    await onSubmit(name, description);
    setIsLoading(false);
    setName('');
    setDescription('');
    sheetRef.current?.dismiss();
  };

  return (
    <AppBottomSheet
      ref={sheetRef}
      title="Novo Território"
      titleJP="新しい縄張り"
      isLoading={isLoading} // Pass isLoading prop here
    >
      <View className="gap-4 pt-4">
        <View>
          <Text className="text-neutral-400 text-xs mb-2">NOME DO TERRITÓRIO</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Ex: Distrito da Luz Vermelha"
            placeholderTextColor="#555"
            className="bg-black border border-zinc-900 rounded-lg px-4 py-3 text-white"
          />
        </View>
        <View>
          <Text className="text-neutral-400 text-xs mb-2">DESCRIÇÃO</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Uma breve descrição do território"
            placeholderTextColor="#555"
            multiline
            numberOfLines={4}
            className="bg-black border border-zinc-900 rounded-lg px-4 py-3 text-white h-24"
          />
        </View>
        <CustomButton
          title="Criar Território"
          onPress={handleSubmit}
          isLoading={isLoading}
          className="w-full bg-red-900/20 border py-3 border-red-800"
          textClassName="text-red-400"
        />
      </View>
    </AppBottomSheet>
  );
});

AddTerritorySheet.displayName = 'AddTerritorySheet';