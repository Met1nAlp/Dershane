import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity,
  Modal, TextInput, KeyboardAvoidingView, Platform, Alert, TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../../constants/theme';

interface Sinif {
  id: number;
  sinif: string;
  ogrenci: number;
  ogretmen: string;
  devam: number;
  renk: string;
}

const INITIAL_SINIFLAR: Sinif[] = [];

const RENKLER = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4', '#F97316', '#EC4899'];

interface SinifEkleData {
  sinifAdi: string;
  ogretmenId: number;
  ogretmenAd: string;
  renk: string;
}

function SinifEkleModal({ visible, onClose, onEkle, ogretmenlerListesi, yukleniyor }: { visible: boolean; onClose: () => void; onEkle: (s: SinifEkleData) => void; ogretmenlerListesi: any[]; yukleniyor: boolean }) {
  const [sinifAdi, setSinifAdi] = useState('');
  const [seciliOgretmenId, setSeciliOgretmenId] = useState<number | null>(null);
  const [renk, setRenk] = useState(RENKLER[0]);

  const kaydet = () => {
    if (!sinifAdi.trim() || !seciliOgretmenId) { Alert.alert('Eksik Bilgi', 'Sınıf adı ve öğretmen seçiniz.'); return; }
    const seciliOgretmen = ogretmenlerListesi.find(o => o.id === seciliOgretmenId);
    const ogretmenAd = seciliOgretmen?.adSoyad || seciliOgretmen?.ad_soyad || seciliOgretmen?.ad || 'Bilinmiyor';
    onEkle({ sinifAdi: sinifAdi.trim().toUpperCase(), ogretmenId: seciliOgretmenId, ogretmenAd, renk });
    setSinifAdi(''); setSeciliOgretmenId(null); setRenk(RENKLER[0]);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}><View style={mS.overlay} /></TouchableWithoutFeedback>
      <KeyboardAvoidingView behavior={'padding'} style={mS.kavoid}>
        <View style={[mS.sheet, { flexShrink: 1, maxHeight: '90%' }]}>
          <View style={mS.handle} />
          <ScrollView showsVerticalScrollIndicator={false} style={{ flexShrink: 1 }} contentContainerStyle={{ paddingBottom: 20 }}>
            <Text style={mS.title}>Sınıf Ekle</Text>
            <Text style={mS.label}>Sınıf Adı</Text>
            <TextInput style={mS.input} placeholder="Örn: 12-C" placeholderTextColor={Colors.textMuted} value={sinifAdi} onChangeText={setSinifAdi} autoCapitalize="characters" />
            <Text style={mS.label}>Sorumlu Öğretmen</Text>
            {ogretmenlerListesi.length === 0 ? (
              <Text style={{ fontSize: 12, color: Colors.textMuted, marginBottom: Spacing.md }}>Öğretmen bulunamadı.</Text>
            ) : (
              <ScrollView nestedScrollEnabled style={{ maxHeight: 120, marginBottom: Spacing.md }}>
                <View style={mS.chipRow}>
                  {ogretmenlerListesi.map((o) => {
                    const hocaAd = o.adSoyad || o.ad_soyad || o.ad || 'Bilinmiyor';
                    const secili = seciliOgretmenId === o.id;
                    return (
                      <TouchableOpacity key={o.id} style={[mS.chip, secili && mS.chipAktif]} onPress={() => setSeciliOgretmenId(o.id)}>
                        <Text style={[mS.chipText, secili && mS.chipTextAktif]}>{hocaAd}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>
            )}
            <Text style={mS.label}>Kart Rengi</Text>
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: Spacing.md }}>
              {RENKLER.map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[mS.renkDaire, { backgroundColor: r }, renk === r && mS.renkSecili]}
                  onPress={() => setRenk(r)}
                />
              ))}
            </View>
            <TouchableOpacity style={[mS.primaryBtn, yukleniyor && { opacity: 0.6 }]} onPress={kaydet} disabled={yukleniyor}>
              {yukleniyor ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={mS.primaryBtnText}>Oluştur</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={mS.cancelBtn} onPress={onClose} disabled={yukleniyor}><Text style={mS.cancelBtnText}>İptal</Text></TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default function ClassesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [siniflar, setSiniflar] = useState<Sinif[]>(INITIAL_SINIFLAR);
  const [modalAcik, setModalAcik] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(false);

  const [ogretmenler, setOgretmenler] = useState<any[]>([]);

  const siniflariYukle = useCallback(() => {
    import('../../services/api').then(({ adminApi }) => {
      adminApi.siniflar()
        .then((res) => {
          if (Array.isArray(res.data)) {
            const mapped = res.data.map((s: any) => ({
              id: s.id,
              sinif: s.ad || 'Bilinmiyor',
              ogrenci: s.ogrenciSayisi || 0,
              ogretmen: s.sorumluOgretmen || 'Atanmadı',
              devam: 100,
              renk: s.renk || '#3B82F6'
            }));
            setSiniflar(mapped);
          }
        })
        .catch(() => setSiniflar([]));
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      siniflariYukle();

      import('../../services/api').then(({ adminApi }) => {
        adminApi.kullanicilarByRol('OGRETMEN')
          .then((res) => {
            if (Array.isArray(res.data)) {
              setOgretmenler(res.data);
            }
          })
          .catch(() => setOgretmenler([]));
      });
    }, [siniflariYukle])
  );

  const ekle = async (yeni: SinifEkleData) => {
    setYukleniyor(true);
    try {
      const { adminApi } = await import('../../services/api');
      await adminApi.sinifEkle({
        ad: yeni.sinifAdi,
        sorumluOgretmenId: yeni.ogretmenId,
        renk: yeni.renk,
      });
      // Başarılı: veritabanından güncel listeyi yeniden çek
      siniflariYukle();
      setModalAcik(false);
      Alert.alert('Oluşturuldu', `${yeni.sinifAdi} sınıfı başarıyla eklendi.`);
    } catch (err: any) {
      const mesaj = err?.response?.data?.message || err?.message || 'Bilinmeyen hata';
      Alert.alert('Hata', `Sınıf eklenemedi: ${mesaj}`);
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.headerTitle}>Sınıflar</Text>
        <TouchableOpacity style={styles.ekleBtn} onPress={() => setModalAcik(true)}>
          <Ionicons name="add-outline" size={18} color={Colors.white} />
          <Text style={styles.ekleBtnText}>Sınıf</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.ozetRow}>
        <View style={styles.ozetKart}>
          <Text style={styles.ozetDeger}>{siniflar.length}</Text>
          <Text style={styles.ozetLabel}>Toplam Sınıf</Text>
        </View>
        <View style={styles.ozetKart}>
          <Text style={styles.ozetDeger}>{siniflar.reduce((t, s) => t + s.ogrenci, 0)}</Text>
          <Text style={styles.ozetLabel}>Toplam Öğrenci</Text>
        </View>
        <View style={styles.ozetKart}>
          <Text style={styles.ozetDeger}>%{Math.round(siniflar.reduce((t, s) => t + s.devam, 0) / siniflar.length)}</Text>
          <Text style={styles.ozetLabel}>Ort. Devam</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.liste} showsVerticalScrollIndicator={false}>
        {siniflar.map((s) => {
          const devamRenk = s.devam >= 90 ? Colors.success : s.devam >= 80 ? '#F59E0B' : Colors.danger;
          return (
            <TouchableOpacity
              key={s.id}
              style={styles.sinifKarti}
              activeOpacity={0.8}
              onPress={() => router.push({
                pathname: '/(admin)/class-detail' as any,
                params: { id: s.id, sinif: s.sinif, ogretmen: s.ogretmen, devam: s.devam, ogrenci: s.ogrenci, renk: s.renk, returnTo: 'classes' },
              })}
            >
              <View style={[styles.sinifRenkBar, { backgroundColor: s.renk }]} />
              <View style={styles.sinifIcerik}>
                <View style={styles.sinifRow}>
                  <View style={[styles.sinifIconBox, { backgroundColor: `${s.renk}18` }]}>
                    <Ionicons name="library-outline" size={20} color={s.renk} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.sinifAdi}>{s.sinif} Sınıfı</Text>
                    <Text style={styles.sinifOgretmen}>{s.ogretmen}</Text>
                  </View>
                  <View style={[styles.devamBadge, { backgroundColor: `${devamRenk}18` }]}>
                    <Text style={[styles.devamText, { color: devamRenk }]}>%{s.devam}</Text>
                  </View>
                  <Ionicons name="chevron-forward-outline" size={16} color={Colors.textMuted} />
                </View>
                <View style={styles.sinifAltRow}>
                  <View style={styles.sinifStat}>
                    <Text style={styles.sinifStatDeger}>{s.ogrenci}</Text>
                    <Text style={styles.sinifStatLabel}>Öğrenci</Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${s.devam}%` as any, backgroundColor: devamRenk }]} />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
        <View style={{ height: 80 }} />
      </ScrollView>

      <SinifEkleModal visible={modalAcik} onClose={() => setModalAcik(false)} onEkle={ekle} ogretmenlerListesi={ogretmenler} />
    </View>
  );
}

const mS = StyleSheet.create({
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
  renkDaire: { width: 32, height: 32, borderRadius: 16 },
  renkSecili: { borderWidth: 3, borderColor: Colors.white, transform: [{ scale: 1.15 }] },
  primaryBtn: { backgroundColor: Colors.accent, borderRadius: Radius.md, height: 54, alignItems: 'center', justifyContent: 'center', marginTop: Spacing.sm },
  primaryBtnText: { color: Colors.white, fontSize: FontSize.base, fontWeight: '700' },
  cancelBtn: { alignItems: 'center', paddingVertical: Spacing.md },
  cancelBtnText: { color: Colors.textMuted, fontSize: FontSize.sm, fontWeight: '600' },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { backgroundColor: Colors.primary, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.white },
  ekleBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.accent, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: Radius.full },
  ekleBtnText: { color: Colors.white, fontWeight: '700', fontSize: FontSize.sm },
  ozetRow: { flexDirection: 'row', gap: Spacing.sm, paddingHorizontal: Spacing.md, paddingTop: Spacing.md },
  ozetKart: { flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md, alignItems: 'center', ...Shadow.sm },
  ozetDeger: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.accent },
  ozetLabel: { fontSize: 10, color: Colors.textSecondary, marginTop: 2, textAlign: 'center' },
  liste: { paddingHorizontal: Spacing.md, paddingTop: Spacing.md },
  sinifKarti: { backgroundColor: Colors.surface, borderRadius: Radius.xl, marginBottom: Spacing.sm, flexDirection: 'row', overflow: 'hidden', ...Shadow.md },
  sinifRenkBar: { width: 5 },
  sinifIcerik: { flex: 1, padding: Spacing.md },
  sinifRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.md },
  sinifIconBox: { width: 44, height: 44, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  sinifAdi: { fontSize: FontSize.base, fontWeight: '800', color: Colors.textPrimary },
  sinifOgretmen: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  devamBadge: { borderRadius: Radius.md, paddingHorizontal: 10, paddingVertical: 4 },
  devamText: { fontSize: FontSize.sm, fontWeight: '800' },
  sinifAltRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  sinifStat: { alignItems: 'center', minWidth: 40 },
  sinifStatDeger: { fontSize: FontSize.base, fontWeight: '800', color: Colors.textPrimary },
  sinifStatLabel: { fontSize: 10, color: Colors.textMuted },
  progressBar: { flex: 1, height: 6, backgroundColor: Colors.border, borderRadius: Radius.full, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: Radius.full },
});
