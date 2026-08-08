import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const seedUsername = process.env.SEED_ADMIN_USERNAME;
  const seedPassword = process.env.SEED_ADMIN_PASSWORD;
  if (seedUsername && seedPassword) {
    const passwordHash = await bcrypt.hash(seedPassword, 10);
    await prisma.adminUser.upsert({
      where: { id: 1 },
      create: { id: 1, username: seedUsername, passwordHash },
      update: {},
    });
  } else {
    console.warn("SEED_ADMIN_USERNAME/SEED_ADMIN_PASSWORD tanımlı değil, AdminUser seed edilmedi.");
  }

  await prisma.heroContent.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      badge: "🏆 Türkiye'nin Güvenilir Eğitim Merkezi",
      headingLine1: "Hedefine Giden Yolda",
      rotatingWords: ["Yanındayız", "Rehberiniz", "Destekçiniz"],
      subtext:
        "Uzman öğretmen kadrosu, bireysel takip sistemi ve güçlü deneme sınav altyapısıyla seni başarıya taşıyoruz. YKS, KPSS ve daha fazlası için doğru adrestesin.",
      primaryCtaLabel: "Hemen Kayıt Ol",
      secondaryCtaLabel: "Hizmetlerimiz",
    },
    update: {},
  });

  await prisma.statsSectionContent.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      badge: "📈 Kanıtlanmış Sistem",
      titleLine1: "Başarı",
      titleLine2: "Hikayemiz",
      description:
        "Yılların getirdiği tecrübe ve alanında uzman kadromuzla, öğrencilerimizi sadece sınavlara değil geleceğe hazırlıyoruz. Rakamlar, doğru sistemin en büyük şahididir.",
    },
    update: {},
  });

  await prisma.statItem.deleteMany();
  await prisma.statItem.createMany({
    data: [
      {
        order: 0,
        icon: "trophy",
        value: 2400,
        suffix: "+",
        label: "Üniversite Yerleşimi",
        description: "Doğru yönlendirme ve azimli çalışmanın en güzel kanıtı mezunlarımızdır.",
        showInHero: true,
        showInStats: true,
      },
      {
        order: 1,
        icon: "chart",
        value: 94,
        prefix: "%",
        label: "Başarı Oranı",
        description: "Kişiselleştirilmiş deneme analizi ve birebir etüt sistemi ile emsalsiz başarı.",
        showInHero: false,
        showInStats: true,
      },
      {
        order: 2,
        icon: "users",
        value: 150,
        suffix: "+",
        label: "Uzman Öğretmen",
        description: "Branşında lider, güçlü, dinamik bir eğitim kadrosuna sahibiz.",
        showInHero: true,
        showInStats: true,
      },
      {
        order: 3,
        icon: "book",
        value: 18,
        label: "Yıllık Deneyim",
        description: "18 yıldır değişen sınav sistemlerine hızla adapte oluyor ve nesiller yetiştiriyoruz.",
        showInHero: true,
        showInStats: true,
      },
    ],
  });

  await prisma.aboutContent.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      badge: "✨ Biz Kimiz",
      titleLine1: "Başarının Arkasında",
      titleAccent: "18 Yıllık Deneyim",
      description:
        "Kayaalp Dershane, 2006 yılında tek bir inançla kapılarını açtı: Her öğrencinin potansiyeli vardır ve doğru yönlendirmeyle çiçeklenir. Bugün, binlerce mezunumuzla bu inancı doğruladık.",
      foundingYear: "2006",
      foundingLabel: "Kuruluş Yılı",
      foundingSub: "18 yıllık güven ve başarı",
    },
    update: {},
  });

  await prisma.aboutPillar.deleteMany();
  await prisma.aboutPillar.createMany({
    data: [
      {
        order: 0,
        icon: "bullseye",
        title: "Hedef Odaklı",
        description: "Her öğrencinin hedefi belirlenir ve tüm plan buna göre kişiselleştirilir.",
        highlight: "2006'dan bu yana 5.000'den fazla mezun",
      },
      {
        order: 1,
        icon: "heart",
        title: "Öğrenci Merkezli",
        description: "Ders saatinin ötesinde, psikolojik destek ve motivasyon takibi yapılır.",
        highlight: "Her öğrenciye özel haftalık çalışma planı",
      },
      {
        order: 2,
        icon: "lightbulb",
        title: "Yenilikçi Yöntem",
        description: "Soru bazlı ve kavram haritası destekli modern eğitim teknikleri.",
        highlight: "Haftalık TYT/AYT denemesi ve detaylı analiz",
      },
    ],
  });

  await prisma.serviceItem.deleteMany();
  await prisma.serviceItem.createMany({
    data: [
      { order: 0, icon: "calculator", title: "Matematik & Geometri", description: "Temel kavramdan ileri düzey problem çözümüne kadar kapsamlı Matematik eğitimi." },
      { order: 1, icon: "globe", title: "Türkçe & Edebiyat", description: "Sözel beceri, okuduğunu anlama ve yazılı anlatım güçlendirme programları." },
      { order: 2, icon: "flask", title: "Fen Bilimleri", description: "Fizik, Kimya ve Biyoloji derslerinde deney odaklı, kalıcı öğrenme modeli." },
      { order: 3, icon: "scroll", title: "Sosyal Bilimler", description: "Tarih, Coğrafya ve Felsefe alanlarında soru bazlı, ezberden uzak anlatım." },
      { order: 4, icon: "palette", title: "Yabancı Dil", description: "YDT ve günlük hayata yönelik İngilizce dil becerileri geliştirme programı." },
      { order: 5, icon: "clipboard-check", title: "Deneme Sınavları", description: "Gerçek sınav formatında, her hafta düzenlenen TYT/AYT deneme sınavları ve analizi." },
      { order: 6, icon: "trend-up", title: "Bireysel Etüt", description: "Öğrencinin zayıf olduğu konulara odaklanan, birebir planlı etüt programları." },
      { order: 7, icon: "bell", title: "Veli Bilgilendirme", description: "Anlık devamsızlık bildirimleri, aylık veli toplantıları ve düzenli sınav raporları." },
      { order: 8, icon: "book-open", title: "Rehberlik", description: "Tercih döneminden meslek seçimine kadar uzman rehberlik öğretmenleriyle destek." },
    ],
  });

  await prisma.teamMember.deleteMany();
  await prisma.teamMember.createMany({
    data: [
      { order: 0, name: "Ahmet Yılmaz", branch: "Matematik & Geometri", experienceLabel: "14 yıl deneyim", detail: "YKS 2024'te 8 öğrencisi ilk 500'e girdi.", colorHex: "#3b82f6", imageUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
      { order: 1, name: "Fatma Kaya", branch: "Türkçe & Edebiyat", experienceLabel: "11 yıl deneyim", detail: "Sözel alan uzmanı.", colorHex: "#8b5cf6", imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
      { order: 2, name: "Murat Demir", branch: "Fizik & Kimya", experienceLabel: "9 yıl deneyim", detail: "Deney odaklı öğretim.", colorHex: "#10b981", imageUrl: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
      { order: 3, name: "Zeynep Arslan", branch: "Biyoloji", experienceLabel: "7 yıl deneyim", detail: "TYT Fen dereceleri uzmanı.", colorHex: "#f59e0b", imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
      { order: 4, name: "Can Çelik", branch: "Tarih & Coğrafya", experienceLabel: "10 yıl deneyim", detail: "Sosyal bilimler şampiyonu.", colorHex: "#ef4444", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
      { order: 5, name: "Selin Öztürk", branch: "İngilizce & YDT", experienceLabel: "8 yıl deneyim", detail: "YDT 100 tam puan koçu.", colorHex: "#06b6d4", imageUrl: "https://images.unsplash.com/photo-1598550874175-4d0ef43ce902?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    ],
  });

  await prisma.eventItem.deleteMany();
  await prisma.eventItem.createMany({
    data: [
      { order: 0, title: "Bahar Pikniği", tag: "Piknik", imageUrl: "https://images.unsplash.com/photo-1526976668912-1a811878dd37?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" },
      { order: 1, title: "Dostluk Turnuvası", tag: "Futbol", imageUrl: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
      { order: 2, title: "Mezuniyet Gecesi", tag: "Mezuniyet", imageUrl: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
      { order: 3, title: "Bilim Şenliği", tag: "Bilim", imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
      { order: 4, title: "Kitap Kulübü Buluşması", tag: "Kulüp", imageUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" },
      { order: 5, title: "Yılsonu Konseri", tag: "Konser", imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    ],
  });

  await prisma.contactInfo.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      address: "Cumhuriyet Mah. Eğitim Cad. No:42, Merkez / Şehir",
      phone: "+90 (555) 000 00 00",
      email: "info@kayaalpders.com",
      workingHours: "Pzt–Cts: 08:00–21:00 | Paz: 09:00–18:00",
    },
    update: {},
  });

  await prisma.siteSettings.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      brandName: "Kayaalp Dershane",
      brandTagline: "Başarıya Giden Yol",
    },
    update: {},
  });

  await prisma.socialLink.deleteMany();
  await prisma.socialLink.createMany({
    data: [
      { order: 0, platform: "instagram", url: "#" },
      { order: 1, platform: "twitter", url: "#" },
      { order: 2, platform: "youtube", url: "#" },
      { order: 3, platform: "facebook", url: "#" },
    ],
  });

  console.log("Seed tamamlandı.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
