import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Logo from '@/components/Logo';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { useAuth } from '@/context/AuthContext';

export default function RegisterScreen() {
  const { register, isAuthenticated } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [pendingNav, setPendingNav] = useState(false);

  useEffect(() => {
    if (pendingNav && isAuthenticated) {
      router.replace('/(tabs)/home');
      setPendingNav(false);
    }
  }, [pendingNav, isAuthenticated]);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) {
      Alert.alert('Error', 'Nama, email, dan password wajib diisi');
      return;
    }
    if (form.password.length < 6) {
      Alert.alert('Error', 'Password minimal 6 karakter');
      return;
    }
    setLoading(true);
    try {
      await register(form);
      setPendingNav(true);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } }; message?: string };
      const msg =
        axiosErr.response?.data?.message ||
        axiosErr.message ||
        'Registrasi gagal. Periksa koneksi ke server.';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-lavender/30">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <ScrollView contentContainerClassName="flex-grow px-6 py-8">
          <Pressable onPress={() => router.back()} className="mb-6">
            <Text className="text-blue-600 text-sm">← Kembali</Text>
          </Pressable>

          <View className="items-center mb-8">
            <Logo size="lg" />
          </View>

          <View className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <Text className="text-xl font-semibold text-gray-800 mb-6">Buat akun baru</Text>

            <Input label="Nama Lengkap" icon="person-outline" value={form.name}
              onChangeText={(v) => setForm({ ...form, name: v })} placeholder="Nama lengkap" />
            <Input label="Email" icon="mail-outline" value={form.email}
              onChangeText={(v) => setForm({ ...form, email: v })} keyboardType="email-address"
              autoCapitalize="none" placeholder="nama@email.com" />
            <Input label="No. Telepon" icon="call-outline" value={form.phone}
              onChangeText={(v) => setForm({ ...form, phone: v })} keyboardType="phone-pad"
              placeholder="08xxxxxxxxxx" />
            <Input label="Password" icon="lock-closed-outline" value={form.password}
              onChangeText={(v) => setForm({ ...form, password: v })} secureTextEntry
              placeholder="Min. 6 karakter" />

            <Button title="Daftar" onPress={handleSubmit} loading={loading} className="mt-2" />

            <Pressable onPress={() => router.push('/login')} className="mt-6">
              <Text className="text-center text-sm text-gray-500">
                Sudah punya akun? <Text className="text-blue-600 font-medium">Masuk</Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
