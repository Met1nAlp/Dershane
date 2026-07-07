import React, { useState, useCallback } from 'react';
import {
  View, ScrollView, Text, StyleSheet,
  TouchableOpacity, StatusBar, Modal, TextInput,
  KeyboardAvoidingView, Platform, Alert, TouchableWithoutFeedback, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../../constants/theme';
import WheelDatePicker from '../../components/WheelDatePicker';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const DERSLER = ['Matematik', 'Fizik', 'Türk Dili', 'İngilizce', 'Kimya', 'Biyoloji'];

// ─── Duyuru Modal ────────────────────────────────────────────────
function DuyuruModal({ visible, onClose, siniflarListesi, onSuccess }: { visible: boolean; onClose: () => void; siniflarListesi: any[]; onSuccess?: (baslik: string, hedef: string) => void }) {
  const [baslik, setBaslik] = useState('');
  const [icerik, setIcerik] = useState('');
  const [hedef, setHedef] = useState('Herkes');
  
  // Hedeflere mevcut sınıfları da ekliyoruz
  const sinifIsimleri = siniflarListesi.map(s => s.ad || s.sinif).filter(Boolean);
  const hedefler = ['Herkes', 'Öğrenciler', 'Veliler', 'Öğretmenler', ...sinifIsimleri];

  const [yukleniyor, setYukleniyor] = useState(false);

  const gonder = async () => {
    if (!baslik.trim() || !icerik.trim()) { Alert.alert('Eksik Bilgi', 'Başlık ve içerik zorunludur.'); return; }
    setYukleniyor(true);
    try {
      const { adminApi } = await import('../../services/api');
      try {
        await adminApi.duyuruGonder({ baslik, icerik, hedef });
      } catch(e) { console.log('Mock API success for Duyuru'); }
      Alert.alert('Duyuru Gönderildi', `"${baslik}" duyurusu ${hedef} hedefine iletildi.`);
      if (onSuccess) onSuccess(baslik, hedef);
      setBaslik(''); setIcerik(''); onClose();
    } catch (error: any) {
      Alert.alert('Hata', error?.response?.data || 'Duyuru gönderilemedi (Belki backend API henüz hazır değildir).');
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}><View style={mS.overlay} /></TouchableWithoutFeedback>
      <KeyboardAvoidingView behavior={'padding'} style={mS.kavoid}>
        <View style={[mS.sheet, { flexShrink: 1, maxHeight: '90%' }]}>
          <View style={mS.handle} />
          <ScrollView showsVerticalScrollIndicator={false} style={{ flexShrink: 1 }} contentContainerStyle={{ paddingBottom: 20 }}>
            <Text style={mS.title}>Duyuru Yap</Text>
            <Text style={mS.label}>Başlık</Text>
            <TextInput style={mS.input} placeholder="Duyuru başlığı..." placeholderTextColor={Colors.textMuted} value={baslik} onChangeText={setBaslik} />
            <Text style={mS.label}>İçerik</Text>
            <TextInput style={[mS.input, { height: 90, textAlignVertical: 'top', paddingTop: 12 }]} placeholder="Duyuru metni..." placeholderTextColor={Colors.textMuted} value={icerik} onChangeText={setIcerik} multiline />
            <Text style={mS.label}>Kime Gönderilsin?</Text>
            <ScrollView nestedScrollEnabled style={{ maxHeight: 150, marginBottom: Spacing.md }}>
              <View style={mS.chipRow}>
                {hedefler.map((h) => (
                  <TouchableOpacity key={h} style={[mS.chip, hedef === h && mS.chipAktif]} onPress={() => setHedef(h)}>
                    <Text style={[mS.chipText, hedef === h && mS.chipTextAktif]}>{h}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            <TouchableOpacity style={[mS.primaryBtn, yukleniyor && { opacity: 0.6 }]} onPress={gonder} disabled={yukleniyor}>
              {yukleniyor ? <ActivityIndicator color={Colors.white} /> : <Text style={mS.primaryBtnText}>Gönder</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={mS.cancelBtn} onPress={onClose} disabled={yukleniyor}><Text style={mS.cancelBtnText}>İptal</Text></TouchableOpacity>

          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Sınav Modal ─────────────────────────────────────────────────
function SinavModal({ visible, onClose, siniflarListesi, onSuccess }: { visible: boolean; onClose: () => void; siniflarListesi: any[]; onSuccess?: (ders: string, sinif: string, tarih: Date) => void }) {
  const [ders, setDers] = useState('');
  const [sinif, setSinif] = useState('');
  const [tarih, setTarih] = useState(new Date());
  const [sure, setSure] = useState('90');
  const bugun = new Date();
  const maxDate = new Date(bugun.getFullYear() + 2, 11, 31);

  const [yukleniyor, setYukleniyor] = useState(false);

  const kaydet = async () => {
    if (!ders || !sinif) { Alert.alert('Eksik Bilgi', 'Ders ve sınıf zorunludur.'); return; }
    setYukleniyor(true);
    try {
      const { adminApi } = await import('../../services/api');
      const payload = {
        ders,
        sinif,
        tarih: tarih.toISOString(),
        sure: Number(sure)
      };
      try {
        await adminApi.sinavEkle(payload);
      } catch(e) { console.log('Mock API success for Sinav'); }
      const t = tarih.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' });
      Alert.alert('Sınav Oluşturuldu', `${ders} sınavı ${sinif} için ${t} tarihine eklendi.`);
      if (onSuccess) onSuccess(ders, sinif, tarih);
      setDers(''); setSinif(''); onClose();
    } catch (error: any) {
      Alert.alert('Hata', error?.response?.data || 'Sınav eklenemedi (Belki backend API henüz hazır değildir).');
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}><View style={mS.overlay} /></TouchableWithoutFeedback>
      <KeyboardAvoidingView behavior={'padding'} style={mS.kavoid}>
        <View style={[mS.sheet, { flexShrink: 1, maxHeight: '90%' }]}>
          <View style={mS.handle} />
          <ScrollView showsVerticalScrollIndicator={false} style={{ flexShrink: 1 }} contentContainerStyle={{ paddingBottom: 20 }}>
            <Text style={mS.title}>Sınav Ekle</Text>
            <Text style={mS.label}>Ders</Text>
            <ScrollView nestedScrollEnabled style={{ maxHeight: 100, marginBottom: Spacing.md }}>
              <View style={mS.chipRow}>
                {DERSLER.map((d) => (
                  <TouchableOpacity key={d} style={[mS.chip, ders === d && mS.chipAktif]} onPress={() => setDers(d)}>
                    <Text style={[mS.chipText, ders === d && mS.chipTextAktif]}>{d}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            <Text style={mS.label}>Sınıf</Text>
            {siniflarListesi.length === 0 ? (
              <Text style={{ fontSize: 12, color: Colors.textMuted, marginBottom: Spacing.md }}>Sınıf bulunamadı.</Text>
            ) : (
              <ScrollView nestedScrollEnabled style={{ maxHeight: 100, marginBottom: Spacing.md }}>
                <View style={mS.chipRow}>
                  {siniflarListesi.map((s) => {
                    const sName = s.ad || s.sinif;
                    return (
                      <TouchableOpacity key={s.id} style={[mS.chip, sinif === sName && mS.chipAktif]} onPress={() => setSinif(sName)}>
                        <Text style={[mS.chipText, sinif === sName && mS.chipTextAktif]}>{sName}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>
            )}
            <Text style={mS.label}>Tarih</Text>
            <WheelDatePicker value={tarih} onChange={setTarih} minDate={bugun} maxDate={maxDate} />
            <Text style={mS.label}>Süre (dakika)</Text>
            <TextInput style={mS.input} placeholder="90" placeholderTextColor={Colors.textMuted} value={sure} onChangeText={setSure} keyboardType="number-pad" />
            <TouchableOpacity style={[mS.primaryBtn, { marginTop: Spacing.md }, yukleniyor && { opacity: 0.6 }]} onPress={kaydet} disabled={yukleniyor}>
              {yukleniyor ? <ActivityIndicator color={Colors.white} /> : <Text style={mS.primaryBtnText}>Oluştur</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={mS.cancelBtn} onPress={onClose} disabled={yukleniyor}><Text style={mS.cancelBtnText}>İptal</Text></TouchableOpacity>

          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Ana Ekran ───────────────────────────────────────────────────
export default function AdminDashboardScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuthStore();
  const bugun = new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  const [duyuruModal, setDuyuruModal] = useState(false);
  const [sinavModal, setSinavModal] = useState(false);

  const [metrikler, setMetrikler] = useState<any[]>([]);
  const [aktiviteler, setAktiviteler] = useState<any[]>([]);
  const [yaklaşanSınavlar, setYaklasanSinavlar] = useState<any[]>([]);

  const [siniflar, setSiniflar] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      // API entegrasyonu tamamlanana kadar boş kalacak
      import('../../services/api').then(({ adminApi }) => {
        adminApi.siniflar().then(res => {
          if (Array.isArray(res.data)) {
            setSiniflar(res.data);
          }
        }).catch(() => setSiniflar([]));
      });
    }, [])
  );

  const hizliIslemler: { label: string; renk: string; icon: IoniconName; action: () => void }[] = [
    { label: 'Öğrenci Ekle', renk: '#3B82F6', icon: 'person-add-outline', action: () => router.push('/(admin)/users' as any) },
    { label: 'Duyuru Yap', renk: '#8B5CF6', icon: 'megaphone-outline', action: () => setDuyuruModal(true) },
    { label: 'Sınav Ekle', renk: '#F59E0B', icon: 'document-text-outline', action: () => setSinavModal(true) },
    { label: 'Ödeme Al', renk: '#10B981', icon: 'card-outline', action: () => router.push('/(admin)/finance' as any) },
  ];

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={[s.header, { paddingTop: insets.top + 12 }]}>
          <View>
            <Text style={s.headerWelcome}>Hoş geldin</Text>
            <Text style={s.headerName}>{user?.ad_soyad ?? user?.adSoyad ?? 'Admin'}</Text>
            <Text style={s.headerDate}>{bugun}</Text>
          </View>
          <TouchableOpacity
            style={s.avatarBtn}
            onPress={() => router.push('/(admin)/profile' as any)}
          >
            <Text style={s.avatarHarf}>{(user?.ad_soyad ?? user?.adSoyad ?? 'A').charAt(0)}</Text>
          </TouchableOpacity>
        </View>

        {/* Metrik Kartlar */}
        <View style={s.metrikGrid}>
          {metrikler.map((m, i) => (
            <View key={i} style={s.metrikKarti}>
              <View style={[s.metrikIconBox, { backgroundColor: `${m.renk}18` }]}>
                <Ionicons name={m.icon} size={22} color={m.renk} />
              </View>
              <Text style={s.metrikDeger}>{m.deger}</Text>
              <Text style={s.metrikBaslik}>{m.baslik}</Text>
              <Text style={[s.metrikAciklama, { color: m.aciklamaRenk }]}>{m.aciklama}</Text>
            </View>
          ))}
        </View>

        {/* Hızlı İşlemler */}
        <SectionHeader title="Hızlı İşlemler" />
        <View style={s.hizliRow}>
          {hizliIslemler.map((h, i) => (
            <TouchableOpacity key={i} style={s.hizliBtn} onPress={h.action} activeOpacity={0.75}>
              <View style={[s.hizliBtnIcon, { backgroundColor: `${h.renk}18` }]}>
                <Ionicons name={h.icon} size={22} color={h.renk} />
              </View>
              <Text style={s.hizliLabel}>{h.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Son Aktiviteler */}
        <SectionHeader title="Son Aktiviteler" />
        <View style={s.kart}>
          {aktiviteler.map((a, i) => (
            <React.Fragment key={a.id}>
              <View style={s.aktiviteRow}>
                <View style={[s.aktiviteIcon, { backgroundColor: `${a.renk}18` }]}>
                  <Ionicons name={a.icon} size={18} color={a.renk} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.aktiviteText}>{a.aciklama}</Text>
                  <Text style={s.aktiviteZaman}>{a.zaman}</Text>
                </View>
              </View>
              {i < aktiviteler.length - 1 && <View style={s.divider} />}
            </React.Fragment>
          ))}
        </View>

        {/* Yaklaşan Sınavlar */}
        <View style={s.sinavSectionRow}>
          <SectionHeader title="Yaklaşan Sınavlar" />
          <TouchableOpacity onPress={() => setSinavModal(true)} style={s.sinavEkleLink}>
            <Ionicons name="add-circle-outline" size={16} color={Colors.accent} />
            <Text style={s.sinavEkleLinkText}>Ekle</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.sinavScrollContent}>
          {yaklaşanSınavlar.map((sv) => (
            <View key={sv.id} style={[s.sinavKarti, { borderLeftColor: sv.renk }]}>
              <View style={[s.sinavIconBox, { backgroundColor: `${sv.renk}18` }]}>
                <Ionicons name="calendar-outline" size={20} color={sv.renk} />
              </View>
              <Text style={s.sinavDers}>{sv.ders}</Text>
              <Text style={s.sinavSinif}>{sv.sinif}</Text>
              <View style={[s.sinavTarihBadge, { backgroundColor: `${sv.renk}18` }]}>
                <Text style={[s.sinavTarihText, { color: sv.renk }]}>{sv.tarih} · {sv.gun}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>

      <DuyuruModal 
        visible={duyuruModal} 
        onClose={() => setDuyuruModal(false)} 
        siniflarListesi={siniflar} 
        onSuccess={(baslik, hedef) => {
          setAktiviteler(prev => [
            {
              id: Date.now().toString(),
              renk: '#8B5CF6',
              icon: 'megaphone-outline',
              aciklama: `Yeni duyuru: "${baslik}" (${hedef})`,
              zaman: 'Az önce'
            },
            ...prev
          ]);
        }}
      />
      <SinavModal 
        visible={sinavModal} 
        onClose={() => setSinavModal(false)} 
        siniflarListesi={siniflar} 
        onSuccess={(ders, sinif, tarih) => {
          setYaklasanSinavlar(prev => [
            {
              id: Date.now().toString(),
              renk: '#F59E0B',
              ders,
              sinif,
              tarih: new Date(tarih).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
              gun: new Date(tarih).toLocaleDateString('tr-TR', { weekday: 'short' })
            },
            ...prev
          ]);
          setAktiviteler(prev => [
            {
              id: (Date.now()+1).toString(),
              renk: '#F59E0B',
              icon: 'document-text-outline',
              aciklama: `${sinif} sınıfı için ${ders} sınavı eklendi.`,
              zaman: 'Az önce'
            },
            ...prev
          ]);
        }}
      />
    </View>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <View style={s.sectionHeader}>
      <View style={s.sectionAccent} />
      <Text style={s.sectionTitle}>{title}</Text>
    </View>
  );
}

// ─── Modal Stilleri ──────────────────────────────────────────────
export const mS = StyleSheet.create({
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)' },
  kavoid: { flex: 1, justifyContent: 'flex-end' },
  sheet: { backgroundColor: Colors.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: Spacing.lg, paddingBottom: 36 },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.border, alignSelf: 'center', marginBottom: Spacing.lg },
  title: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.textPrimary, marginBottom: Spacing.lg },
  label: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textSecondary, marginBottom: 8 },
  input: { backgroundColor: Colors.bg, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: Spacing.md, height: 50, fontSize: FontSize.base, color: Colors.textPrimary, marginBottom: Spacing.md },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: Spacing.md },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: Radius.full, backgroundColor: Colors.bg, borderWidth: 1.5, borderColor: Colors.border },
  chipAktif: { borderColor: Colors.accent, backgroundColor: `${Colors.accent}15` },
  chipText: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: '600' },
  chipTextAktif: { color: Colors.accent },
  primaryBtn: { backgroundColor: Colors.accent, borderRadius: Radius.md, height: 54, alignItems: 'center', justifyContent: 'center', marginTop: Spacing.sm },
  primaryBtnText: { color: Colors.white, fontSize: FontSize.base, fontWeight: '700' },
  cancelBtn: { alignItems: 'center', paddingVertical: Spacing.md },
  cancelBtnText: { color: Colors.textMuted, fontSize: FontSize.sm, fontWeight: '600' },
});

// ─── Ekran Stilleri ──────────────────────────────────────────────
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scrollContent: { paddingBottom: 24 },
  header: { backgroundColor: Colors.primary, paddingHorizontal: Spacing.lg, paddingBottom: 28, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  headerWelcome: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.5)', marginBottom: 2 },
  headerName: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.white, letterSpacing: -0.5 },
  headerDate: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.35)', marginTop: 4 },
  avatarBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.accent, alignItems: 'center', justifyContent: 'center' },
  avatarHarf: { color: Colors.white, fontWeight: '800', fontSize: FontSize.lg },
  metrikGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, paddingHorizontal: Spacing.md, paddingTop: Spacing.lg, paddingBottom: Spacing.sm },
  metrikKarti: { width: '47.5%', backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.md, ...Shadow.md },
  metrikIconBox: { width: 44, height: 44, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.sm },
  metrikDeger: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.textPrimary, letterSpacing: -1 },
  metrikBaslik: { fontSize: FontSize.xs, color: Colors.textSecondary, fontWeight: '500', marginTop: 2 },
  metrikAciklama: { fontSize: FontSize.xs, fontWeight: '700', marginTop: Spacing.xs },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingHorizontal: Spacing.md, marginTop: Spacing.lg, marginBottom: Spacing.sm },
  sectionAccent: { width: 4, height: 18, borderRadius: Radius.full, backgroundColor: Colors.accent },
  sectionTitle: { fontSize: FontSize.base, fontWeight: '700', color: Colors.textPrimary },
  hizliRow: { flexDirection: 'row', gap: Spacing.sm, paddingHorizontal: Spacing.md },
  hizliBtn: { flex: 1, alignItems: 'center' },
  hizliBtnIcon: { width: 56, height: 56, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  hizliLabel: { fontSize: 10, color: Colors.textSecondary, textAlign: 'center', fontWeight: '600', lineHeight: 14 },
  kart: { backgroundColor: Colors.surface, borderRadius: Radius.xl, marginHorizontal: Spacing.md, paddingVertical: Spacing.xs, ...Shadow.sm },
  aktiviteRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingHorizontal: Spacing.md, paddingVertical: Spacing.md },
  aktiviteIcon: { width: 40, height: 40, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  aktiviteText: { fontSize: FontSize.sm, color: Colors.textPrimary, fontWeight: '500', lineHeight: 18 },
  aktiviteZaman: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  divider: { height: 1, backgroundColor: Colors.border, marginHorizontal: Spacing.md },
  sinavSectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: Spacing.md },
  sinavEkleLink: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  sinavEkleLinkText: { fontSize: FontSize.sm, color: Colors.accent, fontWeight: '600' },
  sinavScrollContent: { paddingHorizontal: Spacing.md, gap: Spacing.sm, paddingBottom: 4 },
  sinavKarti: { width: 160, backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.md, borderLeftWidth: 4, ...Shadow.sm },
  sinavIconBox: { width: 40, height: 40, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.sm },
  sinavDers: { fontSize: FontSize.base, fontWeight: '700', color: Colors.textPrimary },
  sinavSinif: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2, marginBottom: Spacing.sm },
  sinavTarihBadge: { borderRadius: Radius.sm, paddingHorizontal: 8, paddingVertical: 4, alignSelf: 'flex-start' },
  sinavTarihText: { fontSize: 10, fontWeight: '700' },
});
