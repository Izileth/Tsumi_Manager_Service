import { Text, TextInput, View, Pressable } from 'react-native';
import type { User } from '@supabase/supabase-js';

type ProfileFormProps = {
  user: User | null;
  username: string;
  setUsername: (value: string) => void;
  bio: string;
  setBio: (value: string) => void;
  slug: string;
  handleSlugChange: (value: string) => void;
  website: string;
  setWebsite: (value: string) => void;
  githubUsername: string;
  setGithubUsername: (value: string) => void;
  twitterUsername: string;
  setTwitterUsername: (value: string) => void;
  newEmail: string;
  setNewEmail: (value: string) => void;
  newPassword: string;
  setNewPassword: (value: string) => void;
  japaneseName: string[];
  onEditJapaneseName: () => void;
};

export function ProfileForm({
  user,
  username,
  setUsername,
  bio,
  setBio,
  slug,
  handleSlugChange,
  website,
  setWebsite,
  githubUsername,
  setGithubUsername,
  twitterUsername,
  setTwitterUsername,
  newEmail,
  setNewEmail,
  newPassword,
  setNewPassword,
  japaneseName,
  onEditJapaneseName,
}: ProfileFormProps) {
  return (
    <>
      <Text className="text-white font-bold text-lg mb-4">Informações Públicas</Text>
      <View className="mb-4">
        <Text className="text-neutral-400 mb-2">Nome de Usuário</Text>
        <TextInput
          className="bg-black text-white p-3 rounded-lg border border-zinc-900"
          value={username}
          onChangeText={setUsername}
        />
      </View>
      <View className="mb-4">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-neutral-400">Nome Japonês</Text>
          <Pressable onPress={onEditJapaneseName} className="active:opacity-70">
            <Text className="text-blue-500">Editar</Text>
          </Pressable>
        </View>
        <View className="bg-black p-3 rounded-lg border border-zinc-900 flex-row justify-center items-center min-h-[50px]">
          {japaneseName.length > 0 ? (
            japaneseName.map((kanji, index) => (
              <Text key={index} className="text-white text-2xl">
                {kanji}
              </Text>
            ))
          ) : (
            <Text className="text-neutral-500">Nenhum</Text>
          )}
        </View>
      </View>
      <View className="mb-4">
        <Text className="text-neutral-400 mb-2">Bio</Text>
        <TextInput
          className="bg-black text-white p-3 rounded-lg border border-zinc-900 h-24"
          value={bio}
          onChangeText={setBio}
          multiline
          textAlignVertical="top"
        />
      </View>
      <View className="mb-6">
        <Text className="text-neutral-400 mb-2">Slug</Text>
        <TextInput
          className="bg-black text-white p-3 rounded-lg border border-zinc-900"
          value={slug}
          onChangeText={handleSlugChange}
          autoCapitalize="none"
        />
        <Text className="text-neutral-500 text-xs mt-2">
          Será formatado como URL. Apenas letras minúsculas, números e hífens.
        </Text>
      </View>

      <Text className="text-white font-bold text-lg mb-4">Links Sociais</Text>
      <View className="mb-4">
        <Text className="text-neutral-400 mb-2">Website</Text>
        <TextInput
          className="bg-black text-white p-3 rounded-lg border border-zinc-900"
          value={website}
          onChangeText={setWebsite}
          placeholder="https://seu-site.com"
          placeholderTextColor="#666"
          autoCapitalize="none"
          keyboardType="url"
        />
      </View>
      <View className="mb-4">
        <Text className="text-neutral-400 mb-2">GitHub</Text>
        <TextInput
          className="bg-black text-white p-3 rounded-lg border border-zinc-900"
          value={githubUsername}
          onChangeText={setGithubUsername}
          placeholder="seu-usuario"
          placeholderTextColor="#666"
          autoCapitalize="none"
        />
      </View>
      <View className="mb-6">
        <Text className="text-neutral-400 mb-2">Twitter / X</Text>
        <TextInput
          className="bg-black text-white p-3 rounded-lg border border-zinc-900"
          value={twitterUsername}
          onChangeText={setTwitterUsername}
          placeholder="seu-usuario"
          placeholderTextColor="#666"
          autoCapitalize="none"
        />
      </View>

      <Text className="text-white font-bold text-lg mb-4">Informações Privadas</Text>
      <View className="mb-4">
        <Text className="text-neutral-400 mb-2">Novo E-mail</Text>
        <TextInput
          className="bg-black text-white p-3 rounded-lg border border-zinc-900"
          value={newEmail}
          onChangeText={setNewEmail}
          placeholder={user?.email}
          placeholderTextColor="#666"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <View className="mb-6">
        <Text className="text-neutral-400 mb-2">Nova Senha</Text>
        <TextInput
          className="bg-black text-white p-3 rounded-lg border border-zinc-900"
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Deixe em branco para não alterar"
          placeholderTextColor="#666"
          secureTextEntry
        />
      </View>
    </>
  );
}
