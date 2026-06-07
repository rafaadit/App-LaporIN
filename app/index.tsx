import { View, Text, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import HeroChatbotCard from '@/components/HeroChatbotCard';
import Button from '@/components/Button';

const features = [
  { icon: 'camera' as const, title: 'Lapor Cepat', desc: 'Foto kerusakan & kirim dalam hitungan menit' },
  { icon: 'eye' as const, title: 'Pantau Status', desc: 'Ikuti perkembangan laporan secara real-time' },
  { icon: 'notifications' as const, title: 'Notifikasi', desc: 'Dapatkan update saat laporan ditangani' },
];

export default function LandingScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" contentContainerClassName="pb-10">
        {/* Hero */}
        <View className="px-6 pt-8 pb-6 items-center">
          <View className="flex-row items-center gap-2 bg-lavender/60 border border-gray-100 rounded-full px-4 py-1.5 mb-6">
            <Ionicons name="flash" size={14} color="#3b82f6" />
            <Text className="text-sm text-gray-600">Platform Pengaduan Fasilitas Umum</Text>
          </View>

          <Text className="text-4xl font-bold text-gray-900 text-center leading-tight">
            Suara warga,{'\n'}
            <Text className="text-blue-600">kota lebih baik</Text>
          </Text>
          <Text className="text-gray-500 text-center mt-4 leading-6 px-2">
            Laporkan kerusakan jalan, lampu, drainase, dan fasilitas umum lainnya.
          </Text>

          <View className="flex-row gap-3 mt-8 w-full">
            <View className="flex-1">
              <Button title="Daftar Gratis" onPress={() => router.push('/register')} variant="secondary" />
            </View>
            <View className="flex-1">
              <Button title="Masuk" onPress={() => router.push('/login')} variant="outline" />
            </View>
          </View>
        </View>

        {/* Chatbot preview */}
        <View className="px-6 mt-4">
          <HeroChatbotCard />
          <Text className="text-center text-xs text-gray-400 mt-3">
            Coba chat dengan AI — masuk dulu untuk mulai melaporkan
          </Text>
        </View>

        {/* Features */}
        <View className="px-6 mt-10">
          <Text className="text-xl font-bold text-gray-900 mb-4">Kenapa LaporIn?</Text>
          <View className="gap-3">
            {features.map((f) => (
              <View key={f.title} className="bg-lavender/40 rounded-2xl p-4 flex-row items-center gap-4">
                <View className="w-11 h-11 bg-blue-600 rounded-2xl items-center justify-center">
                  <Ionicons name={f.icon} size={20} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-900 text-sm">{f.title}</Text>
                  <Text className="text-xs text-gray-500 mt-0.5">{f.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* CTA */}
        <View className="mx-6 mt-10 bg-navy rounded-3xl p-8 items-center">
          <Text className="text-xl font-bold text-white text-center">Siap melaporkan?</Text>
          <Text className="text-gray-400 text-sm text-center mt-2 mb-6">
            Bergabung dan jadilah bagian dari perubahan positif di kotamu.
          </Text>
          <Button title="Mulai Sekarang" onPress={() => router.push('/register')} className="w-full" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
