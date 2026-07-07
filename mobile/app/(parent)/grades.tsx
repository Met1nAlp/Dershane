import React from 'react';
import {
  SafeAreaView, View, Text, StyleSheet,
  StatusBar,
} from 'react-native';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../../constants/theme';

export default function ParentGradesScreen() {
  return (
    <SafeAreaView style={s.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <View style={s.header}>
        <Text style={s.headerTitle}>📊 Not Takibi</Text>
      </View>

      <View style={s.bosContainer}>
        <Text style={{ fontSize: 56 }}>🚧</Text>
        <Text style={s.bosTitle}>Yapım Aşamasında</Text>
        <Text style={s.bosText}>Bu özellik çok yakında aktif olacaktır.</Text>
      </View>

    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.bg },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  headerTitle: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.white },

  bosContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
    marginTop: -40,
  },
  bosTitle: { fontSize: FontSize.lg, color: Colors.textPrimary, fontWeight: '800', textAlign: 'center' },
  bosText: { fontSize: FontSize.sm, color: Colors.textMuted, textAlign: 'center' },
});
