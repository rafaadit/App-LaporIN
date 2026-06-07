import { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TextInput, Pressable, Image, Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import Button from '@/components/Button';
import { reportsAPI, categoriesAPI, aiAPI } from '@/lib/api';
import { consumeChatbotDraft } from '@/lib/chatbotDraft';
import type { Category } from '@/lib/types';
import { router } from 'expo-router';

interface ImageAsset {
  uri: string;
  name: string;
  type: string;
}

export default function CreateReportScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [categorizing, setCategorizing] = useState(false);
  const [images, setImages] = useState<ImageAsset[]>([]);
  const [form, setForm] = useState({
    title: '', description: '', location: '',
    latitude: '', longitude: '', category_id: '',
  });

  useEffect(() => {
    categoriesAPI.getAll().then(({ data }) => setCategories(data.data));

    const draft = consumeChatbotDraft();
    if (draft) {
      setForm((f) => ({
        ...f,
        title: draft.title || f.title,
        description: draft.description || f.description,
        location: draft.location || f.location,
        category_id: draft.category_id ? String(draft.category_id) : f.category_id,
      }));
    }
  }, []);

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 5 - images.length,
    });
    if (!result.canceled) {
      const newImages = result.assets.map((a, i) => ({
        uri: a.uri,
        name: `photo_${Date.now()}_${i}.jpg`,
        type: 'image/jpeg',
      }));
      if (images.length + newImages.length > 5) {
        Alert.alert('Error', 'Maksimal 5 gambar');
        return;
      }
      setImages([...images, ...newImages]);
    }
  };

  const removeImage = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Izin ditolak', 'Aktifkan izin lokasi untuk fitur ini');
      return;
    }
    const loc = await Location.getCurrentPositionAsync({});
    setForm((f) => ({
      ...f,
      latitude: String(loc.coords.latitude),
      longitude: String(loc.coords.longitude),
    }));
    Alert.alert('Berhasil', 'Koordinat GPS berhasil diambil');
  };

  const handleAutoCategorize = async () => {
    if (!form.title && !form.description) {
      Alert.alert('Error', 'Isi judul atau deskripsi dulu');
      return;
    }
    setCategorizing(true);
    try {
      const { data } = await aiAPI.categorize({ title: form.title, description: form.description });
      setForm((f) => ({ ...f, category_id: String(data.data.category_id) }));
      Alert.alert('Kategori', `${data.data.category_name}\n${data.data.reason}`);
    } catch {
      Alert.alert('Error', 'Auto-kategorisasi gagal');
    } finally {
      setCategorizing(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.location || !form.category_id) {
      Alert.alert('Error', 'Lengkapi semua field wajib');
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v); });
      images.forEach((img) => {
        fd.append('images', { uri: img.uri, name: img.name, type: img.type } as unknown as Blob);
      });
      await reportsAPI.create(fd);
      Alert.alert('Berhasil', 'Laporan berhasil dikirim!', [
        { text: 'OK', onPress: () => router.push('/reports') },
      ]);
      setForm({ title: '', description: '', location: '', latitude: '', longitude: '', category_id: '' });
      setImages([]);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Gagal mengirim';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <ScrollView className="flex-1" contentContainerClassName="px-5 pb-10">
        <View className="pt-4 pb-6">
          <Text className="text-2xl font-bold text-gray-900">Buat Laporan</Text>
          <Text className="text-gray-500 text-sm mt-0.5">Laporkan kerusakan fasilitas umum</Text>
        </View>

        <View className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 flex-row gap-3">
          <Ionicons name="sparkles" size={20} color="#3b82f6" />
          <View className="flex-1">
            <Text className="text-sm font-medium text-blue-800">Butuh bantuan?</Text>
            <Text className="text-xs text-blue-600 mt-0.5">Gunakan chatbot di Beranda untuk mengisi form otomatis</Text>
          </View>
        </View>

        {/* Info */}
        <View className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
          <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Informasi Laporan</Text>

          <Text className="text-sm font-medium text-gray-700 mb-1.5">Judul Laporan *</Text>
          <TextInput
            className="border border-gray-300 rounded-xl px-3 py-3 text-sm text-gray-900 mb-4"
            placeholder="Contoh: Jalan berlubang depan SDN 01"
            value={form.title}
            onChangeText={(v) => setForm({ ...form, title: v })}
          />

          <View className="flex-row items-center justify-between mb-1.5">
            <Text className="text-sm font-medium text-gray-700">Kategori *</Text>
            <Pressable onPress={handleAutoCategorize} disabled={categorizing} className="flex-row items-center gap-1">
              {categorizing
                ? <ActivityIndicator size="small" color="#2563eb" />
                : <Ionicons name="color-wand" size={14} color="#2563eb" />
              }
              <Text className="text-xs text-blue-600 font-medium">
                {categorizing ? 'Menganalisis...' : 'Auto-kategorisasi AI'}
              </Text>
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4" style={{ flexGrow: 0 }}>
            {categories.map((c) => (
              <Pressable
                key={c.id}
                onPress={() => setForm({ ...form, category_id: String(c.id) })}
                className={`mr-2 px-4 py-2 rounded-full border ${
                  form.category_id === String(c.id) ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-200'
                }`}
              >
                <Text className={`text-xs font-medium ${
                  form.category_id === String(c.id) ? 'text-white' : 'text-gray-600'
                }`}>
                  {c.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          <Text className="text-sm font-medium text-gray-700 mb-1.5">Deskripsi *</Text>
          <TextInput
            className="border border-gray-300 rounded-xl px-3 py-3 text-sm text-gray-900 mb-1 min-h-[100px]"
            placeholder="Jelaskan kondisi kerusakan secara detail..."
            value={form.description}
            onChangeText={(v) => setForm({ ...form, description: v })}
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* Lokasi */}
        <View className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
          <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Lokasi</Text>

          <Text className="text-sm font-medium text-gray-700 mb-1.5">Alamat Lengkap *</Text>
          <TextInput
            className="border border-gray-300 rounded-xl px-3 py-3 text-sm text-gray-900 mb-4"
            placeholder="Jl. Contoh No. 1, Kelurahan, Kota"
            value={form.location}
            onChangeText={(v) => setForm({ ...form, location: v })}
          />

          <Pressable onPress={getLocation} className="flex-row items-center gap-2 mb-4 bg-blue-50 rounded-xl p-3">
            <Ionicons name="navigate" size={18} color="#2563eb" />
            <Text className="text-sm text-blue-600 font-medium">Ambil koordinat GPS</Text>
          </Pressable>

          {(form.latitude || form.longitude) && (
            <Text className="text-xs text-gray-500">
              Lat: {form.latitude} · Lng: {form.longitude}
            </Text>
          )}
        </View>

        {/* Foto */}
        <View className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Foto Bukti</Text>

          {images.length === 0 ? (
            <Pressable onPress={pickImages}
              className="border-2 border-dashed border-gray-200 rounded-xl p-8 items-center active:bg-blue-50">
              <Ionicons name="cloud-upload-outline" size={32} color="#d1d5db" />
              <Text className="text-sm font-medium text-gray-600 mt-2">Tap untuk upload foto</Text>
              <Text className="text-xs text-gray-400 mt-1">Maks. 5 foto</Text>
            </Pressable>
          ) : (
            <View>
              <View className="flex-row flex-wrap gap-2 mb-3">
                {images.map((img, i) => (
                  <View key={i} className="relative w-24 h-24 rounded-lg overflow-hidden">
                    <Image source={{ uri: img.uri }} className="w-full h-full" resizeMode="cover" />
                    <Pressable onPress={() => removeImage(i)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full items-center justify-center">
                      <Ionicons name="close" size={12} color="white" />
                    </Pressable>
                  </View>
                ))}
                {images.length < 5 && (
                  <Pressable onPress={pickImages}
                    className="w-24 h-24 border-2 border-dashed border-gray-200 rounded-lg items-center justify-center">
                    <Ionicons name="add" size={24} color="#d1d5db" />
                  </Pressable>
                )}
              </View>
              <Text className="text-xs text-gray-400">{images.length}/5 foto dipilih</Text>
            </View>
          )}
        </View>

        <Button title={loading ? 'Mengirim...' : 'Kirim Laporan'} onPress={handleSubmit} loading={loading} />
      </ScrollView>
    </SafeAreaView>
  );
}
