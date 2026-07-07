import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, StatusBar,
  TouchableOpacity, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../../constants/theme';

export default function ParentProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuthStore();
  const ad = user?.adSoyad ?? 'Veli';

  const bilgiler = [
    { emoji: '🪪', label: 'TC Kimlik No', value: user?.tc ?? '-' },
    { emoji: '👤', label: 'Ad Soyad', value: user?.adSoyad ?? '-' },
    { emoji: '🎓', label: 'Rol', value: 'Veli' },
  ];

  const menuler = [
    { emoji: '💬', label: 'Destek', action: () => Alert.alert('Destek', 'support@kayaalpdershane.com'), renk: Colors.textPrimary },
    {
      emoji: '🚪', label: 'Çıkış Yap',
      action: () => Alert.alert('Çıkış', 'Çıkış yapmak istiyor musun?', [
        { text: 'İptal', style: 'cancel' },
        { text: 'Çıkış Yap', style: 'destructive', onPress: () => logout() },
      ]),
      renk: Colors.danger,
    },
  ];

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={[s.header, { paddingTop: insets.top + 20 }]}>
          <View style={s.avatarBuyuk}>
            <Text style={s.avatarHarf}>{ad.charAt(0)}</Text>
          </View>
          <Text style={s.headerAd}>{ad}</Text>
          <Text style={s.headerSinif}>Veli</Text>
        </View>

        <View style={s.sectionRow}>
          <View style={s.sectionAccent} />
          <Text style={s.sectionTitle}>Kişisel Bilgiler</Text>
        </View>
        <View style={s.kart}>
          {bilgiler.map((b, i) => (
            <React.Fragment key={i}>
              <View style={s.bilgiRow}>
                <Text style={{ fontSize: 20 }}>{b.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={s.bilgiLabel}>{b.label}</Text>
                  <Text style={s.bilgiValue}>{b.value}</Text>
                </View>
              </View>
              {i < bilgiler.length - 1 && <View style={s.divider} />}
            </React.Fragment>
          ))}
        </View>

        <View style={s.sectionRow}>
          <View style={s.sectionAccent} />
          <Text style={s.sectionTitle}>Ayarlar</Text>
        </View>
        <View style={s.kart}>
          {menuler.map((m, i) => (
            <React.Fragment key={i}>
              <TouchableOpacity style={s.menuRow} onPress={m.action} activeOpacity={0.7}>
                <Text style={{ fontSize: 20 }}>{m.emoji}</Text>
                <Text style={[s.menuLabel, { color: m.renk }]}>{m.label}</Text>
                <Text style={{ color: Colors.textMuted }}>›</Text>
              </TouchableOpacity>
              {i < menuler.length - 1 && <View style={s.divider} />}
            </React.Fragment>
          ))}
        </View>

        <Text style={s.versiyon}>Kayaalp Dershane v1.0.0</Text>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { backgroundColor: Colors.primary, alignItems: 'center', paddingBottom: 32 },
  avatarBuyuk: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.accent, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md, borderWidth: 3, borderColor: 'rgba(255,255,255,0.3)' },
  avatarHarf: { fontSize: 36, fontWeight: '800', color: Colors.white },
  headerAd: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.white },
  headerSinif: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.55)', marginTop: 4 },
  sectionRow: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: Spacing.md, marginTop: Spacing.lg, marginBottom: Spacing.sm },
  sectionAccent: { width: 4, height: 16, borderRadius: Radius.full, backgroundColor: Colors.accent },
  sectionTitle: { fontSize: FontSize.base, fontWeight: '700', color: Colors.textPrimary },
  kart: { backgroundColor: Colors.surface, borderRadius: Radius.xl, marginHorizontal: Spacing.md, ...Shadow.sm },
  bilgiRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingHorizontal: Spacing.md, paddingVertical: Spacing.md },
  bilgiLabel: { fontSize: FontSize.xs, color: Colors.textMuted },
  bilgiValue: { fontSize: FontSize.base, fontWeight: '600', color: Colors.textPrimary, marginTop: 2 },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingHorizontal: Spacing.md, paddingVertical: Spacing.md },
  menuLabel: { flex: 1, fontSize: FontSize.base, fontWeight: '600' },
  divider: { height: 1, backgroundColor: Colors.border, marginHorizontal: Spacing.md },
  versiyon: { textAlign: 'center', fontSize: FontSize.xs, color: Colors.textMuted, marginTop: Spacing.xl },
});
