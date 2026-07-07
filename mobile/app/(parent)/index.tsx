import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  StatusBar, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import { veliApi } from '../../services/api';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../../constants/theme';

export default function ParentHome() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuthStore();
  const ad = user?.adSoyad?.split(' ')[0] ?? 'Veli';
  const bugun = new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' });

  const [cocuklar, setCocuklar] = useState<any[]>([]);
  const [seciliCocukId, setSeciliCocukId] = useState<number | null>(null);
  const [ozet, setOzet] = useState<any>(null);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    veliApi.cocuklarim()
      .then(res => {
        setCocuklar(res.data);
        if (res.data.length > 0) {
          setSeciliCocukId(res.data[0].id);
        }
      })
      .catch(() => {})
      .finally(() => setYukleniyor(false));
  }, []);

  useEffect(() => {
    if (seciliCocukId) {
      veliApi.ogrenciOzet(seciliCocukId)
        .then(res => setOzet(res.data))
        .catch(() => setOzet(null));
    }
  }, [seciliCocukId]);

  const cocuk = cocuklar.find((c) => c.id === seciliCocukId);

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        <View style={[s.header, { paddingTop: insets.top + 12 }]}>
          <View style={s.headerUst}>
            <View>
              <Text style={s.headerMerhaba}>İyi günler,</Text>
              <Text style={s.headerAd}>{ad}</Text>
            </View>
            <TouchableOpacity style={s.avatarBtn} onPress={() => router.push('/(parent)/profile' as any)}>
              <Text style={s.avatarHarf}>{ad.charAt(0)}</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={s.headerTarih}>{bugun}</Text>

          {cocuklar.length > 1 && (
            <View style={s.cocukSecici}>
              {cocuklar.map((c) => {
                const aktif = c.id === seciliCocukId;
                return (
                  <TouchableOpacity
                    key={c.id}
                    style={[s.cocukBtn, aktif && s.cocukBtnAktif]}
                    onPress={() => setSeciliCocukId(c.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={[s.cocukBtnText, aktif && s.cocukBtnTextAktif]}>{c.adSoyad.split(' ')[0]}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        {yukleniyor ? (
          <ActivityIndicator color={Colors.accent} size="large" style={{ marginTop: 60 }} />
        ) : !cocuk ? (
           <View style={s.bosKart}>
             <Text style={{ fontSize: 40 }}>📭</Text>
             <Text style={s.bosBaslik}>Öğrenci Bulunamadı</Text>
             <Text style={s.bosText}>Sisteme kayıtlı öğrenciniz bulunmamaktadır.</Text>
           </View>
        ) : (
          <>
            <View style={s.ozetBant}>
              <View style={s.ozetItem}>
                <Text style={s.ozetDeger}>{cocuk.sinif?.ad ?? '-'}</Text>
                <Text style={s.ozetLabel}>Sınıf</Text>
              </View>
              <View style={s.ozetDivider} />
              <View style={s.ozetItem}>
                <Text style={[s.ozetDeger, { color: Colors.danger }]}>{ozet?.gelmedi ?? '-'}</Text>
                <Text style={s.ozetLabel}>Devamsızlık</Text>
              </View>
              <View style={s.ozetDivider} />
              <View style={s.ozetItem}>
                <Text style={[s.ozetDeger, { color: Colors.accent }]}>{ozet?.notOrtalama ?? '-'}</Text>
                <Text style={s.ozetLabel}>Başarı Ort.</Text>
              </View>
            </View>

            <View style={s.hizliRow}>
              <TouchableOpacity style={s.hizliBtn} onPress={() => router.push('/(parent)/grades' as any)}>
                <Text style={{ fontSize: 24 }}>📊</Text>
                <Text style={s.hizliLabel}>Notlar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.hizliBtn} onPress={() => router.push('/(parent)/attendance' as any)}>
                <Text style={{ fontSize: 24 }}>📅</Text>
                <Text style={s.hizliLabel}>Devam</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.hizliBtn} onPress={() => router.push('/(parent)/finance' as any)}>
                <Text style={{ fontSize: 24 }}>💳</Text>
                <Text style={s.hizliLabel}>Ödemeler</Text>
              </TouchableOpacity>
            </View>

            <View style={s.sectionRow}>
              <View style={s.sectionAccent} />
              <Text style={s.sectionTitle}>Bugün / Program</Text>
            </View>
            
            <View style={s.bosKartSmall}>
               <Text style={{ fontSize: 32 }}>🚧</Text>
               <Text style={s.bosTextSmall}>Program yakında eklenecek</Text>
            </View>
          </>
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
  },
  headerUst: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerMerhaba: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.5)', marginBottom: 2 },
  headerAd: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.white, letterSpacing: -0.5 },
  headerTarih: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.35)', marginTop: 8, textTransform: 'capitalize' },
  avatarBtn: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: Colors.accent, alignItems: 'center', justifyContent: 'center',
  },
  avatarHarf: { color: Colors.white, fontWeight: '800', fontSize: FontSize.lg },
  
  cocukSecici: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: Radius.full, padding: 4, marginTop: Spacing.lg, alignSelf: 'flex-start' },
  cocukBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: Radius.full },
  cocukBtnAktif: { backgroundColor: Colors.accent },
  cocukBtnText: { fontSize: FontSize.sm, fontWeight: '700', color: 'rgba(255,255,255,0.7)' },
  cocukBtnTextAktif: { color: Colors.white },

  ozetBant: {
    flexDirection: 'row', backgroundColor: Colors.surface,
    marginHorizontal: Spacing.md, borderRadius: Radius.xl,
    marginTop: -20, ...Shadow.lg, paddingVertical: Spacing.md,
  },
  ozetItem: { flex: 1, alignItems: 'center' },
  ozetDeger: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.textPrimary },
  ozetLabel: { fontSize: 10, color: Colors.textMuted, marginTop: 2 },
  ozetDivider: { width: 1, backgroundColor: Colors.border },

  hizliRow: {
    flexDirection: 'row', gap: Spacing.sm,
    paddingHorizontal: Spacing.md, paddingTop: Spacing.lg,
  },
  hizliBtn: { flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.sm, alignItems: 'center', gap: 4, ...Shadow.sm },
  hizliLabel: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.textPrimary, textAlign: 'center' },

  sectionRow: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: Spacing.md, marginTop: Spacing.lg, marginBottom: Spacing.sm },
  sectionAccent: { width: 4, height: 16, borderRadius: Radius.full, backgroundColor: Colors.accent },
  sectionTitle: { fontSize: FontSize.base, fontWeight: '700', color: Colors.textPrimary, flex: 1 },

  bosKart: {
    alignItems: 'center', backgroundColor: Colors.surface,
    borderRadius: Radius.xl, padding: Spacing.xl * 2, margin: Spacing.md,
    gap: Spacing.sm, ...Shadow.sm,
  },
  bosBaslik: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.textPrimary },
  bosText: { fontSize: FontSize.sm, color: Colors.textMuted, textAlign: 'center' },

  bosKartSmall: {
    alignItems: 'center', backgroundColor: Colors.surface,
    borderRadius: Radius.xl, padding: Spacing.lg, marginHorizontal: Spacing.md,
    gap: 8, ...Shadow.sm,
  },
  bosTextSmall: { fontSize: FontSize.sm, color: Colors.textMuted, fontWeight: '600' },
});
