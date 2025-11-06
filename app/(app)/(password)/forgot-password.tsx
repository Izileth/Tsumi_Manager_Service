import { View, Text, TextInput, Pressable } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Mail } from "lucide-react-native";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const handleSendLink = () => {
    setErrorMessage(""); // Clear previous errors

    if (!email) {
      setErrorMessage("Por favor, insira seu email.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Por favor, insira um email válido.");
      return;
    }

    // If validation passes, proceed with sending reset link logic
    console.log("Sending reset link to:", email);
    // Here you would typically call an API to send the reset link
  };

  return (
    <View className="flex-1 bg-black">
      {/* Gradient Effects */}
      <View className="absolute -top-24 -right-24 w-72 h-72 bg-red-600 opacity-10 rounded-full" />
      <View className="absolute -bottom-36 -left-36 w-96 h-96 bg-orange-900 opacity-5 rounded-full" />
      
      <View className="flex-1 justify-center items-center px-8">
        {/* Logo */}
        <View className="items-center mb-12">
          <View className="w-20 h-20 rounded-full bg-transparent border-2 border-red-600 justify-center items-center mb-4 shadow-lg shadow-red-600/50">
            <Text className="text-4xl text-red-600 font-bold">罪</Text>
          </View>
          <Text className="text-5xl font-bold text-white tracking-widest mb-1">TSUMI</Text>
          <Text className="text-sm text-neutral-400 tracking-widest mb-4">Yakuza Brotherhood</Text>
          <View className="w-16 h-0.5 bg-red-600 mt-2" />
        </View>

        <View className="w-full max-w-md">
          <Text className="text-white text-2xl font-bold text-center mb-2">Esqueceu a senha?</Text>
          <Text className="text-neutral-400 text-center mb-8">Digite seu e-mail para receber um link de redefinição.</Text>

          {/* Email */}
          <View className="flex-row items-center w-full h-14 bg-neutral-950 rounded-xl px-4 mb-4 border border-neutral-900">
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

          {errorMessage ? (
            <Text className="text-red-500 text-sm text-center mb-4">{errorMessage}</Text>
          ) : null}

          {/* Send Link Button */}
          <Pressable 
            onPress={handleSendLink}
            className="w-full h-14 bg-red-600 rounded-xl justify-center items-center active:bg-red-700 shadow-lg shadow-red-600/40 mt-6"
          >
            <Text className="text-lg font-bold text-white tracking-wide">Enviar link de redefinição</Text>
          </Pressable>

          {/* Divider */}
          <View className="flex-row items-center my-8">
            <View className="flex-1 h-px bg-neutral-900" />
            <Text className="text-neutral-600 px-4 text-xs font-semibold">OU</Text>
            <View className="flex-1 h-px bg-neutral-900" />
          </View>

          {/* Back to Login */}
          <View className="flex-row justify-center items-center">
            <Pressable onPress={() => router.push('/(app)/(auth)/login')}>
              <Text className="text-red-600 text-sm font-semibold">Voltar para o Login</Text>
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
