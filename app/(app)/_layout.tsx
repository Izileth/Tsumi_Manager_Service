import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { registerForPushNotificationsAsync } from '../lib/notifications';
import { supabase } from '../lib/supabase';

export default function AppLayout() {
  useEffect(() => {
    const setupNotifications = async () => {
      const token = await registerForPushNotificationsAsync();
      if (token) {
        console.log('Push token:', token);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { error } = await supabase
            .from('profiles')
            .update({ push_token: token })
            .eq('id', user.id);
          if (error) {
            console.error('Error saving push token:', error);
          } else {
            console.log('Push token saved for user:', user.id);
          }
        }
      }
    };

    setupNotifications();
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false, gestureEnabled: true }} />
      <Stack.Screen name="(screens)/explore" options={{ presentation: 'modal', title: 'Explorar', headerShown: false, gestureEnabled: true }} />
      <Stack.Screen name="(screens)/clan" options={{ title: 'Clã', headerShown: false, gestureEnabled: true }} />
      <Stack.Screen name="(screens)/market" options={{ title: 'Mercado Negro', headerShown: false, gestureEnabled: true }} />
      <Stack.Screen name="(screens)/profile" options={{ title: 'Perfil', headerShown: false, gestureEnabled: true }} />
      <Stack.Screen name="(screens)/missions" options={{ title: 'Missões', headerShown: false, gestureEnabled: true }} />
      <Stack.Screen name="(screens)/dojo" options={{ title: 'Dojo', headerShown: false, gestureEnabled: true }} />
      
      <Stack.Screen name="/(auth)/login" options={{ title: 'Login', headerShown: false, gestureEnabled: true }} />
      <Stack.Screen name="/(auth)/register" options={{ title: 'Registro', headerShown: false, gestureEnabled: true }} />
      <Stack.Screen name="/(password)/forgot-password" options={{ title: 'Esqueci minha senha', headerShown: false, gestureEnabled: true }} />
      <Stack.Screen name="/(password)/reset-password" options={{ title: 'Redefinir senha', headerShown: false, gestureEnabled: true }} />
    </Stack>
  );
}
