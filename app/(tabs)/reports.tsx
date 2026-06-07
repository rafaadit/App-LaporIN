import { useCallback, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ReportCard from '@/components/ReportCard';
import { reportsAPI } from '@/lib/api';
import type { Report } from '@/lib/types';

const STATUS_OPTIONS = [
  { value: '', label: 'Semua' },
  { value: 'pending', label: 'Menunggu' },
  { value: 'approved', label: 'Disetujui' },
  { value: 'in_progress', label: 'Diproses' },
  { value: 'resolved', label: 'Selesai' },
  { value: 'rejected', label: 'Ditolak' },
];

export default function ReportsScreen() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page, limit: 10 };
      if (status) params.status = status;
      const { data } = await reportsAPI.getAll(params);
      setReports(data.data);
      setTotalPages(data.pagination.totalPages);
      setTotal(data.pagination.total);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [status, page]);

  useFocusEffect(useCallback(() => { fetchReports(); }, [fetchReports]));

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <View className="px-5 pt-4 pb-3">
        <Text className="text-2xl font-bold text-gray-900">Semua Laporan</Text>
        <Text className="text-gray-500 text-sm mt-0.5">{total} laporan ditemukan</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-5 mb-4" style={{ flexGrow: 0 }}>
        {STATUS_OPTIONS.map((s) => (
          <Pressable
            key={s.value}
            onPress={() => { setStatus(s.value); setPage(1); }}
            className={`mr-2 px-4 py-2 rounded-full ${status === s.value ? 'bg-blue-600' : 'bg-white border border-gray-200'}`}
          >
            <Text className={`text-xs font-medium ${status === s.value ? 'text-white' : 'text-gray-600'}`}>
              {s.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView className="flex-1 px-5" contentContainerClassName="pb-8">
        {loading ? (
          <ActivityIndicator color="#2563eb" className="my-12" />
        ) : reports.length === 0 ? (
          <View className="bg-white rounded-xl border border-gray-200 p-12 items-center mt-4">
            <Ionicons name="document-text-outline" size={48} color="#d1d5db" />
            <Text className="text-gray-500 font-medium mt-3">Tidak ada laporan</Text>
            <Text className="text-gray-400 text-sm mt-1">Coba ubah filter</Text>
          </View>
        ) : (
          <View className="gap-3">
            {reports.map((r) => <ReportCard key={r.id} report={r} />)}
          </View>
        )}

        {totalPages > 1 && (
          <View className="flex-row items-center justify-center gap-4 mt-8">
            <Pressable
              onPress={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg disabled:opacity-40"
            >
              <Text className="text-sm text-gray-600">← Prev</Text>
            </Pressable>
            <Text className="text-sm text-gray-600">Halaman {page} / {totalPages}</Text>
            <Pressable
              onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg disabled:opacity-40"
            >
              <Text className="text-sm text-gray-600">Next →</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
