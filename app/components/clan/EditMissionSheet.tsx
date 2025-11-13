import React, { useState, forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import { View, Text, TextInput } from 'react-native';
import { AppBottomSheet } from '@/components/ui/bottom-sheet';
import { Mission, Territory } from '@/app/lib/types';
import { Picker } from '@react-native-picker/picker';
import { CustomButton } from '@/components/ui/custom-button';

type EditMissionSheetProps = {
  onUpdate: (data: {
    id: string;
    name: string;
    description: string;
    territoryId: string;
    reward: { money: number; reputation: number };
    level: number;
  }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  mission: Mission | null;
  territories: Territory[];
};

export const EditMissionSheet = forwardRef(({ onUpdate, onDelete, mission, territories }: EditMissionSheetProps, ref) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [money, setMoney] = useState('');
  const [reputation, setReputation] = useState('');
  const [level, setLevel] = useState('1');
  const [selectedTerritory, setSelectedTerritory] = useState<string | undefined>();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const sheetRef = useRef<any>(null);

  useEffect(() => {
    if (mission) {
      setName(mission.name);
      setDescription(mission.description || '');
      setSelectedTerritory(mission.territory_id);
      setMoney(String(mission.reward?.money || ''));
      setReputation(String(mission.reward?.reputation || ''));
      setLevel(String(mission.level || '1'));
    }
  }, [mission]);

  useImperativeHandle(ref, () => ({
    present: () => sheetRef.current?.present(),
    dismiss: () => sheetRef.current?.dismiss(),
  }));

  const handleUpdate = async () => {
    if (mission && selectedTerritory) {
      setIsUpdating(true);
      await onUpdate({
        id: mission.id,
        name,
        description,
        territoryId: selectedTerritory,
        reward: {
          money: Number(money) || 0,
          reputation: Number(reputation) || 0,
        },
        level: Number(level) || 1,
      });
      setIsUpdating(false);
      sheetRef.current?.dismiss();
    }
  };

  const handleDelete = async () => {
    if (mission) {
      setIsDeleting(true);
      await onDelete(mission.id);
      setIsDeleting(false);
      sheetRef.current?.dismiss();
    }
  };

  return (
    <AppBottomSheet
      ref={sheetRef}
      title="Editar Missão"
      titleJP="任務を編集"
    >
      <View className="gap-4 pt-4">
        <View>
          <Text className="text-neutral-400 text-xs mb-2">TERRITÓRIO</Text>
          <View className="bg-black border border-zinc-900 rounded-lg text-white">
            <Picker
              selectedValue={selectedTerritory}
              onValueChange={(itemValue) => setSelectedTerritory(itemValue)}
              style={{ color: 'white' }}
              dropdownIconColor="white"
            >
              {territories.map((territory) => (
                <Picker.Item key={territory.id} label={territory.name} value={territory.id} />
              ))}
            </Picker>
          </View>
        </View>
        <View>
          <Text className="text-neutral-400 text-xs mb-2">NOME DA MISSÃO</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Ex: Coletar Dívidas"
            placeholderTextColor="#555"
            className="bg-black border border-zinc-900 rounded-lg px-4 py-3 text-white"
          />
        </View>
        <View>
          <Text className="text-neutral-400 text-xs mb-2">DESCRIÇÃO</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Uma breve descrição da missão"
            placeholderTextColor="#555"
            multiline
            numberOfLines={3}
            className="bg-black border border-zinc-900 rounded-lg px-4 py-3 text-white h-20"
          />
        </View>
        <View className="flex-row gap-4">
          <View className="flex-1">
            <Text className="text-neutral-400 text-xs mb-2">RECOMPENSA (¥)</Text>
            <TextInput
              value={money}
              onChangeText={setMoney}
              placeholder="1000"
              placeholderTextColor="#555"
              keyboardType="numeric"
              className="bg-black border border-zinc-900 rounded-lg px-4 py-3 text-white"
            />
          </View>
          <View className="flex-1">
            <Text className="text-neutral-400 text-xs mb-2">REPUTAÇÃO</Text>
            <TextInput
              value={reputation}
              onChangeText={setReputation}
              placeholder="10"
              placeholderTextColor="#555"
              keyboardType="numeric"
              className="bg-black border border-zinc-900 rounded-lg px-4 py-3 text-white"
            />
          </View>
        </View>
        <View>
          <Text className="text-neutral-400 text-xs mb-2">NÍVEL DA MISSÃO</Text>
          <TextInput
            value={level}
            onChangeText={setLevel}
            placeholder="1"
            placeholderTextColor="#555"
            keyboardType="numeric"
            className="bg-black border border-zinc-900 rounded-lg px-4 py-3 text-white"
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
          title="Excluir Missão"
          onPress={handleDelete}
          isLoading={isDeleting}
          className="w-full bg-red-900/20 border py-3 border-red-800"
          textClassName="text-red-400"
        />
      </View>
    </AppBottomSheet>
  );
});

EditMissionSheet.displayName = 'EditMissionSheet';