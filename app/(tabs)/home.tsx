import { useCallback, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import HeroChatbotCard from '@/components/HeroChatbotCard';
import ReportCard from '@/components/ReportCard';
import { useAuth } from '@/context/AuthContext';
import { reportsAPI } from '@/lib/api';
import { setChatbotDraft } from '@/lib/chatbotDraft';
import type { Report, ChatFormData } from '@/lib/types';

export default function HomeScreen() {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = useCallback(async () => {
    try {
      const { data } = await reportsAPI.getAll({ limit: 3 });
      setReports(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { fetchReports(); }, [fetchReports]));

  const handleFormReady = (formData: ChatFormData) => {
    setChatbotDraft(formData);
    router.push('/create');
  };

  const quickActions = [
    { href: '/create' as const, label: 'Buat Laporan', desc: 'Foto & kirim pengaduan baru', icon: 'add-circle' as const, color: 'bg-blue-600' },
    { href: '/reports' as const, label: 'Lihat Laporan', desc: 'Pantau status laporanmu', icon: 'document-text' as const, color: 'bg-indigo-600' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <ScrollView className="flex-1" contentContainerClassName="px-5 pb-8">
        <View className="pt-4 pb-6 items-center">
          <Text className="text-2xl font-bold text-gray-900">
            Halo, {user?.name?.split(' ')[0] || 'Warga'} 👋
          </Text>
          <Text className="text-gray-500 mt-1">Ada yang ingin dilaporkan hari ini?</Text>
        </View>

        <HeroChatbotCard onFormReady={handleFormReady} />
        <Text className="text-center text-xs text-gray-400 mt-3 mb-8">
          Ceritakan masalahnya ke AI, form laporan akan terisi otomatis
        </Text>

        <View className="gap-3 mb-8">
          {quickActions.map((action) => (
            <Pressable
              key={action.label}
              onPress={() => router.push(action.href)}
              className="bg-white rounded-xl border border-gray-200 p-4 flex-row items-center gap-4 active:opacity-80"
            >
              <View className={`w-11 h-11 ${action.color} rounded-2xl items-center justify-center`}>
                <Ionicons name={action.icon} size={20} color="white" />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-gray-900 text-sm">{action.label}</Text>
                <Text className="text-xs text-gray-500 mt-0.5">{action.desc}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#d1d5db" />
            </Pressable>
          ))}
        </View>

        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center gap-2">
            <Ionicons name="time-outline" size={16} color="#9ca3af" />
            <Text className="text-base font-semibold text-gray-800">Laporan Terbaru</Text>
          </View>
          <Pressable onPress={() => router.push('/reports')}>
            <Text className="text-sm text-blue-600">Lihat semua →</Text>
          </Pressable>
        </View>

        {loading ? (
          <ActivityIndicator color="#2563eb" className="my-8" />
        ) : reports.length === 0 ? (
          <View className="bg-white rounded-xl border border-gray-200 p-8 items-center">
            <Ionicons name="document-text-outline" size={40} color="#d1d5db" />
            <Text className="text-gray-500 text-sm mt-3">Belum ada laporan</Text>
            <Pressable onPress={() => router.push('/create')} className="mt-4 bg-blue-600 px-5 py-2.5 rounded-xl">
              <Text className="text-white text-sm font-medium">Buat Laporan Pertama</Text>
            </Pressable>
          </View>
        ) : (
          <View className="gap-3">
            {reports.map((r) => <ReportCard key={r.id} report={r} />)}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
