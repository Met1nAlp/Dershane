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
      badge: "Türkiye'nin Güvenilir Eğitim Merkezi",
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
      badge: "Kanıtlanmış Sistem",
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
      badge: "Biz Kimiz",
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

  await prisma.servicesSectionContent.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      badge: "Ne Sunuyoruz",
      title: "Hizmetlerimiz",
      description:
        "LGS'den TYT/AYT'ye, bireysel etütten grup derslerine kadar her ihtiyaca özel eğitim çözümleri sunuyoruz.",
    },
    update: {},
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

  await prisma.practiceSectionContent.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      badge: "Sınav Hazırlık",
      title: "Deneme ve Soru Çözümü",
      description: "Düzenli deneme sınavları ve birebir soru çözümü ile öğrencilerimizi sınava en iyi şekilde hazırlıyoruz.",
    },
    update: {},
  });

  const practiceItemCount = await prisma.practiceItem.count();
  if (practiceItemCount === 0) {
    await prisma.practiceItem.createMany({
      data: [
        { order: 0, title: "TYT Haftalık Deneme", tag: "TYT", description: "Her hafta gerçek sınav formatında TYT denemesi ve detaylı analiz.", imageUrl: "https://images.unsplash.com/photo-1596496181848-3091d4878b24?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
        { order: 1, title: "AYT Branş Denemesi", tag: "AYT", description: "Alan derslerine özel branş denemeleriyle konu eksiklerini tespit ediyoruz.", imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
        { order: 2, title: "LGS Deneme Sınavı", tag: "LGS", description: "Gerçek sınav sistemine uygun LGS denemeleriyle sınav tecrübesi kazandırıyoruz.", imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
        { order: 3, title: "Soru Çözüm Kampı", tag: "Kamp", description: "Yoğunlaştırılmış hafta sonu kamplarında yüzlerce soru çözerek pratik kazanıyoruz.", imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
        { order: 4, title: "Birebir Soru Analizi", tag: "Analiz", description: "Her öğrencinin yanlış yaptığı soruları birebir gözden geçiriyoruz.", imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
      ],
    });
  }

  await prisma.eventsSectionContent.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      badge: "Sosyal Hayat",
      title: "Sınıfın Ötesinde Anılar",
      description:
        "Piknikten futbol turnuvasına, bilim şenliğinden mezuniyet gecesine kadar öğrencilerimizle birlikte yaşadığımız anlardan kareler.",
    },
    update: {},
  });

  await prisma.eventItem.deleteMany();
  await prisma.eventItem.createMany({
    data: [
      { order: 0, title: "Bahar Pikniği", tag: "Piknik", description: "Ders yoğunluğuna kısa bir mola: doğada geçirdiğimiz keyifli bir gün.", imageUrl: "https://images.unsplash.com/photo-1526976668912-1a811878dd37?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" },
      { order: 1, title: "Dostluk Turnuvası", tag: "Futbol", description: "Sınıflar arası futbol turnuvamızda rekabet sahada, dostluk tribünde.", imageUrl: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
      { order: 2, title: "Mezuniyet Gecesi", tag: "Mezuniyet", description: "Yılların emeğini birlikte kutladığımız, unutulmaz bir veda gecesi.", imageUrl: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
      { order: 3, title: "Bilim Şenliği", tag: "Bilim", description: "Öğrencilerimizin hazırladığı deney ve projelerle dolu bir bilim günü.", imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
      { order: 4, title: "Kitap Kulübü Buluşması", tag: "Kulüp", description: "Her ay bir kitap, her buluşmada yeni bir bakış açısı.", imageUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" },
      { order: 5, title: "Yılsonu Konseri", tag: "Konser", description: "Müzik kulübümüzün sahne aldığı, yılı kapatan coşkulu konser.", imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    ],
  });

  await prisma.contactSectionContent.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      badge: "Bize Ulaşın",
      title: "İletişim & Kayıt",
      description: "Kayıt, bilgi almak veya ücretsiz deneme dersi için formu doldurun, sizi arayalım.",
      infoAddressLabel: "Adres",
      infoPhoneLabel: "Telefon",
      infoEmailLabel: "E-posta",
      infoHoursLabel: "Çalışma Saatleri",
      mapPlaceholderText: "Harita yakında eklenecek",
      formTitle: "Ücretsiz Ön Görüşme Talebi",
      formNameLabel: "Ad Soyad",
      formNamePlaceholder: "Adınızı girin",
      formPhoneLabel: "Telefon",
      formPhonePlaceholder: "0555 000 00 00",
      formEmailLabel: "E-posta",
      formEmailPlaceholder: "ornek@mail.com",
      formNoteLabel: "Not / Soru",
      formNotePlaceholder: "Hangi sınav için hazırlanıyorsunuz?",
      submitLabel: "Gönder",
      submitLoadingLabel: "Gönderiliyor...",
      successTitle: "Mesajınız İletildi!",
      successMessage: "En kısa sürede sizi arayacağız. Tercih ettiğiniz için teşekkürler.",
      successButtonLabel: "Yeni Mesaj Gönder",
      errorGeneric: "Bir şeyler ters gitti, lütfen tekrar deneyin.",
      errorUnexpected: "Beklenmeyen bir hata oluştu.",
    },
    update: {},
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

  await prisma.navbarContent.upsert({
    where: { id: 1 },
    create: { id: 1, ctaLabel: "Kayıt Ol" },
    update: {},
  });

  await prisma.footerContent.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      copyrightSuffix: "Tüm hakları saklıdır.",
      creditLine: "Dershane öğrencisi tarafından sevgiyle yapıldı - Metin KAYAALP",
    },
    update: {},
  });

  // Navbar'ın tam 6 kalemlik listesi kaynak alınıyor; eski Footer listesinde
  // "Etkinlikler" eksikti, artik ikisi ayni NavLink tablosunu kullaniyor.
  const navLinkCount = await prisma.navLink.count();
  if (navLinkCount === 0) {
    await prisma.navLink.createMany({
      data: [
        { order: 0, label: "Hakkımızda", href: "#hakkimizda" },
        { order: 1, label: "Hizmetler", href: "#hizmetler" },
        // Menude kisa etiket; bolumun tam adi PracticeSectionContent.title'da
        { order: 2, label: "Denemeler", href: "#deneme" },
        { order: 3, label: "Etkinlikler", href: "#etkinlikler" },
        { order: 4, label: "Başarılar", href: "#basarilar" },
        { order: 5, label: "İletişim", href: "#iletisim" },
      ],
    });
  }

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
