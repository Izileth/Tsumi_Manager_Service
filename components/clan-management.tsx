import { forwardRef, useImperativeHandle, useRef, useCallback } from 'react';
import { View, Text, Pressable, TextInput, ScrollView, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { AppBottomSheet } from './ui/bottom-sheet';
import { useClanManagement, ClanManagementView } from '../app/hooks/use-clan-management';
import { Profile } from '../app/lib/types';
import { CustomButton } from './ui/custom-button';
import { KanjiLoader } from './ui/kanji-loader';
import ClanEmblemEditor from '@/app/components/clan/ClanEmblemEditor';
import { LinearGradient } from 'expo-linear-gradient';

// Separate FormFields component to prevent re-renders
type FormFieldsProps = {
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (description: string) => void;
  tag: string;
  setTag: (tag: string) => void;
  emblem: string[];
  onEditEmblem: () => void;
  avatarUrl: string | null;
  bannerUrl: string | null;
  handlePickImage: (type: 'avatar' | 'banner') => Promise<void>;
};

const FormFields = ({
  name, setName, description, setDescription, tag, setTag, emblem, onEditEmblem,
  avatarUrl, bannerUrl, handlePickImage
}: FormFieldsProps) => {
  return (
    <>
      <Text className="text-white text-base font-bold mb-3">Imagens do Clã</Text>
      <View className="flex-row justify-around mb-5">
        <Pressable onPress={() => handlePickImage('avatar')} className="items-center active:opacity-70">
          <Image
            source={{ uri: avatarUrl || undefined }}
            className="w-20 h-20 rounded-full bg-black border border-zinc-800"
          />
          <Text className="text-red-400 mt-2 text-sm">Avatar</Text>
        </Pressable>
        <Pressable onPress={() => handlePickImage('banner')} className="items-center active:opacity-70">
          <Image
            source={{ uri: bannerUrl || undefined }}
            className="w-40 h-20 rounded-lg bg-black border border-zinc-800"
          />
          <Text className="text-red-400 mt-2 text-sm">Banner</Text>
        </Pressable>
      </View>

      <Text className="text-white text-base font-bold mb-3">Detalhes do Clã</Text>
      <TextInput
        className="bg-black text-white p-4 rounded-lg mb-4 text-base border border-zinc-800"
        placeholder="Nome do Clã"
        placeholderTextColor="#666"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        className="bg-black text-white p-4 rounded-lg mb-4 text-base border border-zinc-800 min-h-[100px]"
        placeholder="Descrição"
        placeholderTextColor="#666"
        value={description}
        onChangeText={setDescription}
        multiline
        textAlignVertical="top"
      />
      <TextInput
        className="bg-black text-white p-4 rounded-lg mb-4 text-base border border-zinc-800"
        placeholder="TAG (2-5 letras)"
        placeholderTextColor="#666"
        value={tag}
        onChangeText={t => setTag(t.replace(/[^A-Z0-9]/g, '').toUpperCase())}
        maxLength={5}
        autoCapitalize="characters"
      />

      <View className="mb-4">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-white text-base font-bold">Emblema do Clã</Text>
          <Pressable onPress={onEditEmblem} className="active:opacity-70">
            <Text className="text-blue-500 text-sm font-semibold">Editar</Text>
          </Pressable>
        </View>
        <View className="bg-black p-4 rounded-lg border border-zinc-800 flex-row justify-center items-center min-h-[60px]">
          {emblem.length > 0 ? (
            emblem.map((kanji, index) => (
              <Text key={index} className="text-white text-3xl mx-0.5">
                {kanji}
              </Text>
            ))
          ) : (
            <Text className="text-neutral-500 text-base">Nenhum emblema selecionado</Text>
          )}
        </View>
      </View>
    </>
  );
};

type Props = {
  profile?: Profile | null;
  refetchProfile: () => void;
};

export const ClanManagementModal = forwardRef<any, Props>(({ profile, refetchProfile }, ref) => {
  const bottomSheetRef = useRef<any>(null);

  const {
    view, clans, loading, name, setName, description, setDescription, tag, setTag, emblem, setEmblem, avatarUrl, bannerUrl,
    headerTitle, headerJpTitle, isOwner, initialize, handlePickImage, handleJoinClan, handleCreateClan, handleLeaveClan,
    handleUpdateClan, handleDeleteClan, handleSetView,
  } = useClanManagement(profile, refetchProfile, () => bottomSheetRef.current?.dismiss());

  useImperativeHandle(ref, () => ({
    present: () => {
      initialize();
      bottomSheetRef.current?.present();
    },
    dismiss: () => bottomSheetRef.current?.dismiss(),
  }));

  const handleEditEmblem = useCallback(() => {
    handleSetView('edit-emblem', 'Editar Emblema', '紋章を編集');
  }, [handleSetView]);

  const renderContent = () => {
    if (!profile) return <View />;
    if (loading && view !== 'join') {
      return (
        <View className="flex-1 justify-center items-center pt-5">
          <KanjiLoader />
        </View>
      );
    }

    const BackButton = ({ view, title, jpTitle }: { view: ClanManagementView, title: string, jpTitle: string }) => (
      <Pressable
        onPress={() => handleSetView(view, title, jpTitle)}
        className="absolute -top-2 left-0 z-10 p-2.5 active:opacity-70"
      >
        <FontAwesome name="chevron-left" size={18} color="#9ca3af" />
      </Pressable>
    );

    switch (view) {
      case 'main':
        return (
          <View className="pt-5">
            <Pressable
              className="flex-row items-center bg-black p-4 rounded-lg mb-2.5 border border-zinc-800 active:bg-zinc-900"
              onPress={() => handleSetView('join', 'Entrar em um Clã', '氏族に参加')}
            >
              <FontAwesome name="group" size={20} color="#f87171" />
              <Text className="text-white text-base ml-4 font-semibold">Entrar em um Clã Existente</Text>
            </Pressable>
            <Pressable
              className="flex-row items-center bg-black p-4 rounded-lg mb-2.5 border border-zinc-800 active:bg-zinc-900"
              onPress={() => handleSetView('create', 'Criar Novo Clã', '新しい氏族を作成')}
            >
              <FontAwesome name="shield" size={20} color="#f87171" />
              <Text className="text-white text-base ml-4 font-semibold">Criar um Novo Clã</Text>
            </Pressable>
          </View>
        );

      case 'join':
        return (
          <>
            <BackButton view="main" title="Junte-se a um Clã" jpTitle="氏族に参加" />
            {loading ? (
              <View className="flex-1 justify-center items-center pt-5">
                <KanjiLoader />
              </View>
            ) : (
              <ScrollView className="pt-2">
                {clans.map(clan => (
                  <View key={clan.id} className="flex-row items-center py-4 border-b border-zinc-800">
                    {clan.avatar_url && (
                      <Image
                        source={{ uri: clan.avatar_url }}
                        className="w-10 h-10 rounded-full mr-4 bg-zinc-800"
                      />
                    )}
                    <View className="flex-1">
                      <Text className="text-white text-lg font-bold">
                        {clan.name} {clan.tag ? `[${clan.tag}]` : ''}
                      </Text>
                      <View className="flex-row items-center mt-1">
                        <FontAwesome name="user-secret" size={12} color="#a1a1aa" />
                        <Text className="text-zinc-400 text-sm ml-1.5">
                          {clan.profiles?.username || 'Desconhecido'}
                        </Text>
                      </View>
                    </View>
                    <Pressable
                      className="bg-red-600 px-4 py-2 rounded-lg ml-2.5 active:bg-red-700"
                      onPress={() => handleJoinClan(clan.id)}
                    >
                      <Text className="text-white font-bold text-sm">Entrar</Text>
                    </Pressable>
                  </View>
                ))}
              </ScrollView>
            )}
          </>
        );

      case 'create':
        return (
          <>
            <BackButton view="main" title="Junte-se a um Clã" jpTitle="氏族に参加" />
            <ScrollView className="pt-8">
              <FormFields
                name={name} setName={setName}
                description={description} setDescription={setDescription}
                tag={tag} setTag={setTag}
                emblem={emblem} onEditEmblem={handleEditEmblem}
                avatarUrl={avatarUrl} bannerUrl={bannerUrl}
                handlePickImage={handlePickImage}
              />
              <CustomButton
                onPress={handleCreateClan}
                title="Criar e Entrar"
                isLoading={loading}
                className="w-full bg-red-900/20 border py-3 mb-8 border-red-800"
                textClassName="text-sm text-zinc-50 font-bold"
              />
            </ScrollView>
          </>
        );

      case 'manage':
        if (!profile.clans) return null;
        return (
          <View className="pt-0">
            {/* Banner com gradiente - agora com overflow controlado */}
            <View className="relative h-48 -mx-5 -mt-5 overflow-hidden">
              {profile.clans.banner_url && (
                <Image
                  source={{ uri: profile.clans.banner_url }}
                  className="absolute w-full h-full"
                  resizeMode="cover"
                />
              )}
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,1)', '#000000']}
                locations={[0, 0.4, 0.7, 1]}
                className="absolute inset-0 w-full h-full"
              />
            </View>

            {/* Header do clã */}
            <View className="w-full items-center -mt-28 px-5">
              {profile.clans.avatar_url ? (
                <Image
                  source={{ uri: profile.clans.avatar_url }}
                  className="w-20 h-20 rounded-full border-4 border-red-600"
                />
              ) : (
                <View className="w-20 h-20 rounded-full border-4 border-red-600 bg-zinc-800 justify-center items-center">
                  <Text className="text-4xl">{profile.clans.emblem || '氏'}</Text>
                </View>
              )}

              <Text className="text-white text-3xl font-bold text-center mt-3">
                {profile.clans.name} {profile.clans.tag ? `[${profile.clans.tag}]` : ''}
              </Text>

              {profile.clans.profiles?.username && (
                <View className="flex-row items-center mt-2">
                  <Text className="text-zinc-400 text-sm">
                    Criado por {profile.clans.profiles.username}
                  </Text>
                  {isOwner && (
                    <FontAwesome name="star" size={14} color="#facc15" style={{ marginLeft: 5 }} />
                  )}
                </View>
              )}
            </View>

            {profile.clans.description && (
              <Text className="text-zinc-400 text-base text-center mt-3 px-5">
                {profile.clans.description}
              </Text>
            )}

            <View className="h-px bg-zinc-800 my-6" />

            {/* Menu de ações */}
            <View className="px-0">
              {isOwner && (
                <Pressable
                  className="flex-row items-center bg-black p-4 rounded-lg mb-2.5 border border-zinc-800 active:bg-zinc-900"
                  onPress={() => handleSetView('edit', 'Editar Clã', '氏族を編集')}
                >
                  <FontAwesome name="pencil" size={20} color="#f87171" />
                  <Text className="text-white text-base ml-4 font-semibold">Editar Clã</Text>
                </Pressable>
              )}

              <Pressable
                className="flex-row items-center bg-black p-4 rounded-lg mb-2.5 border border-zinc-800 active:bg-zinc-900"
                onPress={handleLeaveClan}
              >
                <FontAwesome name="sign-out" size={20} color="#f87171" />
                <Text className="text-white text-base ml-4 font-semibold">Sair do Clã</Text>
              </Pressable>

              {isOwner && (
                <Pressable
                  className="flex-row items-center bg-black p-4 rounded-lg mt-5 border border-red-900/50 active:bg-zinc-900"
                  onPress={handleDeleteClan}
                >
                  <FontAwesome name="trash" size={20} color="#ef4444" />
                  <Text className="text-red-500 text-base ml-4 font-semibold">Excluir Clã</Text>
                </Pressable>
              )}
            </View>
          </View>
        );

      case 'edit':
        return (
          <>
            <BackButton view="manage" title="Gerenciar Clã" jpTitle="氏族管理" />
            <ScrollView className="pt-8">
              <FormFields
                name={name} setName={setName}
                description={description} setDescription={setDescription}
                tag={tag} setTag={setTag}
                emblem={emblem} onEditEmblem={handleEditEmblem}
                avatarUrl={avatarUrl} bannerUrl={bannerUrl}
                handlePickImage={handlePickImage}
              />
              <CustomButton
                onPress={handleUpdateClan}
                title="Salvar Alterações"
                isLoading={loading}
                className="w-full bg-red-900/20 border py-3 mb-8 border-red-800"
                textClassName="text-sm text-zinc-50 font-bold"
              />
            </ScrollView>
          </>
        );

      case 'edit-emblem':
        const cameFromCreate = !profile.clans;
        const previousView = cameFromCreate ? 'create' : 'edit';
        const previousTitle = cameFromCreate ? 'Criar Novo Clã' : 'Editar Clã';
        const previousJpTitle = cameFromCreate ? '新しい氏族を作成' : '氏族を編集';

        return (
          <>
            <BackButton view={previousView} title={previousTitle} jpTitle={previousJpTitle} />
            <ClanEmblemEditor
              initialEmblem={emblem}
              onEmblemChange={(newEmblem) => {
                setEmblem(newEmblem);
                handleSetView(previousView, previousTitle, previousJpTitle);
              }}
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <AppBottomSheet ref={bottomSheetRef} title={headerTitle} titleJP={headerJpTitle}>
      {renderContent()}
    </AppBottomSheet>
  );
});

ClanManagementModal.displayName = 'ClanManagementModal';