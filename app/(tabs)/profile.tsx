import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <View className="px-5 pt-4">
        <Text className="text-2xl font-bold text-gray-900 mb-6">Profil</Text>

        <View className="bg-white rounded-2xl border border-gray-200 p-6 items-center mb-6">
          <View className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center mb-4">
            <Text className="text-3xl font-bold text-blue-700">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </Text>
          </View>
          <Text className="text-xl font-bold text-gray-900">{user?.name}</Text>
          <Text className="text-gray-500 text-sm mt-1">{user?.email}</Text>
          <View className="mt-3 bg-blue-50 px-3 py-1 rounded-full">
            <Text className="text-xs font-medium text-blue-700 capitalize">
              {user?.role?.replace('_', ' ')}
            </Text>
          </View>
        </View>

        <Pressable
          onPress={handleLogout}
          className="bg-white rounded-xl border border-red-100 p-4 flex-row items-center gap-3 active:bg-red-50"
        >
          <Ionicons name="log-out-outline" size={20} color="#dc2626" />
          <Text className="text-red-600 font-medium">Keluar</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
