import { View, Text, TextInput, Pressable } from "react-native";
import { useState } from "react";
import { Link } from "expo-router";
import { Lock, Eye, EyeOff } from "lucide-react-native";

export default function ResetPasswordScreen() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const handleResetPassword = () => {
    setErrorMessage(""); // Clear previous errors

    if (!password || !confirmPassword) {
      setErrorMessage("Por favor, preencha todos os campos.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("As senhas não coincidem.");
      return;
    }

    // If validation passes, proceed with reset password logic
    console.log("Resetting password...");
    // Here you would typically call an API to reset the password
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
          <Text className="text-white text-2xl font-bold text-center mb-2">Redefinir senha</Text>
          <Text className="text-neutral-400 text-center mb-8">Crie uma nova senha para sua conta.</Text>

          {/* Password */}
          <View className="flex-row items-center w-full h-14 bg-neutral-950 rounded-xl px-4 mb-4 border border-neutral-900">
            <Lock size={20} color="#666666" strokeWidth={2} />
            <TextInput
              placeholder="Nova Senha"
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
          <View className="flex-row items-center w-full h-14 bg-neutral-950 rounded-xl px-4 mb-4 border border-neutral-900">
            <Lock size={20} color="#666666" strokeWidth={2} />
            <TextInput
              placeholder="Confirmar Nova Senha"
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

          {/* Reset Password Button */}
          <Pressable 
            onPress={handleResetPassword}
            className="w-full h-14 bg-red-600 rounded-xl justify-center items-center active:bg-red-700 shadow-lg shadow-red-600/40 mt-6"
          >
            <Text className="text-lg font-bold text-white tracking-wide">Redefinir senha</Text>
          </Pressable>

          {/* Divider */}
          <View className="flex-row items-center my-8">
            <View className="flex-1 h-px bg-neutral-900" />
          </View>

          {/* Back to Login */}
          <View className="flex-row justify-center items-center">
            <Link href="/login" asChild>
              <Pressable>
                <Text className="text-red-600 text-sm font-semibold">Voltar para o Login</Text>
              </Pressable>
            </Link>
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
