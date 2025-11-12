import { forwardRef, useImperativeHandle, useRef, useCallback } from 'react';
import { View, Text, Pressable, TextInput, ScrollView, StyleSheet, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { AppBottomSheet } from './ui/bottom-sheet';
import { useClanManagement, ClanManagementView } from '../app/hooks/use-clan-management';
import { Profile } from '../app/lib/types';
import { CustomButton } from './ui/custom-button';
import { KanjiLoader } from './ui/kanji-loader';
import ClanEmblemEditor from '@/app/components/clan/ClanEmblemEditor';

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
      <Text style={styles.formLabel}>Imagens do Clã</Text>
      <View style={styles.imagePickerContainer}>
        <Pressable onPress={() => handlePickImage('avatar')} style={styles.imagePicker}>
          <Image source={{ uri: avatarUrl || undefined }} style={styles.avatar} />
          <Text style={styles.imagePickerText}>Avatar</Text>
        </Pressable>
        <Pressable onPress={() => handlePickImage('banner')} style={styles.imagePicker}>
          <Image source={{ uri: bannerUrl || undefined }} style={styles.banner} />
          <Text style={styles.imagePickerText}>Banner</Text>
        </Pressable>
      </View>

      <Text style={styles.formLabel}>Detalhes do Clã</Text>
      <TextInput style={styles.input} placeholder="Nome do Clã" placeholderTextColor="#666" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Descrição" placeholderTextColor="#666" value={description} onChangeText={setDescription} multiline />
      <View style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="TAG (2-5 letras)"
          placeholderTextColor="#666"
          value={tag}
          onChangeText={t => setTag(t.replace(/[^A-Z0-9]/g, '').toUpperCase())}
          maxLength={5}
          autoCapitalize="characters"
        />
      </View>
      <View className="mb-4">
        <View className="flex-row justify-between items-center mb-2">
          <Text style={styles.formLabel}>Emblema do Clã</Text>
          <Pressable onPress={onEditEmblem} className="active:opacity-70">
            <Text className="text-blue-500">Editar</Text>
          </Pressable>
        </View>
        <View className="bg-black p-3 rounded-lg border border-zinc-900 flex-row justify-center items-center min-h-[50px]">
          {emblem.length > 0 ? (
            emblem.map((kanji, index) => (
              <Text key={index} className="text-white text-2xl">
                {kanji}
              </Text>
            ))
          ) : (
            <Text className="text-neutral-500">Nenhum</Text>
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
    if (loading && view !== 'join') return <View style={styles.centered}><KanjiLoader /></View>;

    const BackButton = ({ view, title, jpTitle }: { view: ClanManagementView, title: string, jpTitle: string }) => (
      <Pressable onPress={() => handleSetView(view, title, jpTitle)} style={styles.backButton}>
        <FontAwesome name="chevron-left" size={18} color="#9ca3af" />
      </Pressable>
    );

    switch (view) {
      case 'main':
        return (
          <View style={styles.menu}>
            <Pressable style={styles.menuButton} onPress={() => handleSetView('join', 'Entrar em um Clã', '氏族に参加')}>
              <FontAwesome name="group" size={20} color="#f87171" />
              <Text style={styles.menuButtonText}>Entrar em um Clã Existente</Text>
            </Pressable>
            <Pressable style={styles.menuButton} onPress={() => handleSetView('create', 'Criar Novo Clã', '新しい氏族を作成')}>
              <FontAwesome name="shield" size={20} color="#f87171" />
              <Text style={styles.menuButtonText}>Criar um Novo Clã</Text>
            </Pressable>
          </View>
        );
      case 'join':
        return (
          <>
            <BackButton view="main" title="Junte-se a um Clã" jpTitle="氏族に参加" />
            {loading ? <View style={styles.centered}><KanjiLoader /></View> :
              <ScrollView>
                {clans.map(clan => (
                  <View key={clan.id} style={styles.clanItem}>
                    {clan.avatar_url && <Image source={{ uri: clan.avatar_url }} style={styles.clanAvatar} />}
                    <View style={{ flex: 1 }}>
                      <Text style={styles.clanName}>{clan.name} {clan.tag ? `[${clan.tag}]` : ''}</Text>
                      <View style={styles.ownerInfo}>
                        <FontAwesome name="user-secret" size={12} color="#a1a1aa" />
                        <Text style={styles.ownerName}>{clan.profiles?.username || 'Desconhecido'}</Text>
                      </View>
                    </View>
                    <Pressable style={styles.joinButton} onPress={() => handleJoinClan(clan.id)}>
                      <Text style={styles.joinButtonText}>Entrar</Text>
                    </Pressable>
                  </View>
                ))}
              </ScrollView>
            }
          </>
        );
      case 'create':
        return (
          <>
            <BackButton view="main" title="Junte-se a um Clã" jpTitle="氏族に参加" />
            <ScrollView style={styles.form}>
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
                className="w-full  bg-red-900/20 border py-3 mb-8  border-red-800"
                textClassName="text-sm text-zinc-50 font-bold"
              />
            </ScrollView>
          </>
        );
      case 'manage':
        if (!profile.clans) return null;
        return (
          <View style={styles.manageView}>
            {profile.clans.banner_url && <Image source={{ uri: profile.clans.banner_url }} style={styles.manageBanner} />}
            <View style={styles.manageHeader}>
              {profile.clans.avatar_url ?
                <Image source={{ uri: profile.clans.avatar_url }} style={styles.manageAvatar} /> :
                <View style={styles.manageAvatar}><Text style={{ fontSize: 40 }}>{profile.clans.emblem || '氏'}</Text></View>
              }
              <Text style={styles.clanTitle}>{profile.clans.name} {profile.clans.tag ? `[${profile.clans.tag}]` : ''}</Text>
              {profile.clans.profiles?.username && (
                <View style={styles.ownerInfo}>
                  <Text style={styles.ownerName}>Criado por {profile.clans.profiles.username}</Text>
                  {isOwner && <FontAwesome name="star" size={14} color="#facc15" style={{ marginLeft: 5 }} />}
                </View>
              )}
            </View>
            {profile.clans.description && <Text style={styles.clanManageDescription}>{profile.clans.description}</Text>}
            <View style={styles.separator} />
            {isOwner && (
              <Pressable style={styles.menuButton} onPress={() => handleSetView('edit', 'Editar Clã', '氏族を編集')}>
                <FontAwesome name="pencil" size={20} color="#f87171" />
                <Text style={styles.menuButtonText}>Editar Clã</Text>
              </Pressable>
            )}
            <Pressable style={styles.menuButton} onPress={handleLeaveClan}>
              <FontAwesome name="sign-out" size={20} color="#f87171" />
              <Text style={styles.menuButtonText}>Sair do Clã</Text>
            </Pressable>
            {isOwner && (
              <Pressable style={[styles.menuButton, { marginTop: 20 }]} onPress={handleDeleteClan}>
                <FontAwesome name="trash" size={20} color="#ef4444" />
                <Text style={[styles.menuButtonText, { color: '#ef4444' }]}>Excluir Clã</Text>
              </Pressable>
            )}
          </View>
        );
      case 'edit':
        return (
          <>
            <BackButton view="manage" title="Gerenciar Clã" jpTitle="氏族管理" />
            <ScrollView style={styles.form}>
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
                className="w-full  bg-red-900/20 border py-3 mb-8  border-red-800"
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
              onSave={(newEmblem) => {
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
    <AppBottomSheet ref={bottomSheetRef} title={headerTitle} titleJP={headerJpTitle} >
      {renderContent()}
    </AppBottomSheet>
  );
});

ClanManagementModal.displayName = 'ClanManagementModal';

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 20 },
  backButton: { position: 'absolute', top: -10, left: 0, zIndex: 1, padding: 10 },
  menu: { paddingTop: 20 },
  menuButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#000000', padding: 15, borderRadius: 10, marginBottom: 10, borderColor: '#303030', borderWidth: 1 },
  menuButtonText: { color: 'white', fontSize: 16, marginLeft: 15, fontWeight: '600' },
  form: { paddingTop: 30 },
  formLabel: { color: 'white', fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  input: { backgroundColor: '#000000', color: 'white', padding: 15, borderRadius: 10, marginBottom: 15, fontSize: 16, borderColor: '#303030', borderWidth: 1 },
  row: { flexDirection: 'row' },
  customButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 40,
    minHeight: 56,
  },
  customButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  clanItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#2a2a2a' },
  clanAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 15, backgroundColor: '#2a2a2a' },
  clanName: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  clanDescription: { color: '#9ca3af', fontSize: 14, marginTop: 4, flexShrink: 1 },
  joinButton: { backgroundColor: '#DC2626', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8, marginLeft: 10 },
  joinButtonText: { color: 'white', fontWeight: 'bold' },
  manageView: { paddingTop: 0 },
  manageBanner: { width: '110%', height: 120, position: 'absolute', top: -20, left: -20, right: -20 },
  manageHeader: { alignItems: 'center', marginTop: 60 },
  manageAvatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#ccc', borderWidth: 3, borderColor: '#DC2626', justifyContent: 'center', alignItems: 'center', color: 'white' },
  clanTitle: { color: 'white', fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginTop: 10 },
  clanManageDescription: { color: '#a1a1aa', fontSize: 16, textAlign: 'center', marginTop: 8, paddingHorizontal: 20 },
  separator: { height: 1, backgroundColor: '#2a2a2a', marginVertical: 24 },
  imagePickerContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  imagePicker: { alignItems: 'center' },
  imagePickerText: { color: '#f87171', marginTop: 8 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#000000', borderWidth: 1, borderColor: '#303030' },
  banner: { width: 160, height: 80, borderRadius: 10, backgroundColor: '#000000', borderWidth: 1, borderColor: '#303030' },
  ownerInfo: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  ownerName: { color: '#a1a1aa', fontSize: 14, marginLeft: 5 },
});