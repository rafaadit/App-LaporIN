import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const sizes = {
  sm: { box: 'w-8 h-8', icon: 16, text: 'text-lg' },
  md: { box: 'w-12 h-12', icon: 24, text: 'text-2xl' },
  lg: { box: 'w-16 h-16', icon: 32, text: 'text-3xl' },
};

export default function Logo({ size = 'md', showText = true }: LogoProps) {
  const s = sizes[size];
  return (
    <View className="items-center">
      <View className={`${s.box} bg-blue-600 rounded-2xl items-center justify-center mb-2`}>
        <Ionicons name="location" size={s.icon} color="white" />
      </View>
      {showText && (
        <>
          <Text className={`${s.text} font-bold text-gray-900`}>LaporIn</Text>
          <Text className="text-gray-500 text-sm mt-0.5">Pengaduan Fasilitas Umum</Text>
        </>
      )}
    </View>
  );
}
