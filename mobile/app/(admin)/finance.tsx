import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity,
  Modal, TextInput, KeyboardAvoidingView, Platform, Alert, TouchableWithoutFeedback,
  ActivityIndicator
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../../constants/theme';
import WheelDatePicker from '../../components/WheelDatePicker';

const TABS = ['Genel Bakış', 'Ödemeler', 'Gecikmiş'];
const aylikOzet = { beklenen: 0, gelen: 0, geciken: 0 };

interface Odeme {
  id: number;
  ogrenci: string;
  tutar: number;
  tarih: string;
  durum: 'odendi' | 'bekleniyor' | 'gecikti';
  sinif: string;
}

const INITIAL_ODEMELER: Odeme[] = [];

// OGRENCILER sabiti kaldırıldı, dinamik alınacak

function formatTarih(date: Date): string {
  const gun = date.getDate();
  const aylar = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
  return `${gun} ${aylar[date.getMonth()]}`;
}

function DurumBadge({ durum }: { durum: string }) {
  const map: Record<string, { label: string; renk: string }> = {
    odendi: { label: 'Ödendi', renk: Colors.success },
    bekleniyor: { label: 'Bekliyor', renk: '#F59E0B' },
    gecikti: { label: 'Gecikti', renk: Colors.danger },
  };
  const { label, renk } = map[durum] ?? map['bekleniyor'];
  return (
    <View style={[s.durumBadge, { backgroundColor: `${renk}18` }]}>
      <Text style={[s.durumText, { color: renk }]}>{label}</Text>
    </View>
  );
}

// ─── Ödeme Al Modal ──────────────────────────────────────────────
function OdemeAlModal({ visible, onClose, onKaydet, ogrenciler, yukleniyor }: {
  visible: boolean; onClose: () => void;
  onKaydet: (o: { ogrenciId: number; ogrenciAd: string; tutar: number; tarih: Date }) => void;
  ogrenciler: any[];
  yukleniyor: boolean;
}) {
  const [seciliOgrenciId, setSeciliOgrenciId] = useState<number | null>(null);
  const [tutar, setTutar] = useState('1500');
  const [tarih, setTarih] = useState(new Date());
  const bugun = new Date();

  const seciliOgrenci = ogrenciler.find(o => o.id === seciliOgrenciId);

  const kaydet = () => {
    if (!seciliOgrenciId || !tutar) { Alert.alert('Eksik Bilgi', 'Öğrenci ve tutar gereklidir.'); return; }
    onKaydet({
      ogrenciId: seciliOgrenciId,
      ogrenciAd: seciliOgrenci?.adSoyad || seciliOgrenci?.ad_soyad || 'Bilinmiyor',
      tutar: Number(tutar),
      tarih
    });
    // Formu temizle
    setSeciliOgrenciId(null); setTutar('1500'); setTarih(new Date());
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}><View style={mS.overlay} /></TouchableWithoutFeedback>
      <KeyboardAvoidingView behavior={'padding'} style={mS.kavoid}>
        <View style={[mS.sheet, { flexShrink: 1, maxHeight: '90%' }]}>
          <View style={mS.handle} />
          <ScrollView showsVerticalScrollIndicator={false} style={{ flexShrink: 1 }} contentContainerStyle={{ paddingBottom: 20 }}>
            <Text style={mS.title}>Ödeme Al</Text>
            <Text style={mS.label}>Öğrenci</Text>
            {ogrenciler.length === 0 ? (
              <Text style={{ fontSize: 12, color: Colors.textMuted, marginBottom: Spacing.md }}>Öğrenci bulunamadı.</Text>
            ) : (
              <ScrollView nestedScrollEnabled style={{ maxHeight: 120, marginBottom: Spacing.md }}>
                <View style={mS.chipRow}>
                  {ogrenciler.map((o) => {
                    const ad = o.adSoyad || o.ad_soyad || o.ad || 'Bilinmiyor';
                    const secili = seciliOgrenciId === o.id;
                    return (
                      <TouchableOpacity key={o.id} style={[mS.chip, secili && mS.chipAktif]} onPress={() => setSeciliOgrenciId(o.id)}>
                        <Text style={[mS.chipText, secili && mS.chipTextAktif]}>{ad}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>
            )}
            <Text style={mS.label}>Tutar (₺)</Text>
            <TextInput style={mS.input} placeholder="1500" placeholderTextColor={Colors.textMuted} value={tutar} onChangeText={setTutar} keyboardType="number-pad" />
            <Text style={mS.label}>Ödeme Tarihi</Text>
            <WheelDatePicker
              value={tarih}
              onChange={setTarih}
              minDate={new Date(2024, 0, 1)}
              maxDate={bugun}
            />
            {seciliOgrenciId && tutar ? (
              <View style={mS.ozet}>
                <Ionicons name="checkmark-circle-outline" size={16} color={Colors.success} />
                <Text style={mS.ozetText}>{seciliOgrenci?.adSoyad || 'Bilinmiyor'} — ₺{Number(tutar).toLocaleString('tr-TR')} · {formatTarih(tarih)}</Text>
              </View>
            ) : null}
            <TouchableOpacity style={[mS.primaryBtn, { marginTop: Spacing.md }, yukleniyor && { opacity: 0.6 }]} onPress={kaydet} disabled={yukleniyor}>
              {yukleniyor ? <ActivityIndicator color={Colors.white} /> : <Text style={mS.primaryBtnText}>Onayla</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={mS.cancelBtn} onPress={onClose} disabled={yukleniyor}><Text style={mS.cancelBtnText}>İptal</Text></TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Ana Ekran ───────────────────────────────────────────────────
export default function FinanceScreen() {
  const insets = useSafeAreaInsets();
  const [aktifTab, setAktifTab] = useState(0);
  const [modalAcik, setModalAcik] = useState(false);
  const [odemeler, setOdemeler] = useState<Odeme[]>(INITIAL_ODEMELER);
  const [ogrenciler, setOgrenciler] = useState<any[]>([]);
  const [islemYapiliyor, setIslemYapiliyor] = useState(false);

  useFocusEffect(
    useCallback(() => {
      import('../../services/api').then(({ adminApi }) => {
        // Ödemeleri Çek
        const fetchOdemeler = adminApi.odemeler().then((res) => {
          if (Array.isArray(res.data)) {
            const mapped = res.data.map((o: any) => ({
              id: o.id,
              ogrenci: o.ogrenciAdSoyad || 'Bilinmiyor',
              tutar: o.miktar || 0,
              tarih: o.odemeTarihi ? new Date(o.odemeTarihi).toLocaleDateString('tr-TR') : '—',
              durum: (o.durum || 'bekleniyor').toLowerCase() as any,
              sinif: o.sinif || '—'
            }));
            setOdemeler(mapped);
          }
        }).catch(() => setOdemeler([]));

        // Öğrencileri Çek
        const fetchOgrenciler = adminApi.kullanicilarByRol('OGRENCI').then((res) => {
          if (Array.isArray(res.data)) {
            setOgrenciler(res.data);
          }
        }).catch(() => setOgrenciler([]));

        Promise.all([fetchOdemeler, fetchOgrenciler]);
      });
    }, [])
  );

  const tahsilatYuzde = aylikOzet.beklenen > 0 ? Math.round((aylikOzet.gelen / aylikOzet.beklenen) * 100) : 0;

  const odemeKaydet = async (yeni: { ogrenciId: number; ogrenciAd: string; tutar: number; tarih: Date }) => {
    setIslemYapiliyor(true);
    try {
      const { adminApi } = await import('../../services/api');
      const payload = {
        ogrenciId: yeni.ogrenciId,
        miktar: yeni.tutar,
        odemeTarihi: yeni.tarih.toISOString(),
        durum: 'ODENDI'
      };
      await adminApi.odemeEkle(payload);
      
      // Listeyi güncellemek için lokal state ekle (daha hızlı hissettirir)
      setOdemeler((prev) => [{
        id: Date.now(),
        ogrenci: yeni.ogrenciAd,
        tutar: yeni.tutar,
        tarih: yeni.tarih.toLocaleDateString('tr-TR'),
        durum: 'odendi',
        sinif: '—'
      }, ...prev]);
      
      Alert.alert('Ödeme Alındı', `${yeni.ogrenciAd} — ₺${Number(yeni.tutar).toLocaleString('tr-TR')} kaydedildi.`);
      setModalAcik(false);
    } catch (error: any) {
      Alert.alert('Hata', error?.response?.data || 'Ödeme alınamadı.');
    } finally {
      setIslemYapiliyor(false);
    }
  };

  const listedekiler = aktifTab === 2
    ? odemeler.filter((o) => o.durum === 'gecikti')
    : aktifTab === 1 ? odemeler : null;

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <View style={[s.header, { paddingTop: insets.top + 12 }]}>
        <Text style={s.headerTitle}>Finans</Text>
        <TouchableOpacity style={s.ekleBtn} onPress={() => setModalAcik(true)}>
          <Ionicons name="add-outline" size={18} color={Colors.white} />
          <Text style={s.ekleBtnText}>Ödeme Al</Text>
        </TouchableOpacity>
      </View>

      <View style={s.tabContainer}>
        {TABS.map((t, i) => (
          <TouchableOpacity key={i} style={[s.tab, aktifTab === i && s.tabAktif]} onPress={() => setAktifTab(i)}>
            <Text style={[s.tabText, aktifTab === i && s.tabTextAktif]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {aktifTab === 0 && (
          <>
            <View style={s.anaKart}>
              <Text style={s.anaKartLabel}>Bu Ay Toplam Tahsilat</Text>
              <Text style={s.anaKartDeger}>₺{aylikOzet.gelen.toLocaleString('tr-TR')}</Text>
              <Text style={s.anaKartAlt}>₺{aylikOzet.beklenen.toLocaleString('tr-TR')} beklenen</Text>
              <View style={s.progressBg}>
                <View style={[s.progressFill, { width: `${tahsilatYuzde}%` as any }]} />
              </View>
              <Text style={s.tahsilatYuzde}>%{tahsilatYuzde} tahsil edildi</Text>
            </View>

            <View style={s.ozetRow}>
              {[
                { icon: 'checkmark-circle-outline' as const, label: 'Gelen', value: `₺${aylikOzet.gelen.toLocaleString('tr-TR')}`, renk: Colors.success },
                { icon: 'alert-circle-outline' as const, label: 'Geciken', value: `₺${aylikOzet.geciken.toLocaleString('tr-TR')}`, renk: Colors.danger },
                { icon: 'stats-chart-outline' as const, label: 'Başarı', value: `%${tahsilatYuzde}`, renk: '#3B82F6' },
              ].map((item, i) => (
                <View key={i} style={[s.ozetKart, { borderTopColor: item.renk }]}>
                  <Ionicons name={item.icon} size={20} color={item.renk} />
                  <Text style={[s.ozetDeger, { color: item.renk }]}>{item.value}</Text>
                  <Text style={s.ozetLabel}>{item.label}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity style={s.hizliOdemeBtn} onPress={() => setModalAcik(true)} activeOpacity={0.85}>
              <Ionicons name="card-outline" size={20} color={Colors.white} />
              <Text style={s.hizliOdemeText}>Ödeme Al</Text>
            </TouchableOpacity>

            <View style={s.sectionHeader}>
              <View style={s.sectionAccent} />
              <Text style={s.sectionTitle}>Son İşlemler</Text>
            </View>
            <View style={s.listKart}>
              {odemeler.filter((o) => o.durum === 'odendi').slice(0, 5).map((o, i, arr) => (
                <React.Fragment key={o.id}>
                  <View style={s.odemeRow}>
                    <View style={[s.odemeIcon, { backgroundColor: `${Colors.success}18` }]}>
                      <Ionicons name="card-outline" size={16} color={Colors.success} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={s.odemeAd}>{o.ogrenci}</Text>
                      <Text style={s.odemeSinif}>{o.sinif} · {o.tarih}</Text>
                    </View>
                    <Text style={[s.odemeTutar, { color: Colors.success }]}>+₺{o.tutar}</Text>
                  </View>
                  {i < arr.length - 1 && <View style={s.divider} />}
                </React.Fragment>
              ))}
            </View>
          </>
        )}

        {listedekiler && (
          listedekiler.length === 0 ? (
            <View style={s.bosContainer}>
              <Ionicons name="checkmark-circle-outline" size={56} color={Colors.success} />
              <Text style={s.bosText}>Gecikmiş ödeme yok</Text>
            </View>
          ) : (
            <View style={s.listKart}>
              {listedekiler.map((o, i) => (
                <React.Fragment key={o.id}>
                  <View style={s.odemeRow}>
                    <View style={[s.odemeIcon, { backgroundColor: Colors.surface2 }]}>
                      <Ionicons name="person-outline" size={16} color={Colors.textMuted} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={s.odemeAd}>{o.ogrenci}</Text>
                      <Text style={s.odemeSinif}>{o.sinif}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end', gap: 4 }}>
                      <Text style={s.odemeTutar}>₺{o.tutar}</Text>
                      <DurumBadge durum={o.durum} />
                    </View>
                  </View>
                  {i < listedekiler.length - 1 && <View style={s.divider} />}
                </React.Fragment>
              ))}
            </View>
          )
        )}

        <View style={{ height: 80 }} />
      </ScrollView>

      <OdemeAlModal 
        visible={modalAcik} 
        onClose={() => setModalAcik(false)} 
        onKaydet={odemeKaydet} 
        ogrenciler={ogrenciler}
        yukleniyor={islemYapiliyor}
      />
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
  ozet: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: `${Colors.success}12`, borderRadius: Radius.md, padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1, borderColor: `${Colors.success}25` },
  ozetText: { fontSize: FontSize.sm, color: Colors.success, fontWeight: '600', flex: 1 },
  primaryBtn: { backgroundColor: Colors.accent, borderRadius: Radius.md, height: 54, alignItems: 'center', justifyContent: 'center' },
  primaryBtnText: { color: Colors.white, fontSize: FontSize.base, fontWeight: '700' },
  cancelBtn: { alignItems: 'center', paddingVertical: Spacing.md },
  cancelBtnText: { color: Colors.textMuted, fontSize: FontSize.sm, fontWeight: '600' },
});

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { backgroundColor: Colors.primary, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.white },
  ekleBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.accent, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: Radius.full },
  ekleBtnText: { color: Colors.white, fontWeight: '700', fontSize: FontSize.sm },
  tabContainer: { flexDirection: 'row', backgroundColor: Colors.surface, marginHorizontal: Spacing.md, marginTop: Spacing.md, borderRadius: Radius.lg, padding: 4 },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: Radius.md },
  tabAktif: { backgroundColor: Colors.accent },
  tabText: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textMuted },
  tabTextAktif: { color: Colors.white },
  content: { paddingHorizontal: Spacing.md, paddingTop: Spacing.md },
  anaKart: { backgroundColor: Colors.primary, borderRadius: Radius.xl, padding: Spacing.lg, ...Shadow.lg },
  anaKartLabel: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.55)', marginBottom: 6 },
  anaKartDeger: { fontSize: 36, fontWeight: '900', color: Colors.white, letterSpacing: -1 },
  anaKartAlt: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.4)', marginTop: 4, marginBottom: Spacing.md },
  progressBg: { height: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: Radius.full, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: Colors.success, borderRadius: Radius.full },
  tahsilatYuzde: { fontSize: FontSize.sm, color: Colors.success, fontWeight: '700', marginTop: 8 },
  ozetRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md },
  ozetKart: { flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md, alignItems: 'center', borderTopWidth: 3, ...Shadow.sm, gap: 4 },
  ozetDeger: { fontSize: FontSize.base, fontWeight: '800' },
  ozetLabel: { fontSize: 10, color: Colors.textSecondary },
  hizliOdemeBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, backgroundColor: Colors.accent, borderRadius: Radius.lg, marginTop: Spacing.md, paddingVertical: Spacing.md, ...Shadow.md },
  hizliOdemeText: { color: Colors.white, fontSize: FontSize.base, fontWeight: '700' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: Spacing.lg, marginBottom: Spacing.sm },
  sectionAccent: { width: 4, height: 18, borderRadius: Radius.full, backgroundColor: Colors.accent },
  sectionTitle: { fontSize: FontSize.base, fontWeight: '700', color: Colors.textPrimary },
  listKart: { backgroundColor: Colors.surface, borderRadius: Radius.xl, paddingVertical: Spacing.xs, ...Shadow.sm },
  odemeRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingHorizontal: Spacing.md, paddingVertical: Spacing.md },
  odemeIcon: { width: 38, height: 38, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  odemeAd: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textPrimary },
  odemeSinif: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  odemeTutar: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.textPrimary },
  durumBadge: { borderRadius: Radius.sm, paddingHorizontal: 8, paddingVertical: 3 },
  durumText: { fontSize: 10, fontWeight: '700' },
  divider: { height: 1, backgroundColor: Colors.border, marginHorizontal: Spacing.md },
  bosContainer: { alignItems: 'center', paddingTop: 80, gap: Spacing.md },
  bosText: { fontSize: FontSize.base, color: Colors.textMuted },
});
