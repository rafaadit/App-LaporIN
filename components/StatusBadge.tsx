import { Text, View } from 'react-native';

const config: Record<string, { label: string; bg: string; text: string }> = {
  pending:     { label: 'Menunggu',  bg: 'bg-yellow-100', text: 'text-yellow-700' },
  approved:    { label: 'Disetujui', bg: 'bg-blue-100',   text: 'text-blue-700' },
  rejected:    { label: 'Ditolak',   bg: 'bg-red-100',    text: 'text-red-700' },
  in_progress: { label: 'Diproses',  bg: 'bg-purple-100', text: 'text-purple-700' },
  resolved:    { label: 'Selesai',   bg: 'bg-green-100',  text: 'text-green-700' },
};

export default function StatusBadge({ status }: { status: string }) {
  const s = config[status] || { label: status, bg: 'bg-gray-100', text: 'text-gray-700' };
  return (
    <View className={`${s.bg} px-2.5 py-1 rounded-full`}>
      <Text className={`text-xs font-semibold ${s.text}`}>{s.label}</Text>
    </View>
  );
}
