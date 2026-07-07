import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Sunucu adresi
export const BASE_URL = 'http://46.224.124.202:9090/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Her istekte token varsa otomatik ekle
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 401 gelirse token sil
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('jwt_token');
    }
    return Promise.reject(error);
  }
);

// ─── AUTH ────────────────────────────────────────────────────
export const authApi = {
  login: (tc: string, sifre: string) =>
    api.post('/auth/login', { tc, sifre }),
};

// ─── ADMIN ───────────────────────────────────────────────────
export const adminApi = {
  dashboard: () => api.get('/admin/dashboard'),
  // Kullanıcılar
  kullanicilar: () => api.get('/admin/kullanicilar'),
  kullaniciDetay: (id: number) => api.get(`/admin/kullanicilar/${id}`),
  kullanicilarByRol: (rol: string) => api.get(`/admin/kullanicilar/rol/${rol}`),
  kullaniciEkle: (data: any) => api.post('/admin/kullanicilar', data),
  kullaniciGuncelle: (id: number, data: any) => api.put(`/admin/kullanicilar/${id}`, data),
  kullaniciSil: (id: number) => api.delete(`/admin/kullanicilar/${id}`),
  aktifToggle: (id: number) => api.put(`/admin/kullanicilar/${id}/aktif`),
  // Sınıflar
  siniflar: () => api.get('/admin/siniflar'),
  sinifDetay: (id: number) => api.get(`/admin/siniflar/${id}`),
  sinifEkle: (data: any) => api.post('/admin/siniflar', data),
  sinifGuncelle: (id: number, data: any) => api.put(`/admin/siniflar/${id}`, data),
  sinifSil: (id: number) => api.delete(`/admin/siniflar/${id}`),
  ogrenciEkle: (sinifId: number, ogrenciId: number) =>
    api.post(`/admin/siniflar/${sinifId}/ogrenci/${ogrenciId}`),
  ogrenciCikar: (sinifId: number, ogrenciId: number) =>
    api.delete(`/admin/siniflar/${sinifId}/ogrenci/${ogrenciId}`),
  // Ödemeler
  odemeler: () => api.get('/admin/odemeler'),
  ogrenciOdemeleri: (ogrenciId: number) => api.get(`/admin/odemeler/ogrenci/${ogrenciId}`),
  odemeEkle: (data: any) => api.post('/admin/odemeler', data),
  odemeDurumGuncelle: (id: number, durum: string) =>
    api.put(`/admin/odemeler/${id}/durum`, { durum }),
  odemeSil: (id: number) => api.delete(`/admin/odemeler/${id}`),
  // Profil
  profil: () => api.get('/admin/profil'),
  sifreDegistir: (data: any) => api.put('/admin/sifre-degistir', data),
  // Duyurular
  duyuruGonder: (data: any) => api.post('/admin/duyurular', data),
  // Sınavlar
  sinavEkle: (data: any) => api.post('/admin/sinavlar', data),
};

// ─── ÖĞRETMEN ────────────────────────────────────────────────
export const ogretmenApi = {
  siniflarim: () => api.get('/ogretmen/siniflarim'),
  sinifOgrencileri: (sinifId: number) => api.get(`/ogretmen/siniflarim/${sinifId}/ogrenciler`),
  yoklamaKaydet: (data: any) => api.post('/ogretmen/yoklama', data),
  yoklamaGuncelle: (id: number, durum: string) => api.put(`/ogretmen/yoklama/${id}`, { durum }),
  sinifYoklamalari: (sinifId: number) => api.get(`/ogretmen/siniflarim/${sinifId}/yoklamalar`),
  notKaydet: (data: any) => api.post('/ogretmen/notlar', data),
  sinifNotlari: (sinifId: number) => api.get(`/ogretmen/siniflarim/${sinifId}/notlar`),
  notGuncelle: (id: number, data: any) => api.put(`/ogretmen/notlar/${id}`, data),
  notSil: (id: number) => api.delete(`/ogretmen/notlar/${id}`),
};

// ─── ÖĞRENCİ ─────────────────────────────────────────────────
export const ogrenciApi = {
  profil: () => api.get('/ogrenci/profil'),
  sifreDegistir: (data: any) => api.put('/ogrenci/sifre-degistir', data),
  notlarim: () => api.get('/ogrenci/notlarim'),
  yoklamalarim: () => api.get('/ogrenci/yoklamalarim'),
  sinifim: () => api.get('/ogrenci/sinifim'),
  ozet: () => api.get('/ogrenci/ozet'),
};

// ─── VELİ ────────────────────────────────────────────────────
export const veliApi = {
  profil: () => api.get('/veli/profil'),
  sifreDegistir: (data: any) => api.put('/veli/sifre-degistir', data),
  cocuklarim: () => api.get('/veli/cocuklarim'),
  ogrenciNotlari: (id: number) => api.get(`/veli/ogrenci/${id}/notlar`),
  ogrenciYoklamalari: (id: number) => api.get(`/veli/ogrenci/${id}/yoklamalar`),
  ogrenciOdemeleri: (id: number) => api.get(`/veli/ogrenci/${id}/odemeler`),
  ogrenciOzet: (id: number) => api.get(`/veli/ogrenci/${id}/ozet`),
};

export default api;
