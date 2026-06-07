import { View, Text, TextInput, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InputProps extends TextInputProps {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  error?: string;
}

export default function Input({ label, icon, error, className, ...props }: InputProps) {
  return (
    <View className="mb-4">
      <Text className="text-sm font-medium text-gray-700 mb-1.5">{label}</Text>
      <View className="relative">
        {icon && (
          <View className="absolute left-3 top-3 z-10">
            <Ionicons name={icon} size={16} color="#9ca3af" />
          </View>
        )}
        <TextInput
          placeholderTextColor="#9ca3af"
          className={`border border-gray-300 rounded-xl px-3 py-3 text-sm text-gray-900 bg-white ${icon ? 'pl-9' : ''} ${className || ''}`}
          {...props}
        />
      </View>
      {error && <Text className="text-xs text-red-500 mt-1">{error}</Text>}
    </View>
  );
}
