import { View, Text, Pressable, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import StatusBadge from './StatusBadge';
import { imageUrl } from '@/lib/api';
import type { Report } from '@/lib/types';

export default function ReportCard({ report }: { report: Report }) {
  const thumb = imageUrl(report.thumbnail);

  return (
    <Pressable
      onPress={() => router.push(`/report/${report.id}`)}
      className="bg-white rounded-xl border border-gray-200 p-4 flex-row gap-3 active:opacity-80"
    >
      <View className="w-20 h-20 rounded-lg bg-gray-100 overflow-hidden">
        {thumb ? (
          <Image source={{ uri: thumb }} className="w-full h-full" resizeMode="cover" />
        ) : (
          <View className="w-full h-full items-center justify-center">
            <Ionicons name="location-outline" size={24} color="#d1d5db" />
          </View>
        )}
      </View>

      <View className="flex-1">
        <View className="flex-row items-start justify-between gap-2 mb-1">
          <Text className="font-semibold text-gray-900 text-sm flex-1" numberOfLines={2}>
            {report.title}
          </Text>
          <StatusBadge status={report.status} />
        </View>

        <View className="flex-row flex-wrap gap-2 mt-1">
          <View className="flex-row items-center gap-1">
            <Ionicons name="location-outline" size={12} color="#9ca3af" />
            <Text className="text-xs text-gray-500" numberOfLines={1}>{report.location}</Text>
          </View>
        </View>

        <View className="flex-row items-center gap-3 mt-1">
          <View className="flex-row items-center gap-1">
            <Ionicons name="pricetag-outline" size={12} color="#9ca3af" />
            <Text className="text-xs text-gray-500">{report.category_name}</Text>
          </View>
          <Text className="text-xs text-gray-400">
            {new Date(report.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
          </Text>
        </View>

        <Text className="text-xs text-gray-400 mt-1">Oleh: {report.user_name}</Text>
      </View>
    </Pressable>
  );
}
