import React, { useEffect, useState } from 'react';
import {
  View, ScrollView, Text, StyleSheet,
  TouchableOpacity, StatusBar, Alert, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import { ogrenciApi } from '../../services/api';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../../constants/theme';

const hizliMenuler = [
  { label: 'Ders Programı', emoji: '📅', renk: '#3B82F6', route: '/(student)/schedule' },
  { label: 'Notlarım',      emoji: '📊', renk: '#8B5CF6', route: '/(student)/grades' },
  { label: 'Devamsızlık',   emoji: '✅', renk: '#F59E0B', route: '/(student)/attendance' },
  { label: 'Ödevlerim',     emoji: '📚', renk: Colors.accent, route: '/(student)/homework' },
];

export default function StudentHome() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuthStore();
  const ad = user?.adSoyad?.split(' ')[0] ?? 'Öğrenci';
  const bugun = new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' });

  const [ozet, setOzet] = useState<any>(null);
  const [notlar, setNotlar] = useState<any[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    const yukle = async () => {
      try {
        const [ozetRes, notRes] = await Promise.all([
          ogrenciApi.ozet(),
          ogrenciApi.notlarim(),
        ]);
        setOzet(ozetRes.data);
        setNotlar((notRes.data as any[]).slice(0, 5));
      } catch (e) {
        // Sessizce devam
      } finally {
        setYukleniyor(false);
      }
    };
    yukle();
  }, []);

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={[s.header, { paddingTop: insets.top + 12 }]}>
          <View>
            <Text style={s.headerMerhaba}>Merhaba,</Text>
            <Text style={s.headerAd}>{ad}</Text>
            <Text style={s.headerTarih}>{bugun}</Text>
          </View>
          <TouchableOpacity style={s.avatarBtn} onPress={() => router.push('/(student)/profile' as any)}>
            <Text style={s.avatarHarf}>{ad.charAt(0)}</Text>
          </TouchableOpacity>
        </View>

        {/* Özet Bant */}
        <View style={s.devamBant}>
          <View style={s.devamItem}>
            <Text style={[s.devamDeger, { color: Colors.success }]}>
              {yukleniyor ? '-' : `${ozet?.toplamYoklama ?? 0}`}
            </Text>
            <Text style={s.devamLabel}>Toplam Yoklama</Text>
          </View>
          <View style={s.devamDivider} />
          <View style={s.devamItem}>
            <Text style={[s.devamDeger, { color: Colors.accent }]}>
              {yukleniyor ? '-' : `${ozet?.notOrtalama ?? 0}`}
            </Text>
            <Text style={s.devamLabel}>Not Ort.</Text>
          </View>
          <View style={s.devamDivider} />
          <View style={s.devamItem}>
            <Text style={[s.devamDeger, { color: '#F59E0B' }]}>
              {yukleniyor ? '-' : `${ozet?.gelmedi ?? 0}`}
            </Text>
            <Text style={s.devamLabel}>Devamsızlık</Text>
          </View>
          <View style={s.devamDivider} />
          <View style={s.devamItem}>
            <Text style={[s.devamDeger, { color: '#8B5CF6' }]}>
              {yukleniyor ? '-' : `${ozet?.toplamSinav ?? 0}`}
            </Text>
            <Text style={s.devamLabel}>Sınav</Text>
          </View>
        </View>

        {/* Hızlı menü */}
        <View style={s.hizliGrid}>
          {hizliMenuler.map((m, i) => (
            <TouchableOpacity
              key={i}
              style={s.hizliKart}
              activeOpacity={0.8}
              onPress={() => router.push(m.route as any)}
            >
              <Text style={s.hizliEmoji}>{m.emoji}</Text>
              <Text style={s.hizliLabel}>{m.label}</Text>
              <Text style={{ color: Colors.textMuted, marginTop: 'auto' as any }}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Son Notlar */}
        <View style={s.sectionRow}>
          <View style={s.sectionAccent} />
          <Text style={s.sectionTitle}>Son Notlar</Text>
        </View>

        {yukleniyor ? (
          <ActivityIndicator color={Colors.accent} style={{ marginTop: 16 }} />
        ) : notlar.length === 0 ? (
          <View style={s.bosKart}>
            <Text style={s.bosText}>Henüz not girişi yapılmamış.</Text>
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.notScrollContent}>
            {notlar.map((n: any, i: number) => {
              const renk = n.puan >= 85 ? Colors.success : n.puan >= 65 ? '#F59E0B' : Colors.danger;
              return (
                <View key={i} style={s.notKart}>
                  <Text style={s.notDersEmoji}>📚</Text>
                  <Text style={s.notDers}>{n.ders}</Text>
                  <Text style={s.notSinav}>{n.sinavAdi}</Text>
                  <Text style={[s.notPuan, { color: renk }]}>{n.puan}</Text>
                  <Text style={s.notTarih}>{n.tarih}</Text>
                </View>
              );
            })}
          </ScrollView>
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
  headerMerhaba: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.5)', marginBottom: 2 },
  headerAd: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.white, letterSpacing: -0.5 },
  headerTarih: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.35)', marginTop: 4, textTransform: 'capitalize' },
  avatarBtn: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: Colors.accent, alignItems: 'center', justifyContent: 'center',
  },
  avatarHarf: { color: Colors.white, fontWeight: '800', fontSize: FontSize.lg },

  devamBant: {
    flexDirection: 'row', backgroundColor: Colors.surface,
    marginHorizontal: Spacing.md, borderRadius: Radius.xl,
    marginTop: -20, ...Shadow.lg, paddingVertical: Spacing.md,
  },
  devamItem: { flex: 1, alignItems: 'center' },
  devamDeger: { fontSize: FontSize.base, fontWeight: '800', color: Colors.textPrimary },
  devamLabel: { fontSize: 10, color: Colors.textMuted, marginTop: 2, textAlign: 'center' },
  devamDivider: { width: 1, backgroundColor: Colors.border },

  hizliGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm,
    paddingHorizontal: Spacing.md, paddingTop: Spacing.lg,
  },
  hizliKart: {
    width: '47.5%', backgroundColor: Colors.surface, borderRadius: Radius.xl,
    padding: Spacing.md, ...Shadow.sm, gap: Spacing.xs,
  },
  hizliEmoji: { fontSize: 24, marginBottom: 4 },
  hizliLabel: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textPrimary },

  sectionRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: Spacing.md, marginTop: Spacing.lg, marginBottom: Spacing.sm,
  },
  sectionAccent: { width: 4, height: 16, borderRadius: Radius.full, backgroundColor: Colors.accent },
  sectionTitle: { fontSize: FontSize.base, fontWeight: '700', color: Colors.textPrimary },

  notScrollContent: { paddingHorizontal: Spacing.md, gap: Spacing.sm },
  notKart: {
    width: 140, backgroundColor: Colors.surface, borderRadius: Radius.xl,
    padding: Spacing.md, ...Shadow.sm, gap: 4,
  },
  notDersEmoji: { fontSize: 20, marginBottom: 4 },
  notDers: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.textPrimary },
  notSinav: { fontSize: FontSize.xs, color: Colors.textSecondary },
  notPuan: { fontSize: 28, fontWeight: '900', letterSpacing: -1, marginTop: 4 },
  notTarih: { fontSize: 10, color: Colors.textMuted },

  bosKart: {
    marginHorizontal: Spacing.md, backgroundColor: Colors.surface,
    borderRadius: Radius.xl, padding: Spacing.xl, alignItems: 'center',
  },
  bosText: { color: Colors.textMuted, fontSize: FontSize.sm },
});
