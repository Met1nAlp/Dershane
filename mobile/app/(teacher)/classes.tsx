import React, { useEffect, useState } from 'react';
import {
  SafeAreaView, View, Text, StyleSheet, FlatList,
  StatusBar, ActivityIndicator,
} from 'react-native';
import { ogretmenApi } from '../../services/api';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../../constants/theme';

export default function TeacherClassesScreen() {
  const [siniflar, setSiniflar] = useState<any[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    ogretmenApi.siniflarim()
      .then(res => setSiniflar(res.data))
      .catch(() => {})
      .finally(() => setYukleniyor(false));
  }, []);

  const renderItem = ({ item }: { item: any }) => {
    return (
      <View style={s.kart}>
        <View style={s.icerik}>
          <View style={s.kartHeader}>
            <View style={s.baslikRow}>
              <Text style={{ fontSize: 24 }}>🏫</Text>
              <Text style={s.sinifAdi}>{item.ad} Sınıfı</Text>
            </View>
          </View>

          <View style={s.statsGrid}>
            <View style={s.statBox}>
              <Text style={s.statLabel}>Seviye</Text>
              <Text style={s.statValue}>{item.seviye}</Text>
            </View>
            <View style={s.statBox}>
              <Text style={s.statLabel}>Kapasite</Text>
              <Text style={s.statValue}>{item.kapasite} Öğrenci</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={s.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      
      <View style={s.header}>
        <Text style={s.headerTitle}>Sınıflarım</Text>
        <Text style={s.headerAlt}>Dersine girdiğiniz sınıflar</Text>
      </View>

      {yukleniyor ? (
        <ActivityIndicator color={Colors.accent} size="large" style={{ marginTop: 60 }} />
      ) : siniflar.length === 0 ? (
        <View style={s.bosKart}>
          <Text style={{ fontSize: 40 }}>📭</Text>
          <Text style={s.bosBaslik}>Sınıf Yok</Text>
          <Text style={s.bosText}>Size atanmış herhangi bir sınıf bulunmuyor.</Text>
        </View>
      ) : (
        <FlatList
          data={siniflar}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={s.liste}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
        />
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.bg },
  header: {
    backgroundColor: Colors.primary, paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg, paddingBottom: Spacing.lg,
  },
  headerTitle: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.white },
  headerAlt: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.6)', marginTop: 4 },
  liste: { padding: Spacing.md, paddingBottom: 40 },
  kart: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    flexDirection: 'row', overflow: 'hidden', ...Shadow.sm,
  },
  icerik: { flex: 1, padding: Spacing.md },
  kartHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.md },
  baslikRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  sinifAdi: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.textPrimary },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  statBox: {
    flex: 1, flexDirection: 'column', gap: 4,
    backgroundColor: Colors.bg, padding: Spacing.sm, borderRadius: Radius.md,
  },
  statValue: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textPrimary },
  statLabel: { fontSize: 10, color: Colors.textSecondary },

  bosKart: {
    alignItems: 'center', backgroundColor: Colors.surface,
    borderRadius: Radius.xl, padding: Spacing.xl * 2, margin: Spacing.md,
    gap: Spacing.sm, ...Shadow.sm,
  },
  bosBaslik: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.textPrimary },
  bosText: { fontSize: FontSize.sm, color: Colors.textMuted, textAlign: 'center' },
});
