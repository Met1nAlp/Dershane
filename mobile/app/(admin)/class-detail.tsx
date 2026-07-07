import React, { useState } from 'react';
import {
  SafeAreaView, View, Text, StyleSheet, ScrollView,
  StatusBar, TouchableOpacity, FlatList,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../../constants/theme';

const OGRENCILER = [
  { id: 1, ad: 'Zeynep Arslan', devam: 94 },
  { id: 2, ad: 'Mert Kaya', devam: 88 },
  { id: 3, ad: 'Elif Şahin', devam: 76 },
  { id: 4, ad: 'Burak Demir', devam: 98 },
  { id: 5, ad: 'Emre Çelik', devam: 91 },
];

const MOCK_SINAVLAR = [
  { ad: 'Matematik 1. Yazılı', tarih: '10 Mar', ort: 72, katilim: 18 },
  { ad: 'Matematik 2. Yazılı', tarih: '15 May', ort: 70, katilim: 17 },
];

export default function ClassDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string; sinif: string; ogretmen: string; devam: string; ogrenci: string; renk: string }>();
  const [aktifTab, setAktifTab] = useState(0);

  const devam = Number(params.devam ?? 90);
  const devamRenk = devam >= 90 ? Colors.success : devam >= 80 ? '#F59E0B' : Colors.danger;
  const tabs = ['Öğrenciler', 'Sınavlar', 'İstatistik'];

  return (
    <SafeAreaView style={s.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Header */}
      <View style={[s.header, { backgroundColor: params.renk ?? Colors.primary }]}>
        <TouchableOpacity style={s.backBtn} onPress={() => {
          if (params.returnTo) router.push(`/(admin)/${params.returnTo}` as any);
          else router.push('/(admin)/classes' as any);
        }}>
          <Ionicons name="arrow-back-outline" size={22} color={Colors.white} />
        </TouchableOpacity>
        <View style={s.headerBody}>
          <View style={s.sinifIconBox}>
            <Ionicons name="library-outline" size={28} color={Colors.white} />
          </View>
          <Text style={s.sinifAdi}>{params.sinif} Sınıfı</Text>
          <Text style={s.ogretmenAd}>{params.ogretmen}</Text>
          <View style={s.statsRow}>
            <View style={s.statPill}>
              <Ionicons name="people-outline" size={13} color={Colors.white} />
              <Text style={s.statPillText}>{params.ogrenci ?? OGRENCILER.length} Öğrenci</Text>
            </View>
            <View style={[s.statPill, { backgroundColor: `${devamRenk}40` }]}>
              <Ionicons name="checkmark-circle-outline" size={13} color={devamRenk} />
              <Text style={[s.statPillText, { color: devamRenk }]}>%{devam} Devam</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={s.tabRow}>
        {tabs.map((t, i) => (
          <TouchableOpacity key={i} style={[s.tab, aktifTab === i && s.tabAktif]} onPress={() => setAktifTab(i)}>
            <Text style={[s.tabText, aktifTab === i && s.tabTextAktif]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ÖĞRENCILER */}
      {aktifTab === 0 && (
        <FlatList
          data={OGRENCILER}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: Spacing.md }}
          ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
          renderItem={({ item }) => {
            const dr = item.devam >= 90 ? Colors.success : item.devam >= 75 ? '#F59E0B' : Colors.danger;
            return (
              <View style={s.ogrenciKart}>
                <View style={s.ogrenciAvatar}>
                  <Text style={s.ogrenciHarf}>{item.ad.charAt(0)}</Text>
                </View>
                <Text style={[s.ogrenciAd, { flex: 1 }]}>{item.ad}</Text>
                <View style={[s.devamBadge, { backgroundColor: `${dr}18` }]}>
                  <Text style={[s.devamText, { color: dr }]}>%{item.devam}</Text>
                </View>
              </View>
            );
          }}
        />
      )}

      {/* SINAVLAR */}
      {aktifTab === 1 && (
        <ScrollView contentContainerStyle={{ padding: Spacing.md }}>
          {MOCK_SINAVLAR.map((sn, i) => (
            <View key={i} style={[s.kart, { marginBottom: Spacing.sm }]}>
              <View style={s.sinavHeader}>
                <View style={s.sinavIconBox}>
                  <Ionicons name="document-text-outline" size={18} color={Colors.accent} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.sinavAd}>{sn.ad}</Text>
                  <Text style={s.sinavTarih}>{sn.tarih}</Text>
                </View>
              </View>
              <View style={s.sinavStats}>
                <View style={s.sinavStat}>
                  <Text style={s.sinavStatDeger}>{sn.ort}</Text>
                  <Text style={s.sinavStatLabel}>Sınıf Ortalaması</Text>
                </View>
                <View style={s.sinavStat}>
                  <Text style={s.sinavStatDeger}>{sn.katilim}</Text>
                  <Text style={s.sinavStatLabel}>Katılan</Text>
                </View>
              </View>
              <View style={{ paddingHorizontal: Spacing.md, paddingBottom: Spacing.md }}>
                <View style={s.progressBg}>
                  <View style={[s.progressFill, { width: `${sn.ort}%` as any }]} />
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* İSTATİSTİK */}
      {aktifTab === 2 && (
        <ScrollView contentContainerStyle={{ padding: Spacing.md }}>
          <View style={s.kart}>
            {[
              { icon: 'people-outline' as const, label: 'Öğrenci Sayısı', value: String(params.ogrenci ?? OGRENCILER.length), renk: '#3B82F6' },
              { icon: 'checkmark-circle-outline' as const, label: 'Devam Oranı', value: `%${devam}`, renk: devamRenk },
              { icon: 'trophy-outline' as const, label: 'Sınav Ortalaması', value: '71', renk: '#8B5CF6' },
              { icon: 'document-text-outline' as const, label: 'Toplam Sınav', value: String(MOCK_SINAVLAR.length), renk: '#F59E0B' },
            ].map((item, i, arr) => (
              <React.Fragment key={i}>
                <View style={s.istatRow}>
                  <View style={[s.istatIcon, { backgroundColor: `${item.renk}18` }]}>
                    <Ionicons name={item.icon} size={18} color={item.renk} />
                  </View>
                  <Text style={[s.istatLabel, { flex: 1 }]}>{item.label}</Text>
                  <Text style={[s.istatDeger, { color: item.renk }]}>{item.value}</Text>
                </View>
                {i < arr.length - 1 && <View style={s.divider} />}
              </React.Fragment>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.bg },
  header: { paddingBottom: 24, alignItems: 'center' },
  backBtn: { position: 'absolute', top: Spacing.lg, left: Spacing.md, zIndex: 10, padding: 4 },
  headerBody: { alignItems: 'center', paddingTop: Spacing.lg },
  sinifIconBox: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.sm },
  sinifAdi: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.white },
  ogretmenAd: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md },
  statPill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.full },
  statPillText: { fontSize: FontSize.xs, color: Colors.white, fontWeight: '600' },
  tabRow: { flexDirection: 'row', backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabAktif: { borderBottomColor: Colors.accent },
  tabText: { fontSize: FontSize.xs, fontWeight: '600', color: Colors.textMuted },
  tabTextAktif: { color: Colors.accent },
  kart: { backgroundColor: Colors.surface, borderRadius: Radius.xl, paddingVertical: Spacing.xs, ...Shadow.sm },
  ogrenciKart: { backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.md, flexDirection: 'row', alignItems: 'center', gap: Spacing.md, ...Shadow.sm },
  ogrenciAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: `${Colors.accent}18`, alignItems: 'center', justifyContent: 'center' },
  ogrenciHarf: { fontSize: FontSize.base, fontWeight: '800', color: Colors.accent },
  ogrenciAd: { fontSize: FontSize.base, fontWeight: '600', color: Colors.textPrimary },
  devamBadge: { borderRadius: Radius.md, paddingHorizontal: 10, paddingVertical: 4 },
  devamText: { fontSize: FontSize.sm, fontWeight: '800' },
  sinavHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingHorizontal: Spacing.md, paddingTop: Spacing.md, marginBottom: Spacing.md },
  sinavIconBox: { width: 40, height: 40, borderRadius: Radius.md, backgroundColor: `${Colors.accent}15`, alignItems: 'center', justifyContent: 'center' },
  sinavAd: { fontSize: FontSize.base, fontWeight: '700', color: Colors.textPrimary },
  sinavTarih: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  sinavStats: { flexDirection: 'row', gap: Spacing.md, paddingHorizontal: Spacing.md, marginBottom: Spacing.md },
  sinavStat: { flex: 1, alignItems: 'center', backgroundColor: Colors.bg, borderRadius: Radius.md, padding: Spacing.sm },
  sinavStatDeger: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.textPrimary },
  sinavStatLabel: { fontSize: 10, color: Colors.textMuted, marginTop: 2, textAlign: 'center' },
  progressBg: { height: 8, backgroundColor: Colors.border, borderRadius: Radius.full, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: Colors.accent, borderRadius: Radius.full },
  istatRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingHorizontal: Spacing.md, paddingVertical: Spacing.md },
  istatIcon: { width: 40, height: 40, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  istatLabel: { fontSize: FontSize.base, color: Colors.textSecondary, fontWeight: '500' },
  istatDeger: { fontSize: FontSize.lg, fontWeight: '800' },
  divider: { height: 1, backgroundColor: Colors.border, marginHorizontal: Spacing.md },
});
