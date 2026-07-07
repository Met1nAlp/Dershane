import React, { useEffect, useState } from 'react';
import {
  SafeAreaView, ScrollView, View, Text, StyleSheet,
  StatusBar, ActivityIndicator,
} from 'react-native';
import { ogrenciApi } from '../../services/api';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../../constants/theme';

export default function GradesScreen() {
  const [notlar, setNotlar] = useState<any[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    ogrenciApi.notlarim()
      .then(r => setNotlar(r.data as any[]))
      .catch(() => {})
      .finally(() => setYukleniyor(false));
  }, []);

  // Derslere göre grupla
  const dersler = [...new Set(notlar.map(n => n.ders))];

  const derslereGoreNotlar = dersler.map(ders => ({
    ders,
    notlar: notlar.filter(n => n.ders === ders),
    ortalama: Math.round(
      notlar.filter(n => n.ders === ders).reduce((a, b) => a + b.puan, 0) /
      notlar.filter(n => n.ders === ders).length
    ),
  }));

  return (
    <SafeAreaView style={s.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <View style={s.header}>
        <Text style={s.headerTitle}>📊 Notlarım</Text>
        <Text style={s.headerSub}>Tüm sınav sonuçlarınız</Text>
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {yukleniyor ? (
          <ActivityIndicator color={Colors.accent} size="large" style={{ marginTop: 60 }} />
        ) : notlar.length === 0 ? (
          <View style={s.bosKart}>
            <Text style={{ fontSize: 40 }}>📭</Text>
            <Text style={s.bosBaslik}>Henüz Not Yok</Text>
            <Text style={s.bosText}>Öğretmen not girişi yaptığında burada görünecek.</Text>
          </View>
        ) : (
          derslereGoreNotlar.map((grup, gi) => {
            const ortRenk = grup.ortalama >= 85 ? Colors.success : grup.ortalama >= 65 ? '#F59E0B' : Colors.danger;
            return (
              <View key={gi} style={s.dersKart}>
                {/* Ders Başlığı */}
                <View style={s.dersHeader}>
                  <Text style={s.dersAdi}>{grup.ders}</Text>
                  <View style={[s.ortBadge, { backgroundColor: `${ortRenk}18` }]}>
                    <Text style={[s.ortText, { color: ortRenk }]}>Ort: {grup.ortalama}</Text>
                  </View>
                </View>

                {/* Not Listesi */}
                {grup.notlar.map((not: any, ni: number) => {
                  const renk = not.puan >= 85 ? Colors.success : not.puan >= 65 ? '#F59E0B' : Colors.danger;
                  return (
                    <React.Fragment key={ni}>
                      {ni > 0 && <View style={s.divider} />}
                      <View style={s.notRow}>
                        <View style={[s.puanDaire, { borderColor: renk }]}>
                          <Text style={[s.puanText, { color: renk }]}>{not.puan}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={s.sinavAdi}>{not.sinavAdi}</Text>
                          <Text style={s.tarih}>📅 {not.tarih}</Text>
                        </View>
                        <View style={[s.durumBadge, { backgroundColor: `${renk}18` }]}>
                          <Text style={[s.durumText, { color: renk }]}>
                            {not.puan >= 85 ? 'İyi' : not.puan >= 65 ? 'Orta' : 'Zayıf'}
                          </Text>
                        </View>
                      </View>
                    </React.Fragment>
                  );
                })}
              </View>
            );
          })
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

  bosKart: {
    alignItems: 'center', backgroundColor: Colors.surface,
    borderRadius: Radius.xl, padding: Spacing.xl * 2, marginTop: Spacing.xl,
    gap: Spacing.sm, ...Shadow.sm,
  },
  bosBaslik: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.textPrimary },
  bosText: { fontSize: FontSize.sm, color: Colors.textMuted, textAlign: 'center' },

  dersKart: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    marginBottom: Spacing.md, ...Shadow.sm, overflow: 'hidden',
  },
  dersHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    backgroundColor: `${Colors.primary}08`,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  dersAdi: { fontSize: FontSize.base, fontWeight: '800', color: Colors.primary },
  ortBadge: { paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: Radius.full },
  ortText: { fontSize: FontSize.xs, fontWeight: '700' },

  notRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.md },
  puanDaire: {
    width: 52, height: 52, borderRadius: 26,
    borderWidth: 2.5, alignItems: 'center', justifyContent: 'center',
  },
  puanText: { fontSize: FontSize.lg, fontWeight: '900' },
  sinavAdi: { fontSize: FontSize.base, fontWeight: '700', color: Colors.textPrimary },
  tarih: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  durumBadge: { paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: Radius.full },
  durumText: { fontSize: FontSize.xs, fontWeight: '700' },
  divider: { height: 1, backgroundColor: Colors.border, marginHorizontal: Spacing.md },
});
