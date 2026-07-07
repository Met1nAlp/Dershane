import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
  ScrollView, ActivityIndicator, Alert, StatusBar,
} from 'react-native';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../../constants/theme';
import { router } from 'expo-router';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const [tcNo, setTcNo] = useState('');
  const [sifre, setSifre] = useState('');
  const [sifreGoster, setSifreGoster] = useState(false);
  const { login, isLoading } = useAuthStore();

  const handleLogin = async () => {
    if (!tcNo || !sifre) {
      Alert.alert('Uyarı', 'TC No ve şifrenizi girin.');
      return;
    }
    if (tcNo.length !== 11) {
      Alert.alert('Uyarı', 'TC No 11 haneli olmalıdır.');
      return;
    }

    try {
      await login(tcNo, sifre);
      const currentUser = useAuthStore.getState().user;
      if (!currentUser) return;

      switch (currentUser.rol) {
        case 'ADMIN':    router.replace('/(admin)'); break;
        case 'OGRETMEN': router.replace('/(teacher)'); break;
        case 'OGRENCI':  router.replace('/(student)'); break;
        case 'VELI':     router.replace('/(parent)'); break;
      }
    } catch (err: any) {
      Alert.alert('Giriş Başarısız', err.message || 'TC veya şifre hatalı.');
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={'padding'}
      >
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingTop: insets.top + Spacing.xl }]}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>KD</Text>
            </View>
            <Text style={styles.appName}>Kayaalp Dershane</Text>
            <Text style={styles.appSlogan}>Başarıya Giden Yol</Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Giriş Yap</Text>
            <Text style={styles.cardSubtitle}>TC Kimlik No ve şifrenizle devam edin</Text>

            {/* TC No */}
            <View style={styles.fieldWrapper}>
              <Text style={styles.label}>TC Kimlik No</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="card-outline" size={18} color={Colors.textMuted} style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.input}
                  placeholder="11 haneli TC Kimlik No"
                  placeholderTextColor={Colors.textMuted}
                  value={tcNo}
                  onChangeText={(t) => setTcNo(t.replace(/\D/g, '').slice(0, 11))}
                  keyboardType="number-pad"
                  maxLength={11}
                />
              </View>
            </View>

            {/* Şifre */}
            <View style={styles.fieldWrapper}>
              <Text style={styles.label}>Şifre</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={18} color={Colors.textMuted} style={{ marginRight: 8 }} />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Şifreniz"
                  placeholderTextColor={Colors.textMuted}
                  value={sifre}
                  onChangeText={setSifre}
                  secureTextEntry={!sifreGoster}
                />
                <TouchableOpacity onPress={() => setSifreGoster(!sifreGoster)} style={styles.eyeBtn}>
                  <Ionicons
                    name={sifreGoster ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={Colors.textMuted}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Giriş Butonu */}
            <TouchableOpacity
              style={[styles.loginBtn, isLoading && styles.loginBtnDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={styles.loginBtnText}>Giriş Yap</Text>
              )}
            </TouchableOpacity>
          </View>

          <Text style={styles.footer}>© 2025 Kayaalp Dershane</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.primary },
  scroll: { flexGrow: 1, padding: Spacing.lg },

  header: { alignItems: 'center', marginBottom: Spacing.xl },
  logoCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: Colors.accent,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.md,
    ...Shadow.lg,
  },
  logoText: { fontSize: 28, fontWeight: '900', color: Colors.white, letterSpacing: 1 },
  appName: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.white, letterSpacing: -0.5 },
  appSlogan: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.5)', marginTop: 4 },

  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    ...Shadow.lg,
  },
  cardTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.primary, marginBottom: 4 },
  cardSubtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing.xl },

  fieldWrapper: { marginBottom: Spacing.md },
  label: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textSecondary, marginBottom: 6 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.inputBg,
    borderRadius: Radius.md,
    borderWidth: 1.5, borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
  },
  input: {
    flex: 1, height: 50,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  eyeBtn: { padding: 4 },

  loginBtn: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.md,
    height: 54,
    alignItems: 'center', justifyContent: 'center',
    marginTop: Spacing.sm,
    ...Shadow.md,
  },
  loginBtnDisabled: { opacity: 0.7 },
  loginBtnText: { color: Colors.white, fontSize: FontSize.md, fontWeight: '700' },

  footer: { textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: FontSize.xs, marginTop: Spacing.xl },
});
