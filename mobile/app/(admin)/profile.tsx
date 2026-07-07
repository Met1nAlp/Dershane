import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, StatusBar,
  TouchableOpacity, Alert, Modal, TextInput,
  KeyboardAvoidingView, Platform, TouchableWithoutFeedback, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { adminApi } from '../../services/api';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../../constants/theme';

// ─── Şifre Değiştir Modal ────────────────────────────────────────
function SifreDegistirModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [mevcutSifre, setMevcutSifre] = useState('');
  const [yeniSifre, setYeniSifre] = useState('');
  const [tekrar, setTekrar] = useState('');
  const [goster, setGoster] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(false);

  const kaydet = async () => {
    if (!mevcutSifre || !yeniSifre || !tekrar) { Alert.alert('Eksik Bilgi', 'Tüm alanları doldurun.'); return; }
    if (yeniSifre !== tekrar) { Alert.alert('Hata', 'Yeni şifreler eşleşmiyor.'); return; }
    if (yeniSifre.length < 6) { Alert.alert('Hata', 'Şifre en az 6 karakter olmalı.'); return; }

    setYukleniyor(true);
    try {
      await adminApi.sifreDegistir({ mevcutSifre, yeniSifre });
      Alert.alert('Başarılı', 'Şifreniz güncellendi.');
      setMevcutSifre(''); setYeniSifre(''); setTekrar('');
      onClose();
    } catch (e: any) {
      Alert.alert('Hata', e?.response?.data || 'Şifre güncellenemedi.');
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableWithoutFeedback onPress={onClose}><View style={mS.overlay} /></TouchableWithoutFeedback>
      <KeyboardAvoidingView behavior={'padding'} style={mS.kavoid}>
        <View style={mS.sheet}>
          <View style={mS.handle} />
          <Text style={mS.title}>🔒 Şifre Değiştir</Text>
          {[
            { label: 'Mevcut Şifre', val: mevcutSifre, set: setMevcutSifre },
            { label: 'Yeni Şifre', val: yeniSifre, set: setYeniSifre },
            { label: 'Yeni Şifre Tekrar', val: tekrar, set: setTekrar },
          ].map((f, i) => (
            <View key={i}>
              <Text style={mS.label}>{f.label}</Text>
              <View style={mS.inputRow}>
                <TextInput
                  style={[mS.input, { flex: 1 }]}
                  placeholder="••••••"
                  placeholderTextColor={Colors.textMuted}
                  secureTextEntry={!goster}
                  value={f.val}
                  onChangeText={f.set}
                />
                {i === 0 && (
                  <TouchableOpacity onPress={() => setGoster(v => !v)} style={mS.gosterBtn}>
                    <Text style={{ fontSize: 18 }}>{goster ? '🙈' : '👁️'}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
          <TouchableOpacity style={mS.primaryBtn} onPress={kaydet} disabled={yukleniyor}>
            {yukleniyor
              ? <ActivityIndicator color={Colors.white} />
              : <Text style={mS.primaryBtnText}>Güncelle</Text>
            }
          </TouchableOpacity>
          <TouchableOpacity style={mS.cancelBtn} onPress={onClose}>
            <Text style={mS.cancelBtnText}>İptal</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Bildirim Ayarları Modal ─────────────────────────────────────
function BildirimModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [yeniKayit, setYeniKayit] = useState(true);
  const [odeme, setOdeme] = useState(true);
  const [devamsizlik, setDevamsizlik] = useState(true);
  const [sinav, setSinav] = useState(false);

  const bildirimler = [
    { label: 'Yeni Kayıt Bildirimi', desc: 'Yeni öğrenci/öğretmen eklendiğinde', val: yeniKayit, set: setYeniKayit },
    { label: 'Ödeme Bildirimi', desc: 'Ödeme alındığında veya geciktiğinde', val: odeme, set: setOdeme },
    { label: 'Devamsızlık Uyarısı', desc: 'Yüksek devamsızlık durumunda', val: devamsizlik, set: setDevamsizlik },
    { label: 'Sınav Hatırlatma', desc: 'Yaklaşan sınavlardan önce', val: sinav, set: setSinav },
  ];

  const kaydet = () => {
    Alert.alert('Kaydedildi', 'Bildirim tercihleriniz güncellendi.');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableWithoutFeedback onPress={onClose}><View style={mS.overlay} /></TouchableWithoutFeedback>
      <KeyboardAvoidingView behavior={'padding'} style={mS.kavoid}>
        <View style={mS.sheet}>
          <View style={mS.handle} />
          <Text style={mS.title}>🔔 Bildirim Ayarları</Text>

          {bildirimler.map((b, i) => (
            <React.Fragment key={i}>
              <TouchableOpacity
                style={mS.bildirimRow}
                onPress={() => b.set(!b.val)}
                activeOpacity={0.7}
              >
                <View style={{ flex: 1 }}>
                  <Text style={mS.bildirimLabel}>{b.label}</Text>
                  <Text style={mS.bildirimDesc}>{b.desc}</Text>
                </View>
                <View style={[mS.toggle, b.val && mS.toggleAktif]}>
                  <View style={[mS.toggleDot, b.val && mS.toggleDotAktif]} />
                </View>
              </TouchableOpacity>
              {i < bildirimler.length - 1 && <View style={mS.divider} />}
            </React.Fragment>
          ))}

          <TouchableOpacity style={[mS.primaryBtn, { marginTop: Spacing.lg }]} onPress={kaydet}>
            <Text style={mS.primaryBtnText}>Kaydet</Text>
          </TouchableOpacity>
          <TouchableOpacity style={mS.cancelBtn} onPress={onClose}>
            <Text style={mS.cancelBtnText}>İptal</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Ana Ekran ───────────────────────────────────────────────────
export default function AdminProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuthStore();
  const ad = user?.ad_soyad ?? user?.adSoyad ?? 'Yönetici';
  const [sifreModal, setSifreModal] = useState(false);
  const [bildirimModal, setBildirimModal] = useState(false);

  const bilgiler = [
    { emoji: '🪪', label: 'TC Kimlik No', value: user?.tc ?? '-' },
    { emoji: '👤', label: 'Ad Soyad', value: ad },
    { emoji: '🎓', label: 'Rol', value: 'Yönetici' },
  ];

  const menuler = [
    { emoji: '🔒', label: 'Şifre Değiştir', action: () => setSifreModal(true), renk: Colors.textPrimary },
    { emoji: '🔔', label: 'Bildirim Ayarları', action: () => setBildirimModal(true), renk: Colors.textPrimary },
    { emoji: '💬', label: 'Destek', action: () => Alert.alert('Destek', 'Bize destek@kayaalpdershane.com adresinden ulaşabilirsiniz.\n\nÇalışma saatleri: Hafta içi 09:00 - 18:00'), renk: Colors.textPrimary },
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
          <Text style={s.headerSinif}>Yönetici</Text>
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

      <SifreDegistirModal visible={sifreModal} onClose={() => setSifreModal(false)} />
      <BildirimModal visible={bildirimModal} onClose={() => setBildirimModal(false)} />
    </View>
  );
}

// ─── Modal Stilleri ──────────────────────────────────────────────
const mS = StyleSheet.create({
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)' },
  kavoid: { flex: 1, justifyContent: 'flex-end' },
  sheet: { backgroundColor: Colors.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: Spacing.lg, paddingBottom: 36 },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.border, alignSelf: 'center', marginBottom: Spacing.lg },
  title: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.textPrimary, marginBottom: Spacing.lg },
  label: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textSecondary, marginBottom: 8 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: Spacing.md },
  input: { backgroundColor: Colors.bg, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: Spacing.md, height: 50, fontSize: FontSize.base, color: Colors.textPrimary },
  gosterBtn: { padding: 8 },
  primaryBtn: { backgroundColor: Colors.accent, borderRadius: Radius.md, height: 54, alignItems: 'center', justifyContent: 'center', marginTop: Spacing.sm },
  primaryBtnText: { color: Colors.white, fontSize: FontSize.base, fontWeight: '700' },
  cancelBtn: { alignItems: 'center', paddingVertical: Spacing.md },
  cancelBtnText: { color: Colors.textMuted, fontSize: FontSize.sm, fontWeight: '600' },
  bildirimRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md, gap: Spacing.md },
  bildirimLabel: { fontSize: FontSize.base, fontWeight: '600', color: Colors.textPrimary },
  bildirimDesc: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  toggle: { width: 50, height: 28, borderRadius: 14, backgroundColor: Colors.border, padding: 3, justifyContent: 'center' },
  toggleAktif: { backgroundColor: Colors.accent },
  toggleDot: { width: 22, height: 22, borderRadius: 11, backgroundColor: Colors.white },
  toggleDotAktif: { alignSelf: 'flex-end' },
  divider: { height: 1, backgroundColor: Colors.border },
});

// ─── Ekran Stilleri ──────────────────────────────────────────────
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
