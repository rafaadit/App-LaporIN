import { Pressable, Text, ActivityIndicator } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
}: ButtonProps) {
  const variants = {
    primary: 'bg-blue-600 active:bg-blue-700',
    secondary: 'bg-gray-900 active:bg-gray-800',
    outline: 'bg-white border border-gray-300 active:bg-gray-50',
  };
  const textVariants = {
    primary: 'text-white',
    secondary: 'text-white',
    outline: 'text-gray-700',
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`rounded-xl py-3.5 items-center justify-center flex-row gap-2 ${variants[variant]} ${disabled || loading ? 'opacity-50' : ''} ${className}`}
    >
      {loading && <ActivityIndicator size="small" color={variant === 'outline' ? '#374151' : 'white'} />}
      <Text className={`font-semibold text-sm ${textVariants[variant]}`}>{title}</Text>
    </Pressable>
  );
}
