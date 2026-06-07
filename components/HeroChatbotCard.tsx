import { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { aiAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import type { ChatFormData } from '@/lib/types';

const WELCOME = 'Halo! 👋 Saya asisten LaporIn. Ceritakan kerusakan fasilitas umum yang ingin kamu laporkan, saya bantu isi formnya.';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Props {
  onFormReady?: (data: ChatFormData) => void;
}

export default function HeroChatbotCard({ onFormReady }: Props) {
  const { isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<Message[]>([{ role: 'assistant', content: WELCOME }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [formReady, setFormReady] = useState<ChatFormData | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages, loading]);

  const redirectToLogin = () => router.push('/login');

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    if (!isAuthenticated) {
      redirectToLogin();
      return;
    }

    const userMsg: Message = { role: 'user', content: input.trim() };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    try {
      const { data } = await aiAPI.chat(newHistory.map((m) => ({ role: m.role, content: m.content })));
      const { message, form_data } = data.data;
      setMessages((prev) => [...prev, { role: 'assistant', content: message }]);
      if (form_data) setFormReady(form_data as ChatFormData);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Maaf, terjadi kesalahan. Coba lagi ya! 🙏' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="relative">
      <View className="absolute -top-4 -right-4 w-16 h-16 bg-blue-500 rounded-2xl rotate-12 opacity-70" />
      <View className="absolute -bottom-2 -left-2 w-12 h-12 bg-indigo-400 rounded-xl -rotate-12 opacity-50" />

      <View className="bg-white rounded-3xl border border-gray-100 shadow-lg overflow-hidden">
        <View className="flex-row items-center gap-3 px-5 pt-5 pb-3">
          <View className="w-11 h-11 bg-blue-600 rounded-2xl items-center justify-center">
            <Ionicons name="sparkles" size={22} color="white" />
          </View>
          <View>
            <Text className="text-sm font-semibold text-gray-900">Asisten LaporIn</Text>
            <Text className="text-xs text-blue-600">
              AI · {isAuthenticated ? 'Online' : 'Masuk untuk chat'}
            </Text>
          </View>
        </View>

        <ScrollView
          ref={scrollRef}
          className="mx-3 mb-3 bg-gray-50 rounded-2xl px-3 py-3"
          style={{ height: 200 }}
          nestedScrollEnabled
        >
          {messages.map((m, i) => (
            <View key={i} className={`flex-row gap-2 mb-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <View className={`w-6 h-6 rounded-full items-center justify-center ${
                m.role === 'user' ? 'bg-blue-600' : 'bg-white border border-gray-200'
              }`}>
                <Ionicons
                  name={m.role === 'user' ? 'person' : 'chatbubble-ellipses'}
                  size={12}
                  color={m.role === 'user' ? 'white' : '#2563eb'}
                />
              </View>
              <View className={`max-w-[80%] rounded-2xl px-3 py-2 ${
                m.role === 'user' ? 'bg-blue-600' : 'bg-white border border-gray-100'
              }`}>
                <Text className={`text-xs leading-5 ${m.role === 'user' ? 'text-white' : 'text-gray-700'}`}>
                  {m.content}
                </Text>
              </View>
            </View>
          ))}
          {loading && <ActivityIndicator size="small" color="#2563eb" className="my-2" />}
        </ScrollView>

        {formReady && onFormReady && (
          <Pressable
            onPress={() => onFormReady(formReady)}
            className="mx-4 mb-3 bg-green-50 border border-green-200 rounded-xl p-3 flex-row items-center gap-3 active:opacity-80"
          >
            <Ionicons name="checkmark-circle" size={20} color="#16a34a" />
            <View className="flex-1">
              <Text className="text-xs font-semibold text-green-800">Form siap diisi!</Text>
              <Text className="text-xs text-green-600">Tap untuk lanjut buat laporan</Text>
            </View>
            <Ionicons name="arrow-forward" size={16} color="#16a34a" />
          </Pressable>
        )}

        <View className="px-4 pb-5">
          {!isAuthenticated ? (
            <Pressable
              onPress={redirectToLogin}
              className="flex-row items-center gap-2 border border-gray-200 rounded-2xl px-4 py-3 active:bg-blue-50"
            >
              <Text className="flex-1 text-sm text-gray-400">Ketik laporanmu di sini...</Text>
              <View className="w-9 h-9 bg-blue-600 rounded-xl items-center justify-center">
                <Ionicons name="send" size={16} color="white" />
              </View>
            </Pressable>
          ) : (
            <View className="flex-row gap-2">
              <TextInput
                value={input}
                onChangeText={setInput}
                onSubmitEditing={sendMessage}
                placeholder="Ketik laporanmu di sini..."
                placeholderTextColor="#9ca3af"
                className="flex-1 border border-gray-200 rounded-2xl px-4 py-2.5 text-sm text-gray-900"
                returnKeyType="send"
              />
              <Pressable
                onPress={sendMessage}
                disabled={!input.trim() || loading}
                className="w-10 h-10 bg-blue-600 rounded-xl items-center justify-center disabled:opacity-40"
              >
                <Ionicons name="send" size={16} color="white" />
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
