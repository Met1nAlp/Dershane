import React, { useState, useEffect } from 'react';
import {
  SafeAreaView, View, Text, StyleSheet, ScrollView,
  StatusBar, TouchableOpacity, Alert, Modal, KeyboardAvoidingView,
  TouchableWithoutFeedback, TextInput, Platform
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../../constants/theme';
import { mS } from './users'; // Reusing modal styles if needed, or define locally

const TABS_OGRENCI = ['Genel', 'Notlar', 'Devam', 'Ödemeler'];
const TABS_OGRETMEN = ['Genel', 'Sınıflar', 'Program'];

const MOCK_NOTLAR = [
  { ders: 'Matematik', sinavlar: [{ ad: '1. Yazılı', puan: 78, ort: 72, tarih: '10 Mar' }, { ad: '2. Yazılı', puan: 85, ort: 70, tarih: '15 May' }] },
  { ders: 'Fizik', sinavlar: [{ ad: '1. Yazılı', puan: 91, ort: 75, tarih: '12 Mar' }] }
];

const MOCK_ODEMELER = [
  { ay: 'Eylül 2024', tutar: 1500, durum: 'odendi', tarih: '05 Eyl' },
  { ay: 'Ekim 2024', tutar: 1500, durum: 'odendi', tarih: '03 Eki' },
];

const MOCK_DEVAM = {
  toplam: 120, gelen: 113, geciken: 4, devamsiz: 3,
  gunler: Array.from({ length: 30 }, (_, i) => {
    const r = Math.random();
    return r > 0.1 ? 'geldi' : r > 0.05 ? 'gecikti' : 'gelmedi';
  }),
};

function PuanBar({ puan, max = 100 }: { puan: number; max?: number }) {
  const renk = puan >= 85 ? Colors.success : puan >= 65 ? '#F59E0B' : Colors.danger;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 6 }}>
      <View style={det.barBg}>
        <View style={[det.barFill, { width: `${(puan / max) * 100}%` as any, backgroundColor: renk }]} />
      </View>
      <Text style={[det.puanText, { color: renk }]}>{puan}</Text>
    </View>
  );
}

function DurumDot({ durum }: { durum: string }) {
  const renk = durum === 'odendi' ? Colors.success : durum === 'gecikti' ? Colors.danger : '#F59E0B';
  const label = durum === 'odendi' ? 'Ödendi' : durum === 'gecikti' ? 'Gecikti' : 'Bekliyor';
  return (
    <View style={[det.durumBadge, { backgroundColor: `${renk}18` }]}>
      <Text style={[det.durumText, { color: renk }]}>{label}</Text>
    </View>
  );
}

export default function UserDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string; ad: string; tc: string; sinif: string; brans: string; devam: string; telefon: string; rol: string; aktif: string; returnTo: string }>();

  const isOgrenci = params.rol === 'ogrenci';
  const tabs = isOgrenci ? TABS_OGRENCI : TABS_OGRETMEN;
  const [aktifTab, setAktifTab] = useState(0);

  // Editable State
  const [ad, setAd] = useState(params.ad || '');
  const [tc, setTc] = useState(params.tc || '');
  const [sinif, setSinif] = useState(params.sinif || '');
  const [brans, setBrans] = useState(params.brans || '');
  const [telefon, setTelefon] = useState(params.telefon || '');
  const [aktif, setAktif] = useState(params.aktif === '1');

  useEffect(() => {
    setAd(params.ad || '');
    setTc(params.tc || '');
    setSinif(params.sinif || '');
    setBrans(params.brans || '');
    setTelefon(params.telefon || '');
    setAktif(params.aktif === '1');
  }, [params]);

  // Dynamic States for Teacher
  const [siniflarState, setSiniflarState] = useState<string[]>(['12-A']);
  const [programState, setProgramState] = useState<any[]>([
    { gun: 'Pazartesi', saatler: ['09:00 - 10:40', '13:00 - 14:40'] }
  ]);

  // Modals
  const [duzenleModal, setDuzenleModal] = useState(false);
  const [sinifAtaModal, setSinifAtaModal] = useState(false);
  const [programEkleModal, setProgramEkleModal] = useState(false);

  // Temp State for modals
  const [yeniSinif, setYeniSinif] = useState('');
  const [yeniGun, setYeniGun] = useState('Pazartesi');
  const [yeniSaat, setYeniSaat] = useState('');

  const devam = Number(params.devam ?? 100);
  const devamRenk = devam >= 90 ? Colors.success : devam >= 75 ? '#F59E0B' : Colors.danger;

  const handleSil = () => {
    Alert.alert('Silmeyi Onayla', `${ad} isimli kullanıcıyı tamamen silmek istediğinize emin misiniz?`, [
      { text: 'İptal', style: 'cancel' },
      { text: 'Sil', style: 'destructive', onPress: () => {
          // Mock Delete
          Alert.alert('Silindi', 'Kullanıcı sistemden kaldırıldı.');
          if (params.returnTo) router.push(`/(admin)/${params.returnTo}` as any);
          else router.push('/(admin)/users' as any);
        }
      }
    ]);
  };

  const handleDuzenleKaydet = () => {
    // Mock Save
    setDuzenleModal(false);
  };

  const handleSinifAta = () => {
    if (!yeniSinif) return;
    if (!siniflarState.includes(yeniSinif)) {
      setSiniflarState([...siniflarState, yeniSinif]);
    }
    setYeniSinif('');
    setSinifAtaModal(false);
  };

  const handleProgramEkle = () => {
    if (!yeniSaat) return;
    const existing = programState.find(p => p.gun === yeniGun);
    if (existing) {
      setProgramState(programState.map(p => 
        p.gun === yeniGun ? { ...p, saatler: [...p.saatler, yeniSaat] } : p
      ));
    } else {
      setProgramState([...programState, { gun: yeniGun, saatler: [yeniSaat] }]);
    }
    setYeniSaat('');
    setProgramEkleModal(false);
  };

  const Gunler = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
  const TumSiniflar = ['12-A', '12-B', '11-A', '11-B', '10-A', '10-B', '9-A', '9-B'];

  return (
    <SafeAreaView style={det.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Header */}
      <View style={det.header}>
        <TouchableOpacity style={det.backBtn} onPress={() => {
          if (params.returnTo) router.push(`/(admin)/${params.returnTo}` as any);
          else router.push('/(admin)/users' as any);
        }}>
          <Ionicons name="arrow-back-outline" size={22} color={Colors.white} />
        </TouchableOpacity>
        
        <View style={det.headerActions}>
          <TouchableOpacity style={det.actionBtn} onPress={() => setDuzenleModal(true)}>
            <Ionicons name="pencil-outline" size={20} color={Colors.white} />
          </TouchableOpacity>
          <TouchableOpacity style={det.actionBtn} onPress={handleSil}>
            <Ionicons name="trash-outline" size={20} color={Colors.danger} />
          </TouchableOpacity>
        </View>

        <View style={det.headerCenter}>
          <View style={det.avatarLarge}>
            <Text style={det.avatarHarf}>{ad.charAt(0) ?? '?'}</Text>
          </View>
          <Text style={det.headerAd}>{ad}</Text>
          <Text style={det.headerAlt}>{isOgrenci ? sinif : brans}</Text>
          {isOgrenci && (
            <View style={[det.devamPill, { backgroundColor: `${devamRenk}30` }]}>
              <Text style={[det.devamPillText, { color: devamRenk }]}>Devam %{devam}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Tabs */}
      <View style={det.tabRow}>
        {tabs.map((t, i) => (
          <TouchableOpacity key={i} style={[det.tab, aktifTab === i && det.tabAktif]} onPress={() => setAktifTab(i)}>
            <Text style={[det.tabText, aktifTab === i && det.tabTextAktif]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={det.content} showsVerticalScrollIndicator={false}>

        {/* GENEL */}
        {aktifTab === 0 && (
          <View style={det.kart}>
            {[
              { icon: 'card-outline' as const, label: 'TC Kimlik No', value: tc },
              { icon: 'call-outline' as const, label: 'Telefon', value: telefon || 'Belirtilmedi' },
              { icon: isOgrenci ? 'school-outline' as const : 'barbell-outline' as const, label: isOgrenci ? 'Sınıf' : 'Branş', value: isOgrenci ? sinif : brans },
              { icon: 'checkmark-circle-outline' as const, label: 'Durum', value: aktif ? 'Aktif' : 'Pasif' },
            ].map((row, i, arr) => (
              <React.Fragment key={i}>
                <View style={det.infoRow}>
                  <View style={det.infoIconBox}>
                    <Ionicons name={row.icon} size={18} color={Colors.accent} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={det.infoLabel}>{row.label}</Text>
                    <Text style={det.infoValue}>{row.value}</Text>
                  </View>
                </View>
                {i < arr.length - 1 && <View style={det.divider} />}
              </React.Fragment>
            ))}
          </View>
        )}

        {/* NOTLAR (Öğrenci) */}
        {aktifTab === 1 && isOgrenci && (
          <>
            {MOCK_NOTLAR.map((ders, i) => (
              <View key={i} style={[det.kart, { marginBottom: Spacing.sm }]}>
                <Text style={det.dersBaslik}>{ders.ders}</Text>
                {ders.sinavlar.map((sn, j) => (
                  <View key={j} style={{ marginTop: j > 0 ? Spacing.md : Spacing.sm }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={det.sinavAd}>{sn.ad}</Text>
                      <Text style={det.sinavTarih}>{sn.tarih}</Text>
                    </View>
                    <PuanBar puan={sn.puan} />
                    <Text style={det.ortText}>Sınıf ort: {sn.ort}</Text>
                  </View>
                ))}
              </View>
            ))}
          </>
        )}

        {/* SINIFLAR (Öğretmen) */}
        {aktifTab === 1 && !isOgrenci && (
          <View style={det.kart}>
            <View style={det.sectionHeaderRow}>
              <Text style={det.dersBaslik}>Atanan Sınıflar</Text>
              <TouchableOpacity style={det.ekleLinkBtn} onPress={() => setSinifAtaModal(true)}>
                <Ionicons name="add-circle-outline" size={16} color={Colors.accent} />
                <Text style={det.ekleLinkText}>Sınıf Ata</Text>
              </TouchableOpacity>
            </View>
            {siniflarState.length === 0 ? (
              <Text style={{ padding: Spacing.md, color: Colors.textMuted }}>Henüz sınıf atanmamış.</Text>
            ) : (
              siniflarState.map((s, i, arr) => (
                <React.Fragment key={i}>
                  <View style={det.sinifRow}>
                    <View style={det.sinifIcon}>
                      <Ionicons name="library-outline" size={18} color={Colors.accent} />
                    </View>
                    <Text style={det.sinifText}>{s} Sınıfı</Text>
                    <TouchableOpacity onPress={() => setSiniflarState(siniflarState.filter(x => x !== s))}>
                      <Ionicons name="trash-outline" size={18} color={Colors.danger} />
                    </TouchableOpacity>
                  </View>
                  {i < arr.length - 1 && <View style={det.divider} />}
                </React.Fragment>
              ))
            )}
          </View>
        )}

        {/* DEVAM (Öğrenci) */}
        {aktifTab === 2 && isOgrenci && (
          <>
            <View style={det.devamOzetRow}>
              {[
                { label: 'Toplam', value: MOCK_DEVAM.toplam, renk: Colors.textPrimary },
                { label: 'Geldi', value: MOCK_DEVAM.gelen, renk: Colors.success },
                { label: 'Geç Geldi', value: MOCK_DEVAM.geciken, renk: '#F59E0B' },
                { label: 'Gelmedi', value: MOCK_DEVAM.devamsiz, renk: Colors.danger },
              ].map((item, i) => (
                <View key={i} style={det.devamOzetKart}>
                  <Text style={[det.devamOzetDeger, { color: item.renk }]}>{item.value}</Text>
                  <Text style={det.devamOzetLabel}>{item.label}</Text>
                </View>
              ))}
            </View>
            <View style={det.kart}>
              <Text style={det.dersBaslik}>Haziran 2025</Text>
              <View style={det.takvimGrid}>
                {MOCK_DEVAM.gunler.map((durum, i) => {
                  const renk = durum === 'geldi' ? Colors.success : durum === 'gecikti' ? '#F59E0B' : Colors.danger;
                  return (
                    <View key={i} style={[det.takvimGun, { backgroundColor: `${renk}20`, borderColor: renk }]}>
                      <Text style={[det.takvimGunText, { color: renk }]}>{i + 1}</Text>
                    </View>
                  );
                })}
              </View>
              <View style={det.takvimLegend}>
                {[['Geldi', Colors.success], ['Geç', '#F59E0B'], ['Gelmedi', Colors.danger]].map(([l, r]) => (
                  <View key={l} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: r as string }} />
                    <Text style={{ fontSize: FontSize.xs, color: Colors.textMuted }}>{l}</Text>
                  </View>
                ))}
              </View>
            </View>
          </>
        )}

        {/* PROGRAM (Öğretmen) */}
        {aktifTab === 2 && !isOgrenci && (
          <View style={det.kart}>
            <View style={det.sectionHeaderRow}>
              <Text style={det.dersBaslik}>Ders Programı</Text>
              <TouchableOpacity style={det.ekleLinkBtn} onPress={() => setProgramEkleModal(true)}>
                <Ionicons name="add-circle-outline" size={16} color={Colors.accent} />
                <Text style={det.ekleLinkText}>Program Ekle</Text>
              </TouchableOpacity>
            </View>
            {programState.length === 0 ? (
              <Text style={{ padding: Spacing.md, color: Colors.textMuted }}>Henüz ders programı atanmamış.</Text>
            ) : (
              programState.map((item, i, arr) => (
                <React.Fragment key={i}>
                  <View style={{ paddingVertical: Spacing.md }}>
                    <Text style={det.dersBaslik}>{item.gun}</Text>
                    {item.saatler.map((s: string, j: number) => (
                      <View key={j} style={det.saatRow}>
                        <Ionicons name="time-outline" size={14} color={Colors.accent} />
                        <Text style={det.saatText}>{s}</Text>
                        <View style={{ flex: 1 }} />
                        <TouchableOpacity onPress={() => {
                          const newSaatler = item.saatler.filter((hs: string) => hs !== s);
                          if (newSaatler.length === 0) {
                            setProgramState(programState.filter(p => p.gun !== item.gun));
                          } else {
                            setProgramState(programState.map(p => p.gun === item.gun ? { ...p, saatler: newSaatler } : p));
                          }
                        }}>
                          <Ionicons name="close-circle" size={16} color={Colors.border} />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                  {i < arr.length - 1 && <View style={det.divider} />}
                </React.Fragment>
              ))
            )}
          </View>
        )}

        {/* ÖDEMELER (Öğrenci) */}
        {aktifTab === 3 && isOgrenci && (
          <View style={det.kart}>
            {MOCK_ODEMELER.map((o, i, arr) => (
              <React.Fragment key={i}>
                <View style={det.odemeRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={det.odemeAy}>{o.ay}</Text>
                    <Text style={det.odemeTarih}>{o.tarih}</Text>
                  </View>
                  <Text style={det.odemeTutar}>₺{o.tutar.toLocaleString('tr-TR')}</Text>
                  <DurumDot durum={o.durum} />
                </View>
                {i < arr.length - 1 && <View style={det.divider} />}
              </React.Fragment>
            ))}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* DÜZENLE MODAL */}
      <Modal visible={duzenleModal} transparent animationType="slide" onRequestClose={() => setDuzenleModal(false)}>
        <TouchableWithoutFeedback onPress={() => setDuzenleModal(false)}><View style={mS.overlay} /></TouchableWithoutFeedback>
        <KeyboardAvoidingView behavior={'padding'} style={mS.kavoid}>
          <View style={[mS.sheet, { flexShrink: 1, maxHeight: '90%' }]}>
            <View style={mS.handle} />
            <Text style={mS.title}>Kullanıcıyı Düzenle</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={mS.label}>Ad Soyad</Text>
              <TextInput style={mS.input} value={ad} onChangeText={setAd} />
              <Text style={mS.label}>TC Kimlik No</Text>
              <TextInput style={mS.input} value={tc} onChangeText={setTc} keyboardType="number-pad" />
              <Text style={mS.label}>Telefon</Text>
              <TextInput style={mS.input} value={telefon} onChangeText={setTelefon} keyboardType="phone-pad" />
              {isOgrenci ? (
                <>
                  <Text style={mS.label}>Sınıf</Text>
                  <TextInput style={mS.input} value={sinif} onChangeText={setSinif} />
                </>
              ) : (
                <>
                  <Text style={mS.label}>Branş</Text>
                  <TextInput style={mS.input} value={brans} onChangeText={setBrans} />
                </>
              )}
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: Spacing.md }}>
                <Text style={mS.label}>Durum (Aktif)</Text>
                <TouchableOpacity onPress={() => setAktif(!aktif)} style={{ width: 50, height: 28, borderRadius: 14, backgroundColor: aktif ? Colors.success : Colors.border, padding: 2 }}>
                  <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.white, alignSelf: aktif ? 'flex-end' : 'flex-start' }} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={mS.primaryBtn} onPress={handleDuzenleKaydet}>
                <Text style={mS.primaryBtnText}>Değişiklikleri Kaydet</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* SINIF ATA MODAL */}
      <Modal visible={sinifAtaModal} transparent animationType="slide" onRequestClose={() => setSinifAtaModal(false)}>
        <TouchableWithoutFeedback onPress={() => setSinifAtaModal(false)}><View style={mS.overlay} /></TouchableWithoutFeedback>
        <KeyboardAvoidingView behavior={'padding'} style={mS.kavoid}>
          <View style={mS.sheet}>
            <View style={mS.handle} />
            <Text style={mS.title}>Yeni Sınıf Ata</Text>
            <View style={mS.chipRow}>
              {TumSiniflar.map(s => (
                <TouchableOpacity key={s} style={[mS.chip, yeniSinif === s && mS.chipAktif]} onPress={() => setYeniSinif(s)}>
                  <Text style={[mS.chipText, yeniSinif === s && mS.chipTextAktif]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={mS.primaryBtn} onPress={handleSinifAta}>
              <Text style={mS.primaryBtnText}>Ata</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* PROGRAM EKLE MODAL */}
      <Modal visible={programEkleModal} transparent animationType="slide" onRequestClose={() => setProgramEkleModal(false)}>
        <TouchableWithoutFeedback onPress={() => setProgramEkleModal(false)}><View style={mS.overlay} /></TouchableWithoutFeedback>
        <KeyboardAvoidingView behavior={'padding'} style={mS.kavoid}>
          <View style={mS.sheet}>
            <View style={mS.handle} />
            <Text style={mS.title}>Programa Ders Ekle</Text>
            <Text style={mS.label}>Gün</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxHeight: 50, marginBottom: Spacing.md }}>
              <View style={[mS.chipRow, { flexWrap: 'nowrap' }]}>
                {Gunler.map(g => (
                  <TouchableOpacity key={g} style={[mS.chip, yeniGun === g && mS.chipAktif]} onPress={() => setYeniGun(g)}>
                    <Text style={[mS.chipText, yeniGun === g && mS.chipTextAktif]}>{g}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            <Text style={mS.label}>Saat Aralığı (Örn: 09:00 - 10:40)</Text>
            <TextInput style={mS.input} placeholder="09:00 - 10:40" placeholderTextColor={Colors.textMuted} value={yeniSaat} onChangeText={setYeniSaat} />
            <TouchableOpacity style={mS.primaryBtn} onPress={handleProgramEkle}>
              <Text style={mS.primaryBtnText}>Programa Ekle</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </SafeAreaView>
  );
}


const det = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.bg },
  header: { backgroundColor: Colors.primary, paddingBottom: 24, alignItems: 'center' },
  backBtn: { position: 'absolute', top: Spacing.lg, left: Spacing.md, zIndex: 10, padding: 4 },
  headerActions: { position: 'absolute', top: Spacing.lg, right: Spacing.md, flexDirection: 'row', gap: Spacing.md, zIndex: 10 },
  actionBtn: { padding: 4 },
  headerCenter: { alignItems: 'center', paddingTop: Spacing.lg },
  avatarLarge: { width: 72, height: 72, borderRadius: 36, backgroundColor: `${Colors.accent}25`, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.sm },
  avatarHarf: { fontSize: 32, fontWeight: '800', color: Colors.accent },
  headerAd: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.white },
  headerAlt: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  devamPill: { marginTop: Spacing.sm, paddingHorizontal: 14, paddingVertical: 4, borderRadius: Radius.full },
  devamPillText: { fontSize: FontSize.sm, fontWeight: '700' },
  tabRow: { flexDirection: 'row', backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabAktif: { borderBottomColor: Colors.accent },
  tabText: { fontSize: FontSize.xs, fontWeight: '600', color: Colors.textMuted },
  tabTextAktif: { color: Colors.accent },
  content: { paddingHorizontal: Spacing.md, paddingTop: Spacing.md },
  kart: { backgroundColor: Colors.surface, borderRadius: Radius.xl, paddingVertical: Spacing.xs, ...Shadow.sm, marginBottom: Spacing.md },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingHorizontal: Spacing.md, paddingVertical: Spacing.md },
  infoIconBox: { width: 36, height: 36, borderRadius: Radius.md, backgroundColor: `${Colors.accent}15`, alignItems: 'center', justifyContent: 'center' },
  infoLabel: { fontSize: FontSize.xs, color: Colors.textMuted },
  infoValue: { fontSize: FontSize.base, fontWeight: '600', color: Colors.textPrimary, marginTop: 2 },
  divider: { height: 1, backgroundColor: Colors.border, marginHorizontal: Spacing.md },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: Spacing.md },
  ekleLinkBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingTop: Spacing.md },
  ekleLinkText: { color: Colors.accent, fontSize: FontSize.sm, fontWeight: '600' },
  dersBaslik: { fontSize: FontSize.base, fontWeight: '800', color: Colors.textPrimary, paddingHorizontal: Spacing.md, paddingTop: Spacing.md, marginBottom: 4 },
  sinavAd: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textPrimary, paddingHorizontal: Spacing.md },
  sinavTarih: { fontSize: FontSize.xs, color: Colors.textMuted, paddingRight: Spacing.md },
  barBg: { flex: 1, height: 8, backgroundColor: Colors.border, borderRadius: Radius.full, marginLeft: Spacing.md, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: Radius.full },
  puanText: { fontSize: FontSize.sm, fontWeight: '800', width: 28, textAlign: 'right', marginRight: Spacing.md },
  ortText: { fontSize: FontSize.xs, color: Colors.textMuted, paddingHorizontal: Spacing.md, marginTop: 4, marginBottom: Spacing.sm },
  sinifRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingHorizontal: Spacing.md, paddingVertical: Spacing.md },
  sinifIcon: { width: 36, height: 36, borderRadius: Radius.md, backgroundColor: `${Colors.accent}15`, alignItems: 'center', justifyContent: 'center' },
  sinifText: { flex: 1, fontSize: FontSize.base, fontWeight: '600', color: Colors.textPrimary },
  saatRow: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: Spacing.md, marginTop: 6 },
  saatText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  devamOzetRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
  devamOzetKart: { flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md, alignItems: 'center', ...Shadow.sm },
  devamOzetDeger: { fontSize: FontSize.lg, fontWeight: '800' },
  devamOzetLabel: { fontSize: 10, color: Colors.textMuted, marginTop: 2, textAlign: 'center' },
  takvimGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingHorizontal: Spacing.md, paddingBottom: Spacing.md },
  takvimGun: { width: 32, height: 32, borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  takvimGunText: { fontSize: 11, fontWeight: '700' },
  takvimLegend: { flexDirection: 'row', gap: Spacing.md, paddingHorizontal: Spacing.md, paddingBottom: Spacing.md },
  odemeRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingHorizontal: Spacing.md, paddingVertical: Spacing.md },
  odemeAy: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textPrimary },
  odemeTarih: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  odemeTutar: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.textPrimary },
  durumBadge: { borderRadius: Radius.sm, paddingHorizontal: 8, paddingVertical: 4 },
  durumText: { fontSize: 10, fontWeight: '700' },
});
