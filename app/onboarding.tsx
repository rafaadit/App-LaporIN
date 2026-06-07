import { useRef, useState } from 'react';
import { View, Text, Animated } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Button from '@/components/Button';

const pages = [
  {
    icon: 'megaphone' as const,
    title: 'Lapor Kerusakan',
    desc: 'Foto dan laporkan kerusakan fasilitas umum di sekitarmu dalam hitungan menit.',
    color: '#2563eb',
    bg: '#eff6ff',
    ornament: 'blue',
  },
  {
    icon: 'eye' as const,
    title: 'Pantau Real-time',
    desc: 'Ikuti perkembangan laporanmu secara langsung. Transparan dan terpercaya.',
    color: '#7c3aed',
    bg: '#f5f3ff',
    ornament: 'purple',
  },
  {
    icon: 'notifications' as const,
    title: 'Dapatkan Notifikasi',
    desc: 'Terima update saat laporanmu dibaca, diproses, dan ditindaklanjuti.',
    color: '#059669',
    bg: '#ecfdf5',
    ornament: 'green',
  },
];

const ornamentColors: Record<string, string[]> = {
  blue: ['#dbeafe', '#bfdbfe', '#93c5fd'],
  purple: ['#ede9fe', '#ddd6fe', '#c4b5fd'],
  green: ['#d1fae5', '#a7f3d0', '#6ee7b7'],
};

export default function OnboardingScreen() {
  const [page, setPage] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const p = pages[page];
  const colors = ornamentColors[p.ornament];

  const animateTo = (toPage: number) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setPage(toPage);
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  const goNext = () => {
    if (page < pages.length - 1) {
      animateTo(page + 1);
    } else {
      router.replace('/login' as any);
    }
  };

  return (
    <View className="flex-1" style={{ backgroundColor: p.bg }}>
      <SafeAreaView className="flex-1">
        {/* Ornaments */}
        <View className="absolute top-0 right-0">
          <View className="w-40 h-40 rounded-full" style={{ backgroundColor: colors[0], transform: [{ translateX: 40 }, { translateY: -40 }] }} />
          <View className="w-24 h-24 rounded-full" style={{ backgroundColor: colors[1], transform: [{ translateX: -20 }, { translateY: -60 }] }} />
        </View>
        <View className="absolute bottom-0 left-0">
          <View className="w-52 h-52 rounded-full" style={{ backgroundColor: colors[0], transform: [{ translateX: -80 }, { translateY: 60 }] }} />
          <View className="w-20 h-20 rounded-full" style={{ backgroundColor: colors[2], transform: [{ translateX: 100 }, { translateY: -120 }] }} />
        </View>
        <View className="absolute top-1/3 -left-8 w-16 h-16 rounded-full" style={{ backgroundColor: colors[1] }} />

        {/* Floating decorative dots */}
        <View className="absolute top-32 right-12 flex-row gap-1">
          <View className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors[2] }} />
          <View className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors[2], marginTop: -8 }} />
          <View className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors[2], marginTop: 4 }} />
        </View>
        <View className="absolute bottom-40 left-8 flex-row gap-1">
          <View className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors[2] }} />
          <View className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors[2], marginTop: 6 }} />
          <View className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors[2], marginTop: -4 }} />
        </View>

        {/* Content */}
        <View className="flex-1 px-8 justify-center z-10">
          <Animated.View key={page} style={{ opacity: fadeAnim }} className="items-center">
            {/* Icon with glow */}
            <View className="relative mb-10">
              <View
                className="w-28 h-28 rounded-[32px] items-center justify-center shadow-xl"
                style={{
                  backgroundColor: p.color,
                  shadowColor: p.color,
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.3,
                  shadowRadius: 16,
                  elevation: 12,
                }}
              >
                <Ionicons name={p.icon} size={52} color="white" />
              </View>
            </View>

            {/* Tag */}
            <View
              className="px-4 py-1.5 rounded-full mb-5"
              style={{ backgroundColor: p.color + '15' }}
            >
              <Text style={{ color: p.color }} className="text-xs font-semibold tracking-wider uppercase">
                Fitur {p.ornament === 'blue' ? '01' : p.ornament === 'purple' ? '02' : '03'}
              </Text>
            </View>

            <Text className="text-3xl font-bold text-gray-900 text-center mb-3">
              {p.title}
            </Text>
            <Text className="text-gray-500 text-center leading-6 text-base px-2">
              {p.desc}
            </Text>
          </Animated.View>
        </View>

        {/* Bottom section */}
        <View className="px-8 pb-8 z-10">
          {/* Dots */}
          <View className="flex-row justify-center gap-2 mb-8">
            {pages.map((_, i) => (
              <View
                key={i}
                className="h-2.5 rounded-full transition-all duration-300"
                style={{
                  width: i === page ? 28 : 8,
                  backgroundColor: i === page ? p.color : '#d1d5db',
                }}
              />
            ))}
          </View>

          <Button
            title={page === pages.length - 1 ? 'Mulai ke Aplikasi' : 'Selanjutnya'}
            onPress={goNext}
          />
          {page < pages.length - 1 && (
            <Text
              onPress={() => router.replace('/login' as any)}
              className="text-center text-gray-400 text-sm mt-4"
            >
              Lewati
            </Text>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}
