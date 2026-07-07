import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../../constants/theme';

interface SinavSonucu {
  id: number;
  sinav_adi: string;
  tarih: string;
  toplam_puan: number;
  turkce_net: number;
  mat_net: number;
}

const sinavlar: SinavSonucu[] = [
  {
    id: 1,
    sinav_adi: 'TYT Deneme Sınavı #1',
    tarih: '10 Haziran 2026',
    toplam_puan: 312.5,
    turkce_net: 27.33,
    mat_net: 18.5,
  },
  {
    id: 2,
    sinav_adi: 'AYT Deneme Sınavı #1',
    tarih: '3 Haziran 2026',
    toplam_puan: 278.0,
    turkce_net: 22.0,
    mat_net: 15.75,
  },
  {
    id: 3,
    sinav_adi: 'TYT Deneme Sınavı #2',
    tarih: '27 Mayıs 2026',
    toplam_puan: 295.25,
    turkce_net: 24.67,
    mat_net: 16.0,
  },
];

export default function ExamsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Sınav Sonuçlarım</Text>
          <Text style={styles.headerSubtitle}>{sinavlar.length} sınav kaydı</Text>
        </View>

        {/* Exam Cards */}
        {sinavlar.map((sinav) => (
          <View key={sinav.id} style={styles.card}>
            {/* Card Top Row */}
            <View style={styles.cardTop}>
              <View style={styles.cardTitleArea}>
                <Text style={styles.cardTitle}>{sinav.sinav_adi}</Text>
                <Text style={styles.cardDate}>📅 {sinav.tarih}</Text>
              </View>
              {/* Puan Badge */}
              <View style={styles.puanBadge}>
                <Text style={styles.puanValue}>{sinav.toplam_puan}</Text>
                <Text style={styles.puanLabel}>puan</Text>
              </View>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Net Breakdown */}
            <View style={styles.netRow}>
              <View style={styles.netItem}>
                <Text style={styles.netIcon}>📖</Text>
                <View>
                  <Text style={styles.netLabel}>Türkçe Net</Text>
                  <Text style={styles.netValue}>{sinav.turkce_net.toFixed(2)}</Text>
                </View>
              </View>
              <View style={styles.netSeparator} />
              <View style={styles.netItem}>
                <Text style={styles.netIcon}>📐</Text>
                <View>
                  <Text style={styles.netLabel}>Matematik Net</Text>
                  <Text style={styles.netValue}>{sinav.mat_net.toFixed(2)}</Text>
                </View>
              </View>
            </View>
          </View>
        ))}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  headerTitle: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadow.md,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  cardTitleArea: {
    flex: 1,
    marginRight: Spacing.md,
  },
  cardTitle: {
    fontSize: FontSize.base,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  cardDate: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  puanBadge: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    minWidth: 72,
  },
  puanValue: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    color: Colors.white,
  },
  puanLabel: {
    fontSize: FontSize.xs,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.md,
  },
  netRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  netItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  netIcon: {
    fontSize: 22,
  },
  netSeparator: {
    width: 1,
    height: 36,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.md,
  },
  netLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  netValue: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  bottomPadding: {
    height: Spacing.xl,
  },
});
