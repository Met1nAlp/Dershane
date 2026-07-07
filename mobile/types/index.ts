// Uygulama genelinde kullanılan TypeScript tipleri

export type UserRole = 'admin' | 'ogretmen' | 'ogrenci' | 'veli';

export interface User {
  uid: string;
  tc_no: string;
  ad_soyad: string;
  role: UserRole;
  aktif_mi: boolean;
  profil_foto?: string;
}

export interface StudentInfo {
  user_id: string;
  veli_ids: string[];
  sinif_id: string;
  kayit_tarihi: string;
}

export interface Class {
  sinif_id: string;
  sinif_adi: string;
  danisman_id: string;
}

export interface Schedule {
  id: string;
  sinif_id: string;
  gun: 'Pazartesi' | 'Salı' | 'Çarşamba' | 'Perşembe' | 'Cuma' | 'Cumartesi';
  saat: string;
  ders_adi: string;
  ogretmen_id: string;
}

export interface Attendance {
  id: string;
  tarih: string;
  ders_saati: string;
  sinif_id: string;
  olmayanlar: string[];
}

export interface ExamResult {
  turkce_d: number;
  turkce_y: number;
  mat_d: number;
  mat_y: number;
  fen_d?: number;
  fen_y?: number;
  sosyal_d?: number;
  sosyal_y?: number;
  toplam_puan: number;
}

export interface Exam {
  id: string;
  sinav_adi: string;
  tarih: string;
  sonuclar: Record<string, ExamResult>;
}

export interface Assignment {
  id: string;
  sinif_id: string;
  ogretmen_id: string;
  baslik: string;
  aciklama: string;
  dosya_url?: string;
  son_tarih: string;
}

export interface TutoringSession {
  id: string;
  ogretmen_id: string;
  ogrenci_id: string;
  tarih_saat: string;
  durum: 'onay_bekliyor' | 'onaylandi' | 'iptal';
  konu?: string;
}

export interface Payment {
  id: string;
  veli_id: string;
  ogrenci_id: string;
  tutar: number;
  vade_tarihi: string;
  odeme_durumu: 'odendi' | 'beklemede' | 'gecikmis';
  aciklama?: string;
}

export interface Message {
  id: string;
  gonderen_id: string;
  alici_id: string;
  konu: string;
  mesaj: string;
  tarih: string;
  okundu: boolean;
}
