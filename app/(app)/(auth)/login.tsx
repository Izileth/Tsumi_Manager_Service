import { useState } from "react";
import { View, Text, TextInput, Pressable, Image } from "react-native";
import { useRouter } from "expo-router";
import { Eye, EyeOff, Lock, User } from "lucide-react-native";
import { Video, ResizeMode } from 'expo-av';
import { useAuth } from "../../context/auth-context";
import { CustomButton } from "../../../components/ui/custom-button";

export default function LoginScreen() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    setErrorMessage("");
    if (!email || !password) {
      setErrorMessage("Por favor, preencha todos os campos.");
      return;
    }
    setLoading(true);
    try {
      await signIn(email, password);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Ocorreu um erro desconhecido durante o login.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-black">
      {/* Video Background */}
      <Video
        source={require('@/assets/videos/background.mp4')} // Ajuste o caminho
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
        }}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
        isMuted
        rate={1.0}
      />
      
      {/* Overlay escuro para melhorar legibilidade */}
      <View className="absolute inset-0 bg-black/70" />
      
      <View className="flex-1 justify-center items-center px-8">
        {/* Logo */}
        <View className="items-center mb-12">
            <Image
              source={require("../../../assets/images/notification_icon.png")}
              className="w-24 h-24"
              resizeMode="contain"
            />
          <Text className="text-5xl font-bold text-white tracking-widest mb-1">TSUMI</Text>
          <Text className="text-sm text-neutral-400 tracking-widest mb-4">Yakuza Brotherhood</Text>
          <View className="w-16 h-0.5 bg-red-600 mt-2" />
        </View>

        {/* Form */}
        <View className="w-full max-w-md">
          {/* Email */}
          <View className="flex-row items-center w-full h-14 bg-neutral-950/80 backdrop-blur rounded-xl px-4 mb-4 border border-neutral-900">
            <User size={20} color="#666666" strokeWidth={2} />
            <TextInput
              placeholder="E-mail"
              placeholderTextColor="#666"
              value={email}
              onChangeText={(text) => { setEmail(text); setErrorMessage(""); }}
              className="flex-1 text-white text-base ml-3"
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {/* Password */}
          <View className="flex-row items-center w-full h-14 bg-neutral-950/80 backdrop-blur rounded-xl px-4 mb-4 border border-neutral-900">
            <Lock size={20} color="#666666" strokeWidth={2} />
            <TextInput
              placeholder="Senha"
              placeholderTextColor="#666"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={(text) => { setPassword(text); setErrorMessage(""); }}
              className="flex-1 text-white text-base ml-3"
            />
            <Pressable onPress={() => setShowPassword(!showPassword)} className="p-1">
              {showPassword ? (
                <Eye size={20} color="#666666" strokeWidth={2} />
              ) : (
                <EyeOff size={20} color="#666666" strokeWidth={2} />
              )}
            </Pressable>
          </View>

          {errorMessage ? (
            <Text className="text-red-500 text-sm text-center mb-4">{errorMessage}</Text>
          ) : null}

          {/* Forgot Password */}
          <Pressable className="self-end mb-6" onPress={() => router.push('/(app)/(password)/forgot-password')}>
            <Text className="text-neutral-400 text-sm">Esqueceu a senha?</Text>
          </Pressable>

          {/* Login Button */}
          <CustomButton 
            title="Entrar"
            onPress={handleLogin}
            isLoading={loading}
            className="h-14 bg-red-600 rounded-xl active:bg-red-700 shadow-lg shadow-red-600/40 w-full"
            textClassName="text-lg font-bold text-white tracking-wide"
          />

          {/* Divider */}
          <View className="flex-row items-center my-8">
            <View className="flex-1 h-px bg-neutral-900" />
            <Text className="text-neutral-600 px-4 text-xs font-semibold">OU</Text>
            <View className="flex-1 h-px bg-neutral-900" />
          </View>

          {/* Sign Up */}
          <View className="flex-row justify-center items-center">
            <Text className="text-neutral-400 text-sm">Não tem uma conta? </Text>
            <Pressable onPress={() => router.push('/register')}>
              <Text className="text-red-600 text-sm font-semibold underline">Cadastre-se</Text>
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