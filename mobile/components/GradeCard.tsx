import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSize, Radius, Shadow } from '../constants/theme';

interface GradeCardProps {
  ders: string;
  sinavAdi: string;
  puan: number;
  tarih: string;
}

const GradeCard: React.FC<GradeCardProps> = ({ ders, sinavAdi, puan, tarih }) => {
  const renk = puan >= 85 ? Colors.success : puan >= 65 ? '#F59E0b' : Colors.danger;

  return (
    <View style={styles.container} accessibilityLabel={`${ders} dersi ${sinavAdi} sınavı. Not: ${puan}`}>
      <Text style={styles.emoji}>📚</Text>
      <Text style={styles.ders} numberOfLines={1}>{ders}</Text>
      <Text style={styles.sinav} numberOfLines={1}>{sinavAdi}</Text>
      <Text style={[styles.puan, { color: renk }]}>{puan}</Text>
      <Text style={styles.tarih}>{tarih}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 140,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    ...Shadow.sm,
    gap: 4,
  },
  emoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  ders: {
    fontSize: FontSize.sm,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  sinav: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  puan: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -1,
    marginTop: 4,
  },
  tarih: {
    fontSize: 10,
    color: Colors.textMuted,
  },
});

export default memo(GradeCard);