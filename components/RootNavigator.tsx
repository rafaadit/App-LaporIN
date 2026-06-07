import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '@/context/AuthContext';

export default function RootNavigator() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // Only redirect logged-in users away from public screens
  useEffect(() => {
    if (isLoading || !user) return;

    const onLogin = segments[0] === 'login';
    const onRegister = segments[0] === 'register';
    const onLanding = !segments[0];

    if (onLogin || onRegister || onLanding) {
      router.replace('/(tabs)/home');
    }
  }, [user, isLoading, segments, router]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="report/[id]"
          options={{ headerShown: true, title: 'Detail Laporan', headerBackTitle: 'Kembali' }}
        />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
