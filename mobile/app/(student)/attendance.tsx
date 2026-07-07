import React, { useEffect, useState } from 'react';
import {
  SafeAreaView, ScrollView, View, Text, StyleSheet,
  StatusBar, ActivityIndicator,
} from 'react-native';
import { ogrenciApi } from '../../services/api';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../../constants/theme';

const DURUM_CONFIG: Record<string, { label: string; renk: string; emoji: string }> = {
  GELDI:   { label: 'Geldi',    renk: Colors.success, emoji: '✅' },
  GELMEDI: { label: 'Gelmedi',  renk: Colors.danger,  emoji: '❌' },
  GEC:     { label: 'Geç Kaldı', renk: '#F59E0B',     emoji: '⏰' },
};

export default function AttendanceScreen() {
  const [yoklamalar, setYoklamalar] = useState<any[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    ogrenciApi.yoklamalarim()
      .then(r => setYoklamalar(r.data as any[]))
      .catch(() => {})
      .finally(() => setYukleniyor(false));
  }, []);

  const toplamGeldi  = yoklamalar.filter(y => y.durum === 'GELDI').length;
  const toplamGelmedi = yoklamalar.filter(y => y.durum === 'GELMEDI').length;
  const toplamGec    = yoklamalar.filter(y => y.durum === 'GEC').length;
  const devamYuzdesi = yoklamalar.length > 0
    ? Math.round((toplamGeldi / yoklamalar.length) * 100) : 100;

  return (
    <SafeAreaView style={s.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <View style={s.header}>
        <Text style={s.headerTitle}>✅ Devamsızlık</Text>
        <Text style={s.headerSub}>Yoklama kayıtlarınız</Text>
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Özet */}
        <View style={s.ozetKart}>
          <View style={s.ozetItem}>
            <Text style={[s.ozetDeger, { color: Colors.success }]}>{toplamGeldi}</Text>
            <Text style={s.ozetLabel}>Geldi</Text>
          </View>
          <View style={s.ozetDivider} />
          <View style={s.ozetItem}>
            <Text style={[s.ozetDeger, { color: Colors.danger }]}>{toplamGelmedi}</Text>
            <Text style={s.ozetLabel}>Gelmedi</Text>
          </View>
          <View style={s.ozetDivider} />
          <View style={s.ozetItem}>
            <Text style={[s.ozetDeger, { color: '#F59E0B' }]}>{toplamGec}</Text>
            <Text style={s.ozetLabel}>Geç Kaldı</Text>
          </View>
          <View style={s.ozetDivider} />
          <View style={s.ozetItem}>
            <Text style={[s.ozetDeger, { color: devamYuzdesi >= 90 ? Colors.success : Colors.danger }]}>
              %{devamYuzdesi}
            </Text>
            <Text style={s.ozetLabel}>Devam</Text>
          </View>
        </View>

        {/* Liste */}
        {yukleniyor ? (
          <ActivityIndicator color={Colors.accent} size="large" style={{ marginTop: 60 }} />
        ) : yoklamalar.length === 0 ? (
          <View style={s.bosKart}>
            <Text style={{ fontSize: 40 }}>📭</Text>
            <Text style={s.bosBaslik}>Kayıt Yok</Text>
            <Text style={s.bosText}>Henüz yoklama kaydı bulunmuyor.</Text>
          </View>
        ) : (
          <View style={s.liste}>
            {yoklamalar.map((y: any, i: number) => {
              const cfg = DURUM_CONFIG[y.durum] ?? DURUM_CONFIG['GELDI'];
              return (
                <React.Fragment key={i}>
                  {i > 0 && <View style={s.divider} />}
                  <View style={s.satir}>
                    <View style={[s.durumIkon, { backgroundColor: `${cfg.renk}18` }]}>
                      <Text style={{ fontSize: 18 }}>{cfg.emoji}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={s.dersAdi}>{y.ders}</Text>
                      <Text style={s.tarih}>📅 {y.tarih}</Text>
                    </View>
                    <View style={[s.badge, { backgroundColor: `${cfg.renk}18` }]}>
                      <Text style={[s.badgeText, { color: cfg.renk }]}>{cfg.label}</Text>
                    </View>
                  </View>
                </React.Fragment>
              );
            })}
          </View>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.bg },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl, paddingBottom: Spacing.xl,
  },
  headerTitle: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.white },
  headerSub: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.5)', marginTop: 4 },
  content: { padding: Spacing.md },

  ozetKart: {
    flexDirection: 'row', backgroundColor: Colors.surface,
    borderRadius: Radius.xl, ...Shadow.md, paddingVertical: Spacing.md, marginBottom: Spacing.md,
  },
  ozetItem: { flex: 1, alignItems: 'center' },
  ozetDeger: { fontSize: FontSize.lg, fontWeight: '800' },
  ozetLabel: { fontSize: 10, color: Colors.textMuted, marginTop: 2 },
  ozetDivider: { width: 1, backgroundColor: Colors.border },

  bosKart: {
    alignItems: 'center', backgroundColor: Colors.surface,
    borderRadius: Radius.xl, padding: Spacing.xl * 2,
    gap: Spacing.sm, ...Shadow.sm,
  },
  bosBaslik: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.textPrimary },
  bosText: { fontSize: FontSize.sm, color: Colors.textMuted, textAlign: 'center' },

  liste: { backgroundColor: Colors.surface, borderRadius: Radius.xl, ...Shadow.sm },
  satir: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.md },
  durumIkon: { width: 44, height: 44, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  dersAdi: { fontSize: FontSize.base, fontWeight: '700', color: Colors.textPrimary },
  tarih: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  badge: { paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: Radius.full },
  badgeText: { fontSize: FontSize.xs, fontWeight: '700' },
  divider: { height: 1, backgroundColor: Colors.border, marginHorizontal: Spacing.md },
});
