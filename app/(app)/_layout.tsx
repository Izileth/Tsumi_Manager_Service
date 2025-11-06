
import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,  
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false, gestureEnabled: true }} />
      <Stack.Screen name="explore" options={{ presentation: 'modal', title: 'Explorar', headerShown: false, gestureEnabled: true }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal', headerShown: false, gestureEnabled: true }} />
      <Stack.Screen name="clan" options={{ title: 'Clã', headerShown: false, gestureEnabled: true }} />
      <Stack.Screen name="market" options={{ title: 'Mercado Negro', headerShown: false, gestureEnabled: true }} />
      <Stack.Screen name="profile" options={{ title: 'Perfil', headerShown: false, gestureEnabled: true }} />
      <Stack.Screen name="missions" options={{ title: 'Missões', headerShown: false, gestureEnabled: true }} />
      <Stack.Screen name="dojo" options={{ title: 'Dojo', headerShown: false, gestureEnabled: true }} />
    </Stack>
  );
}
