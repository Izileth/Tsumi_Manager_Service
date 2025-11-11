import React, { useState, forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import { View, Text, TextInput } from 'react-native';
import { AppBottomSheet } from '@/components/ui/bottom-sheet';
import { Territory } from '@/app/lib/types';
import { CustomButton } from '@/components/ui/custom-button';

type EditTerritorySheetProps = {
  onUpdate: (id: string, name: string, description: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  territory: Territory | null;
};

export const EditTerritorySheet = forwardRef(({ onUpdate, onDelete, territory }: EditTerritorySheetProps, ref) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const sheetRef = useRef<any>(null);

  useEffect(() => {
    if (territory) {
      setName(territory.name);
      setDescription(territory.description || '');
    }
  }, [territory]);

  useImperativeHandle(ref, () => ({
    present: () => sheetRef.current?.present(),
    dismiss: () => sheetRef.current?.dismiss(),
  }));

  const handleUpdate = async () => {
    if (territory) {
      setIsUpdating(true);
      await onUpdate(territory.id, name, description);
      setIsUpdating(false);
      sheetRef.current?.dismiss();
    }
  };

  const handleDelete = async () => {
    if (territory) {
      setIsDeleting(true);
      await onDelete(territory.id);
      setIsDeleting(false);
      sheetRef.current?.dismiss();
    }
  };

  return (
    <AppBottomSheet
      ref={sheetRef}
      title="Editar Território"
      titleJP="縄張りを編集"
      isLoading={isUpdating || isDeleting} // Pass isLoading prop here
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
          title="Salvar Alterações" 
          onPress={handleUpdate}
          isLoading={isUpdating}
          className="w-full bg-blue-900/20 border py-3 border-blue-800"
          textClassName="text-blue-400"
        />
        <CustomButton 
          title="Excluir Território" 
          onPress={handleDelete}
          isLoading={isDeleting}
          className="w-full bg-red-900/20 border py-3 border-red-800"
          textClassName="text-red-400"
        />
      </View>
    </AppBottomSheet>
  );
});

EditTerritorySheet.displayName = 'EditTerritorySheet';