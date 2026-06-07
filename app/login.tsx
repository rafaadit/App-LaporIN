import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Logo from '@/components/Logo';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingNav, setPendingNav] = useState(false);

  // Navigate only after auth state is confirmed in React tree
  useEffect(() => {
    if (pendingNav && isAuthenticated) {
      router.replace('/(tabs)/home');
      setPendingNav(false);
    }
  }, [pendingNav, isAuthenticated]);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email dan password wajib diisi');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      setPendingNav(true);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } }; message?: string };
      const msg =
        axiosErr.response?.data?.message ||
        axiosErr.message ||
        'Login gagal. Periksa koneksi ke server.';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-lavender/30">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <ScrollView contentContainerClassName="flex-grow justify-center px-6 py-8">
          <Pressable onPress={() => router.replace('/onboarding')} className="mb-6">
            <Text className="text-blue-600 text-sm">← Kembali</Text>
          </Pressable>

          <View className="items-center mb-8">
            <Logo size="lg" />
          </View>

          <View className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <Text className="text-xl font-semibold text-gray-800 mb-6">Masuk ke akun</Text>

            <Input label="Email" icon="mail-outline" value={email} onChangeText={setEmail}
              keyboardType="email-address" autoCapitalize="none" placeholder="nama@email.com" />
            <Input label="Password" icon="lock-closed-outline" value={password} onChangeText={setPassword}
              secureTextEntry placeholder="••••••••" />

            <Button title="Masuk" onPress={handleSubmit} loading={loading} className="mt-2" />

            <Pressable onPress={() => router.push('/register')} className="mt-6">
              <Text className="text-center text-sm text-gray-500">
                Belum punya akun? <Text className="text-blue-600 font-medium">Daftar sekarang</Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
