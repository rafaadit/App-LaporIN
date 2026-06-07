import { useCallback, useState } from 'react';
import {
  View, Text, ScrollView, Image, TextInput, Pressable, Alert, ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import StatusBadge from '@/components/StatusBadge';
import { reportsAPI, commentsAPI, imageUrl } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import type { Report } from '@/lib/types';

export default function ReportDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  const fetchReport = useCallback(async () => {
    try {
      const { data } = await reportsAPI.getOne(id!);
      setReport(data.data);
    } catch {
      Alert.alert('Error', 'Laporan tidak ditemukan');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(useCallback(() => { fetchReport(); }, [fetchReport]));

  const handleComment = async () => {
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      await commentsAPI.create({ report_id: Number(id), content: comment });
      setComment('');
      fetchReport();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Gagal';
      Alert.alert('Error', msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = () => {
    Alert.alert('Hapus Laporan', 'Yakin ingin menghapus laporan ini?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus', style: 'destructive',
        onPress: async () => {
          try {
            await reportsAPI.remove(id!);
            Alert.alert('Berhasil', 'Laporan dihapus');
          } catch {
            Alert.alert('Error', 'Gagal menghapus');
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!report) return null;

  const images = report.images || [];
  const mainImage = images[activeImg] ? imageUrl(images[activeImg].image_url) : imageUrl(report.thumbnail);
  const isOwner = user?.id === report.user_id;

  return (
    <ScrollView className="flex-1 bg-gray-50" contentContainerClassName="pb-10">
      {/* Image gallery */}
      {mainImage && (
        <Image source={{ uri: mainImage }} className="w-full h-56" resizeMode="cover" />
      )}
      {images.length > 1 && (
        <ScrollView horizontal className="px-4 py-3 bg-white" showsHorizontalScrollIndicator={false}>
          {images.map((img, i) => {
            const uri = imageUrl(img.image_url);
            return uri ? (
              <Pressable key={img.id} onPress={() => setActiveImg(i)}
                className={`mr-2 rounded-lg overflow-hidden border-2 ${activeImg === i ? 'border-blue-500' : 'border-transparent'}`}>
                <Image source={{ uri }} className="w-16 h-16" resizeMode="cover" />
              </Pressable>
            ) : null;
          })}
        </ScrollView>
      )}

      <View className="px-5 pt-5">
        <View className="flex-row items-start justify-between gap-3 mb-3">
          <Text className="text-xl font-bold text-gray-900 flex-1">{report.title}</Text>
          <StatusBadge status={report.status} />
        </View>

        <View className="bg-white rounded-xl border border-gray-200 p-4 mb-4 gap-2">
          <View className="flex-row items-center gap-2">
            <Ionicons name="location-outline" size={14} color="#9ca3af" />
            <Text className="text-sm text-gray-600 flex-1">{report.location}</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Ionicons name="pricetag-outline" size={14} color="#9ca3af" />
            <Text className="text-sm text-gray-600">{report.category_name}</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Ionicons name="person-outline" size={14} color="#9ca3af" />
            <Text className="text-sm text-gray-600">{report.user_name}</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Ionicons name="calendar-outline" size={14} color="#9ca3af" />
            <Text className="text-sm text-gray-600">
              {new Date(report.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </Text>
          </View>
        </View>

        <View className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
          <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Deskripsi</Text>
          <Text className="text-sm text-gray-700 leading-6">{report.description}</Text>
        </View>

        {report.admin_note && (
          <View className="bg-blue-50 rounded-xl border border-blue-100 p-4 mb-4">
            <Text className="text-xs font-semibold text-blue-700 mb-1">Catatan Admin</Text>
            <Text className="text-sm text-blue-800">{report.admin_note}</Text>
          </View>
        )}

        {isOwner && (
          <Pressable onPress={handleDelete} className="flex-row items-center gap-2 mb-6 px-1">
            <Ionicons name="trash-outline" size={16} color="#dc2626" />
            <Text className="text-red-600 text-sm font-medium">Hapus laporan</Text>
          </Pressable>
        )}

        {/* Comments */}
        <Text className="text-base font-semibold text-gray-800 mb-3">
          Komentar ({report.comments?.length || 0})
        </Text>

        {(report.comments || []).map((c) => (
          <View key={c.id} className="bg-white rounded-xl border border-gray-200 p-4 mb-2">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-sm font-medium text-gray-800">{c.user_name}</Text>
              <Text className="text-xs text-gray-400">
                {new Date(c.created_at).toLocaleDateString('id-ID')}
              </Text>
            </View>
            <Text className="text-sm text-gray-600">{c.content}</Text>
          </View>
        ))}

        {user && (
          <View className="mt-4 flex-row gap-2">
            <TextInput
              className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 bg-white"
              placeholder="Tulis komentar..."
              value={comment}
              onChangeText={setComment}
              multiline
            />
            <Pressable
              onPress={handleComment}
              disabled={submitting || !comment.trim()}
              className="w-11 h-11 bg-blue-600 rounded-xl items-center justify-center disabled:opacity-40"
            >
              {submitting
                ? <ActivityIndicator size="small" color="white" />
                : <Ionicons name="send" size={16} color="white" />
              }
            </Pressable>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
