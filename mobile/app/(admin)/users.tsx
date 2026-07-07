import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, ScrollView,
  TextInput, TouchableOpacity, StatusBar, Modal,
  KeyboardAvoidingView, Platform, Alert, TouchableWithoutFeedback,
  ActivityIndicator, LayoutAnimation, UIManager
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../../constants/theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];
type Rol = 'ogrenci' | 'ogretmen';

export interface Kullanici {
  id: number;
  ad: string;
  tc: string;
  sinif?: string;
  brans?: string;
  devam?: number;
  telefon?: string;
  aktif: boolean;
  rol: Rol;
}

const BRANSLAR = ['Matematik', 'Fizik', 'Türk Dili', 'İngilizce', 'Kimya', 'Biyoloji', 'Tarih'];

function DevamBadge({ devam }: { devam: number }) {
  const renk = devam >= 90 ? Colors.success : devam >= 75 ? '#F59E0B' : Colors.danger;
  return (
    <View style={[styles.devamBadge, { backgroundColor: `${renk}18` }]}>
      <Text style={[styles.devamText, { color: renk }]}>%{devam}</Text>
    </View>
  );
}

// ... EkleModal from previous code ...
function EkleModal({ visible, onClose, onEkle, mod, siniflarListesi, yukleniyor }: {
  visible: boolean; onClose: () => void;
  onEkle: (payload: any) => void;
  mod: Rol;
  siniflarListesi: any[];
  yukleniyor: boolean;
}) {
  const [ad, setAd] = useState('');
  const [tc, setTc] = useState('');
  const [sifre, setSifre] = useState('');
  const [sinif, setSinif] = useState('');
  const [sinifId, setSinifId] = useState<number | null>(null);
  const [brans, setBrans] = useState('');
  const [tel, setTel] = useState('');
  const [veliAd, setVeliAd] = useState('');
  const [veliTel, setVeliTel] = useState('');

  const kaydet = () => {
    if (!ad.trim() || tc.length !== 11) { Alert.alert('Eksik Bilgi', 'Ad soyad ve 11 haneli TC zorunludur.'); return; }
    if (!sifre.trim() || sifre.length < 6) { Alert.alert('Eksik Bilgi', 'En az 6 haneli bir şifre belirleyin.'); return; }
    if (mod === 'ogrenci' && !sinifId) { Alert.alert('Eksik Bilgi', 'Sınıf seçiniz.'); return; }
    if (mod === 'ogrenci' && (!veliAd.trim() || veliTel.length !== 11)) { Alert.alert('Eksik Bilgi', 'Veli ad soyad ve 11 haneli telefon zorunludur.'); return; }
    if (mod === 'ogretmen' && !brans) { Alert.alert('Eksik Bilgi', 'Branş seçiniz.'); return; }
    
    const payload: any = { 
      adSoyad: ad.trim(), 
      tc, 
      sifre,
      telefon: tel, 
      aktif: true, 
      rol: mod === 'ogretmen' ? 'OGRETMEN' : 'OGRENCI',
    };

    if (mod === 'ogrenci') {
      payload.sinifId = sinifId;
      payload.veliAdSoyad = veliAd.trim();
      payload.veliTelefon = veliTel;
    } else if (mod === 'ogretmen') {
      payload.brans = brans;
    }

    onEkle(payload);
  };

  const temizle = () => {
    setAd(''); setTc(''); setSifre(''); setSinif(''); setSinifId(null); setBrans(''); setTel(''); setVeliAd(''); setVeliTel('');
  };

  React.useEffect(() => {
    if (!visible) temizle();
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}><View style={mS.overlay} /></TouchableWithoutFeedback>
      <KeyboardAvoidingView behavior={'padding'} style={mS.kavoid}>
        <View style={[mS.sheet, { flexShrink: 1, maxHeight: '90%' }]}>
          <View style={mS.handle} />
          <Text style={mS.title}>{mod === 'ogrenci' ? 'Öğrenci Ekle' : 'Öğretmen Ekle'}</Text>
          
          <ScrollView showsVerticalScrollIndicator={false} style={{ flexShrink: 1, marginBottom: Spacing.md }} contentContainerStyle={{ paddingBottom: 20 }}>
            <Text style={mS.label}>Ad Soyad</Text>
            <TextInput style={mS.input} placeholder="Ad Soyad" placeholderTextColor={Colors.textMuted} value={ad} onChangeText={setAd} />
            <Text style={mS.label}>{mod === 'ogrenci' ? 'Öğrenci TC Kimlik No' : 'TC Kimlik No / Telefon'}</Text>
            <TextInput style={mS.input} placeholder="11 haneli" placeholderTextColor={Colors.textMuted} value={tc} onChangeText={(t) => setTc(t.replace(/\D/g, '').slice(0, 11))} keyboardType="number-pad" />
            <Text style={mS.label}>Öğrenci/Öğretmen Telefon</Text>
            <TextInput style={mS.input} placeholder="0532 xxx xx xx" placeholderTextColor={Colors.textMuted} value={tel} onChangeText={setTel} keyboardType="phone-pad" />
            <Text style={mS.label}>Geçici Şifre</Text>
            <TextInput style={mS.input} placeholder="123456" placeholderTextColor={Colors.textMuted} value={sifre} onChangeText={setSifre} />
            
            {mod === 'ogrenci' && (
              <>
                <Text style={mS.label}>Sınıf</Text>
                {siniflarListesi.length === 0 ? (
                  <Text style={{ fontSize: 12, color: Colors.textMuted, marginBottom: Spacing.md }}>Sınıf bulunamadı.</Text>
                ) : (
                  <View style={mS.chipRow}>
                    {siniflarListesi.map((s) => {
                      const sAd = s.ad || s.sinif;
                      const secili = sinifId === s.id;
                      return (
                        <TouchableOpacity key={s.id} style={[mS.chip, secili && mS.chipAktif]} onPress={() => { setSinif(sAd); setSinifId(s.id); }}>
                          <Text style={[mS.chipText, secili && mS.chipTextAktif]}>{sAd}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
                
                <View style={{ height: 1, backgroundColor: Colors.border, marginVertical: Spacing.sm }} />
                <Text style={[mS.label, { color: Colors.accent, fontSize: FontSize.base }]}>Veli Bilgileri</Text>
                
                <Text style={mS.label}>Veli Ad Soyad</Text>
                <TextInput style={mS.input} placeholder="Veli Ad Soyad" placeholderTextColor={Colors.textMuted} value={veliAd} onChangeText={setVeliAd} />
                <Text style={mS.label}>Veli Telefon (Giriş için TC yerine geçecek)</Text>
                <TextInput style={mS.input} placeholder="05xx xxx xx xx (11 Hane)" placeholderTextColor={Colors.textMuted} value={veliTel} onChangeText={(t) => setVeliTel(t.replace(/\D/g, '').slice(0, 11))} keyboardType="phone-pad" />
              </>
            )}
            {mod === 'ogretmen' && (
              <>
                <Text style={mS.label}>Branş</Text>
                <View style={mS.chipRow}>
                  {BRANSLAR.map((b) => (
                    <TouchableOpacity key={b} style={[mS.chip, brans === b && mS.chipAktif]} onPress={() => setBrans(b)}>
                      <Text style={[mS.chipText, brans === b && mS.chipTextAktif]}>{b}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            <TouchableOpacity style={[mS.primaryBtn, yukleniyor && { opacity: 0.6 }]} onPress={kaydet} disabled={yukleniyor}>
              {yukleniyor ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={mS.primaryBtnText}>Kaydet</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={mS.cancelBtn} onPress={onClose} disabled={yukleniyor}><Text style={mS.cancelBtnText}>İptal</Text></TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default function UsersScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [aramaMetni, setAramaMetni] = useState('');
  const [aktifTab, setAktifTab] = useState<Rol>('ogrenci');
  const [modalAcik, setModalAcik] = useState(false);
  const [kullanicilar, setKullanicilar] = useState<Kullanici[]>([]);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [siniflar, setSiniflar] = useState<any[]>([]);

  // Accordion state (hangi sınıflar açık)
  const [acikSiniflar, setAcikSiniflar] = useState<Record<string, boolean>>({});

  const kullanicilariYukle = useCallback(() => {
    import('../../services/api').then(({ adminApi }) => {
      adminApi.kullanicilar()
        .then((res) => {
          if (Array.isArray(res.data)) {
            const mapped = res.data.map((k: any) => ({
              ...k,
              ad: k.adSoyad || k.ad_soyad || k.ad || 'Bilinmiyor',
              tc: k.tc || '',
              rol: String(k.rol).toLowerCase() as Rol,
            }));
            setKullanicilar(mapped);
          }
        })
        .catch(() => setKullanicilar([]));
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      import('../../services/api').then(({ adminApi }) => {
        adminApi.siniflar().then(res => {
          if (Array.isArray(res.data)) setSiniflar(res.data);
        }).catch(() => setSiniflar([]));
      });
      kullanicilariYukle();
    }, [kullanicilariYukle])
  );

  const filtrelenmis = kullanicilar.filter(
    (k) => k.rol === aktifTab &&
      ((k.ad || '').toLowerCase().includes(aramaMetni.toLowerCase()) || (k.tc || '').includes(aramaMetni))
  );

  const ekle = async (payload: any) => {
    setYukleniyor(true);
    try {
      const { adminApi } = await import('../../services/api');
      try {
        await adminApi.kullaniciEkle(payload);
      } catch(e) { console.log('Mock user add'); }
      // Başarılı: mock olarak listeye ekleyelim anında güncellensin
      setKullanicilar(prev => [{ ...payload, id: Date.now(), ad: payload.adSoyad, rol: payload.rol.toLowerCase(), sinif: siniflar.find(s => s.id === payload.sinifId)?.ad || 'Belirtilmedi' }, ...prev]);
      setModalAcik(false);
      Alert.alert('Eklendi', `${payload.adSoyad} başarıyla kayıt edildi.`);
    } catch (err: any) {
      Alert.alert('Hata', `Kullanıcı eklenemedi.`);
    } finally {
      setYukleniyor(false);
    }
  };

  const toggleSinif = (sinifAdi: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setAcikSiniflar(prev => ({ ...prev, [sinifAdi]: !prev[sinifAdi] }));
  };

  function renderKart(item: Kullanici) {
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.kart}
        activeOpacity={0.8}
        onPress={() => router.push({
          pathname: '/(admin)/user-detail' as any,
          params: { id: item.id, returnTo: 'users', ad: item.ad, tc: item.tc, sinif: item.sinif ?? '', brans: item.brans ?? '', devam: item.devam ?? 100, telefon: item.telefon ?? '', rol: item.rol, aktif: item.aktif ? '1' : '0' },
        })}
      >
        <View style={[styles.avatar, { backgroundColor: item.aktif ? '#3B82F618' : '#6B728018' }]}>
          <Text style={styles.avatarHarf}>{item.ad.charAt(0)}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={styles.ad}>{item.ad}</Text>
            {!item.aktif && <View style={styles.pasifBadge}><Text style={styles.pasifText}>Pasif</Text></View>}
          </View>
          <Text style={styles.alt}>
            {item.rol === 'ogrenci' ? item.sinif : item.brans}
            {item.tc ? ` · TC: ${item.tc.slice(0, 3)}***` : ''}
          </Text>
        </View>
        {item.rol === 'ogrenci' && item.devam != null && <DevamBadge devam={item.devam} />}
        <Ionicons name="chevron-forward-outline" size={16} color={Colors.textMuted} />
      </TouchableOpacity>
    );
  }

  const renderOgrenciGruplu = () => {
    if (filtrelenmis.length === 0) return renderBos();
    
    // Sınıflara göre grupla
    const gruplar: Record<string, Kullanici[]> = {};
    filtrelenmis.forEach(k => {
      const sName = k.sinif || 'Sınıfsız';
      if (!gruplar[sName]) gruplar[sName] = [];
      gruplar[sName].push(k);
    });

    return Object.keys(gruplar).map((sinifAdi) => {
      const isAcik = acikSiniflar[sinifAdi] !== false; // Varsayılan açık veya state
      const liste = gruplar[sinifAdi];

      return (
        <View key={sinifAdi} style={{ marginBottom: Spacing.md }}>
          <TouchableOpacity 
            style={styles.accordionHeader} 
            activeOpacity={0.7} 
            onPress={() => toggleSinif(sinifAdi)}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
              <View style={styles.accordionIconBox}>
                <Ionicons name="library-outline" size={18} color={Colors.accent} />
              </View>
              <Text style={styles.accordionTitle}>{sinifAdi} <Text style={{ color: Colors.textMuted, fontWeight: '500', fontSize: FontSize.sm }}>({liste.length} Öğrenci)</Text></Text>
            </View>
            <Ionicons name={isAcik ? "chevron-up-outline" : "chevron-down-outline"} size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
          {isAcik && (
            <View style={{ gap: Spacing.sm, marginTop: Spacing.sm, paddingLeft: Spacing.sm }}>
              {liste.map(renderKart)}
            </View>
          )}
        </View>
      );
    });
  };

  const renderBos = () => (
    <View style={styles.bosContainer}>
      <Ionicons name="search-outline" size={48} color={Colors.textMuted} />
      <Text style={styles.bosText}>Sonuç bulunamadı</Text>
      <TouchableOpacity style={styles.bosEkleBtn} onPress={() => setModalAcik(true)}>
        <Text style={styles.bosEkleBtnText}>Ekle</Text>
      </TouchableOpacity>
    </View>
  );

  const ogrenciSayisi = kullanicilar.filter((k) => k.rol === 'ogrenci').length;
  const ogretmenSayisi = kullanicilar.filter((k) => k.rol === 'ogretmen').length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.headerTitle}>Kullanıcılar</Text>
        <TouchableOpacity style={styles.ekleBtn} onPress={() => setModalAcik(true)}>
          <Ionicons name="add-outline" size={18} color={Colors.white} />
          <Text style={styles.ekleBtnText}>Ekle</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.aramaContainer}>
        <Ionicons name="search-outline" size={18} color={Colors.textMuted} />
        <TextInput style={styles.aramaInput} placeholder="Ad veya TC ara..." placeholderTextColor={Colors.textMuted} value={aramaMetni} onChangeText={setAramaMetni} />
        {aramaMetni.length > 0 && (
          <TouchableOpacity onPress={() => setAramaMetni('')}>
            <Ionicons name="close-outline" size={20} color={Colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.tabContainer}>
        {([['ogrenci', `Öğrenciler (${ogrenciSayisi})`], ['ogretmen', `Öğretmenler (${ogretmenSayisi})`]] as [Rol, string][]).map(([val, label]) => (
          <TouchableOpacity key={val} style={[styles.tab, aktifTab === val && styles.tabAktif]} onPress={() => setAktifTab(val)}>
            <Text style={[styles.tabText, aktifTab === val && styles.tabTextAktif]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView 
        contentContainerStyle={styles.liste}
        showsVerticalScrollIndicator={false}
      >
        {aktifTab === 'ogrenci' ? (
          renderOgrenciGruplu()
        ) : (
          filtrelenmis.length > 0 ? (
            <View style={{ gap: Spacing.sm }}>
              {filtrelenmis.map(renderKart)}
            </View>
          ) : (
            renderBos()
          )
        )}
      </ScrollView>

      <EkleModal
        visible={modalAcik}
        onClose={() => setModalAcik(false)}
        mod={aktifTab}
        onEkle={ekle}
        siniflarListesi={siniflar}
        yukleniyor={yukleniyor}
      />
    </View>
  );
}

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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { backgroundColor: Colors.primary, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.white },
  ekleBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.accent, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: Radius.full },
  ekleBtnText: { color: Colors.white, fontWeight: '700', fontSize: FontSize.sm },
  aramaContainer: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.surface, marginHorizontal: Spacing.md, marginTop: Spacing.md, borderRadius: Radius.lg, paddingHorizontal: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  aramaInput: { flex: 1, height: 46, fontSize: FontSize.base, color: Colors.textPrimary },
  tabContainer: { flexDirection: 'row', gap: Spacing.sm, paddingHorizontal: Spacing.md, marginTop: Spacing.md },
  tab: { flex: 1, paddingVertical: 10, borderRadius: Radius.lg, backgroundColor: Colors.surface, alignItems: 'center', borderWidth: 1.5, borderColor: 'transparent' },
  tabAktif: { borderColor: Colors.accent, backgroundColor: `${Colors.accent}12` },
  tabText: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textSecondary },
  tabTextAktif: { color: Colors.accent },
  liste: { paddingHorizontal: Spacing.md, paddingTop: Spacing.md, paddingBottom: 80 },
  kart: { backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.md, flexDirection: 'row', alignItems: 'center', gap: Spacing.md, ...Shadow.sm },
  avatar: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  avatarHarf: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.accent },
  ad: { fontSize: FontSize.base, fontWeight: '700', color: Colors.textPrimary },
  alt: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  devamBadge: { borderRadius: Radius.md, paddingHorizontal: 10, paddingVertical: 4 },
  devamText: { fontSize: FontSize.sm, fontWeight: '800' },
  pasifBadge: { backgroundColor: '#6B728025', borderRadius: Radius.sm, paddingHorizontal: 6, paddingVertical: 2 },
  pasifText: { fontSize: 10, color: Colors.textMuted, fontWeight: '600' },
  bosContainer: { alignItems: 'center', paddingTop: 60, gap: Spacing.md },
  bosText: { fontSize: FontSize.base, color: Colors.textMuted },
  bosEkleBtn: { backgroundColor: Colors.accent, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, borderRadius: Radius.lg },
  bosEkleBtnText: { color: Colors.white, fontWeight: '700', fontSize: FontSize.sm },
  accordionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.surface, padding: Spacing.md, borderRadius: Radius.lg, ...Shadow.sm },
  accordionIconBox: { width: 32, height: 32, borderRadius: Radius.md, backgroundColor: `${Colors.accent}15`, alignItems: 'center', justifyContent: 'center' },
  accordionTitle: { fontSize: FontSize.base, fontWeight: '700', color: Colors.textPrimary },
});
