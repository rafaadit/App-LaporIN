import { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function SplashScreen() {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 6, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(dot1, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(dot2, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(dot3, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(dot1, { toValue: 0, duration: 400, useNativeDriver: true }),
        Animated.timing(dot2, { toValue: 0, duration: 400, useNativeDriver: true }),
        Animated.timing(dot3, { toValue: 0, duration: 400, useNativeDriver: true }),
      ])
    ).start();

    const timer = setTimeout(() => {
      router.replace('/onboarding' as any);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      {/* Decorative circles */}
      <View className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-blue-50" />
      <View className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-purple-50" />

      <Animated.View style={{ opacity, transform: [{ scale }] }} className="items-center">
        <View className="w-20 h-20 bg-blue-600 rounded-2xl items-center justify-center mb-4 shadow-lg shadow-blue-200">
          <Ionicons name="location" size={40} color="white" />
        </View>
        <Text className="text-3xl font-bold text-gray-900">LaporIn</Text>
        <Text className="text-gray-500 mt-2">Pengaduan Fasilitas Umum</Text>
      </Animated.View>

      {/* Loading dots */}
      <View className="absolute bottom-24 flex-row gap-2">
        {[dot1, dot2, dot3].map((dot, i) => (
          <Animated.View
            key={i}
            className="w-2 h-2 rounded-full bg-blue-600"
            style={{ opacity: dot }}
          />
        ))}
      </View>
    </View>
  );
}
