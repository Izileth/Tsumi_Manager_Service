import { View, Text, TextInput, Pressable, Image } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { User, Lock, Eye, EyeOff, Mail } from "lucide-react-native";
import { Video, ResizeMode } from 'expo-av';
import { supabase } from "../../lib/supabase";
import { CustomButton } from "../../../components/ui/custom-button";
import Toast from "react-native-toast-message";

export default function RegisterScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async () => {
    setErrorMessage("");

    if (!username || !email || !password || !confirmPassword) {
      setErrorMessage("Por favor, preencha todos os campos.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Por favor, insira um email válido.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            username: username,
          },
        },
      });

      if (error) {
        throw error;
      }

      Toast.show({
        type: "success",
        text1: "Cadastro realizado com sucesso!",
        text2: "Por favor, verifique seu e-mail para confirmar sua conta antes de fazer o login.",
        position: "top",
        visibilityTime: 3000,
      });

    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Ocorreu um erro desconhecido durante o cadastro.");
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
      
      {/* Overlay escuro */}
      <View className="absolute inset-0 bg-black/70" />

      <View className="flex-1 justify-center items-center px-8">
        {/* Logo */}
        <View className="items-center mb-12">
          <View className="w-20 h-20 rounded-full bg-transparent border-2 border-red-600 justify-center items-center mb-4 shadow-lg shadow-red-600/50">
            <Image
              source={require("../../../assets/images/notification_icon.png")}
              className="w-16 h-16"
              resizeMode="contain"
            />
          </View>
          <Text className="text-5xl font-bold text-white tracking-widest mb-1">TSUMI</Text>
          <Text className="text-sm text-neutral-400 tracking-widest mb-4">Yakuza Brotherhood</Text>
          <View className="w-16 h-0.5 bg-red-600 mt-2" />
        </View>

        {/* Form */}
        <View className="w-full max-w-md">
          {/* Username */}
          <View className="flex-row items-center w-full h-14 bg-neutral-950/80 backdrop-blur rounded-xl px-4 mb-4 border border-neutral-900">
            <User size={20} color="#666666" strokeWidth={2} />
            <TextInput
              placeholder="Nome de usuário"
              placeholderTextColor="#666"
              value={username}
              onChangeText={(text) => { setUsername(text); setErrorMessage(""); }}
              className="flex-1 text-white text-base ml-3"
              autoCapitalize="none"
            />
          </View>

          {/* Email */}
          <View className="flex-row items-center w-full h-14 bg-neutral-950/80 backdrop-blur rounded-xl px-4 mb-4 border border-neutral-900">
            <Mail size={20} color="#666666" strokeWidth={2} />
            <TextInput
              placeholder="Email"
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

          {/* Confirm Password */}
          <View className="flex-row items-center w-full h-14 bg-neutral-950/80 backdrop-blur rounded-xl px-4 mb-4 border border-neutral-900">
            <Lock size={20} color="#666666" strokeWidth={2} />
            <TextInput
              placeholder="Confirmar Senha"
              placeholderTextColor="#666"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={(text) => { setConfirmPassword(text); setErrorMessage(""); }}
              className="flex-1 text-white text-base ml-3"
            />
            <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)} className="p-1">
              {showConfirmPassword ? (
                <Eye size={20} color="#666666" strokeWidth={2} />
              ) : (
                <EyeOff size={20} color="#666666" strokeWidth={2} />
              )}
            </Pressable>
          </View>

          {errorMessage ? (
            <Text className="text-red-500 text-sm text-center mb-4">{errorMessage}</Text>
          ) : null}

          {/* Register Button */}
          <CustomButton
            title="Cadastrar"
            onPress={handleRegister}
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

          {/* Sign In */}
          <View className="flex-row justify-center items-center">
            <Text className="text-neutral-400 text-sm">Já tem uma conta? </Text>
            <Pressable onPress={() => router.push('/(app)/(auth)/login')}>
              <Text className="text-red-600 text-sm font-semibold">Entre</Text>
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