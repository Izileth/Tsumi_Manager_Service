import { View, Text, TextInput, Pressable } from "react-native";
import { useState } from "react";
import { useAuth } from "./auth-context";

export default function LoginScreen() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (username && password) {
      login();
    } else {
      // Optionally, add some user feedback here, e.g., an alert
      console.log("Please enter both username and password.");
    }
  };

  return (
    <View className="flex-1 bg-black">
      {/* Gradient Effects */}
      <View className="absolute -top-24 -right-24 w-72 h-72 bg-red-600 opacity-10 rounded-full" />
      <View className="absolute -bottom-36 -left-36 w-96 h-96 bg-orange-900 opacity-5 rounded-full" />
      
      <View className="flex-1 justify-center items-center px-8">
        {/* Logo */}
        <View className="items-center mb-12">
          <View className="w-20 h-20 rounded-full bg-neutral-900 border-2 border-red-600 justify-center items-center mb-4 shadow-lg shadow-red-600/50">
            <Text className="text-4xl text-red-600 font-bold">組</Text>
          </View>
          <Text className="text-5xl font-bold text-white tracking-widest mb-1">KUMI</Text>
          <Text className="text-sm text-neutral-400 tracking-widest mb-4">Yakuza Brotherhood</Text>
          <View className="w-16 h-0.5 bg-red-600 mt-2" />
        </View>

        {/* Form */}
        <View className="w-full max-w-md">
          {/* Username */}
          <View className="flex-row items-center w-full h-14 bg-neutral-950 rounded-xl px-4 mb-4 border border-neutral-900">
            <Text className="text-xl mr-3">👤</Text>
            <TextInput
              placeholder="Nome de usuário"
              placeholderTextColor="#666"
              value={username}
              onChangeText={setUsername}
              className="flex-1 text-white text-base"
              autoCapitalize="none"
            />
          </View>

          {/* Password */}
          <View className="flex-row items-center w-full h-14 bg-neutral-950 rounded-xl px-4 mb-4 border border-neutral-900">
            <Text className="text-xl mr-3">🔒</Text>
            <TextInput
              placeholder="Senha"
              placeholderTextColor="#666"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              className="flex-1 text-white text-base"
            />
            <Pressable onPress={() => setShowPassword(!showPassword)} className="p-1">
              <Text className="text-lg">{showPassword ? '👁️' : '🙈'}</Text>
            </Pressable>
          </View>

          {/* Forgot Password */}
          <Pressable className="self-end mb-6">
            <Text className="text-neutral-400 text-sm">Esqueceu a senha?</Text>
          </Pressable>

          {/* Login Button */}
          <Pressable 
            onPress={handleLogin}
            className="w-full h-14 bg-red-600 rounded-xl justify-center items-center active:bg-red-700 shadow-lg shadow-red-600/40"
          >
            <Text className="text-lg font-bold text-white tracking-wide">Entrar</Text>
          </Pressable>

          {/* Divider */}
          <View className="flex-row items-center my-8">
            <View className="flex-1 h-px bg-neutral-900" />
            <Text className="text-neutral-600 px-4 text-xs font-semibold">OU</Text>
            <View className="flex-1 h-px bg-neutral-900" />
          </View>

          {/* Sign Up */}
          <View className="flex-row justify-center items-center">
            <Text className="text-neutral-400 text-sm">Não tem uma conta? </Text>
            <Pressable>
              <Text className="text-red-600 text-sm font-semibold">Cadastre-se</Text>
            </Pressable>
          </View>
        </View>

        {/* Footer */}
        <Text className="absolute bottom-8 text-neutral-700 text-xs italic">
          Protegido pela honra do clã
        </Text>
      </View>
    </View>
  );
}