import React, { useEffect, useState } from 'react';
import {
  View, ScrollView, Text, StyleSheet,
  TouchableOpacity, StatusBar, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import { ogretmenApi } from '../../services/api';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../../constants/theme';

export default function TeacherHome() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuthStore();
  const ad = user?.adSoyad ?? 'Öğretmen';
  const bugun = new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' });

  const [siniflar, setSiniflar] = useState<any[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    ogretmenApi.siniflarim()
      .then(res => setSiniflar(res.data))
      .catch(() => {})
      .finally(() => setYukleniyor(false));
  }, []);

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={[s.header, { paddingTop: insets.top + 12 }]}>
          <View>
            <Text style={s.merhaba}>Merhaba,</Text>
            <Text style={s.ad}>{ad}</Text>
            <Text style={s.tarih}>{bugun}</Text>
          </View>
          <TouchableOpacity style={s.avatarBtn} onPress={() => router.push('/(teacher)/profile' as any)}>
            <Text style={s.avatarHarf}>{ad.charAt(0)}</Text>
          </TouchableOpacity>
        </View>

        {/* Günlük özet bant */}
        <View style={s.ozetBant}>
          <View style={s.ozetItem}>
            <Text style={s.ozetDeger}>{yukleniyor ? '-' : siniflar.length}</Text>
            <Text style={s.ozetLabel}>Sınıfım</Text>
          </View>
        </View>

        {/* Hızlı erişim */}
        <View style={s.hizliRow}>
          <TouchableOpacity style={s.hizliBtn} onPress={() => router.push('/(teacher)/attendance' as any)}>
            <Text style={{ fontSize: 24 }}>✅</Text>
            <Text style={s.hizliLabel}>Yoklama Al</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.hizliBtn} onPress={() => router.push('/(teacher)/grades' as any)}>
            <Text style={{ fontSize: 24 }}>📝</Text>
            <Text style={s.hizliLabel}>Not Gir</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.hizliBtn} onPress={() => router.push('/(teacher)/classes' as any)}>
            <Text style={{ fontSize: 24 }}>🏫</Text>
            <Text style={s.hizliLabel}>Sınıflarım</Text>
          </TouchableOpacity>
        </View>

        <View style={s.sectionRow}>
          <View style={s.sectionAccent} />
          <Text style={s.sectionTitle}>Sınıflarım</Text>
        </View>

        {yukleniyor ? (
          <ActivityIndicator color={Colors.accent} size="large" style={{ marginTop: 20 }} />
        ) : siniflar.length === 0 ? (
          <View style={s.bosKart}>
            <Text style={s.bosText}>Size atanmış bir sınıf bulunmuyor.</Text>
          </View>
        ) : (
          <View style={s.kart}>
            {siniflar.map((sinif, i) => (
              <React.Fragment key={sinif.id}>
                <View style={s.dersRow}>
                  <Text style={{ fontSize: 20 }}>🏫</Text>
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={s.dersAdi}>{sinif.ad}</Text>
                    <Text style={s.dersSinif}>{sinif.seviye} - {sinif.kapasite} Öğrenci Kapasitesi</Text>
                  </View>
                </View>
                {i < siniflar.length - 1 && <View style={s.divider} />}
              </React.Fragment>
            ))}
          </View>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { paddingBottom: 24 },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xl,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
  },
  merhaba: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.5)', marginBottom: 2 },
  ad: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.white, letterSpacing: -0.5 },
  tarih: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.35)', marginTop: 4, textTransform: 'capitalize' },
  avatarBtn: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: Colors.accent, alignItems: 'center', justifyContent: 'center',
  },
  avatarHarf: { color: Colors.white, fontWeight: '800', fontSize: FontSize.lg },
  
  ozetBant: {
    flexDirection: 'row', backgroundColor: Colors.surface,
    marginHorizontal: Spacing.md, borderRadius: Radius.xl,
    marginTop: -20, ...Shadow.lg, paddingVertical: Spacing.md,
  },
  ozetItem: { flex: 1, alignItems: 'center' },
  ozetDeger: { fontSize: FontSize.base, fontWeight: '800', color: Colors.textPrimary },
  ozetLabel: { fontSize: 10, color: Colors.textMuted, marginTop: 2 },
  
  hizliRow: {
    flexDirection: 'row', gap: Spacing.sm,
    paddingHorizontal: Spacing.md, paddingTop: Spacing.lg,
  },
  hizliBtn: { flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.md, alignItems: 'center', gap: Spacing.xs, ...Shadow.sm },
  hizliLabel: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.textPrimary, textAlign: 'center' },
  
  sectionRow: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: Spacing.md, marginTop: Spacing.lg, marginBottom: Spacing.sm },
  sectionAccent: { width: 4, height: 16, borderRadius: Radius.full, backgroundColor: Colors.accent },
  sectionTitle: { fontSize: FontSize.base, fontWeight: '700', color: Colors.textPrimary },
  
  kart: { backgroundColor: Colors.surface, borderRadius: Radius.xl, marginHorizontal: Spacing.md, ...Shadow.sm },
  dersRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, padding: Spacing.md },
  dersAdi: { fontSize: FontSize.base, fontWeight: '700', color: Colors.textPrimary },
  dersSinif: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  divider: { height: 1, backgroundColor: Colors.border, marginHorizontal: Spacing.md },

  bosKart: {
    marginHorizontal: Spacing.md, backgroundColor: Colors.surface,
    borderRadius: Radius.xl, padding: Spacing.xl, alignItems: 'center',
  },
  bosText: { color: Colors.textMuted, fontSize: FontSize.sm },
});
