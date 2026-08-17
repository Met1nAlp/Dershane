import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader/Preloader";
import { getSiteSettings } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "Madalyon Akıl Treni Kurs Merkezi | Başarıya Giden Yol",
  description:
    "Madalyon Akıl Treni Kurs Merkezi; alanında uzman öğretmen kadrosu, güçlü sınav sistemi ve bireysel takip anlayışıyla LGS, TYT/AYT öğrencilerini hedeflerine ulaştırıyor.",
  keywords: "kurs merkezi, lgs, tyt, ayt, özel ders, eğitim merkezi, kahramanmaraş",
  openGraph: {
    title: "Madalyon Akıl Treni Kurs Merkezi | Başarıya Giden Yol",
    description:
      "Alanında uzman öğretmen kadrosu ve güçlü takip sistemiyle hedeflerine ulaş.",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Madalyon Akıl Treni Kurs Merkezi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Madalyon Akıl Treni Kurs Merkezi | Başarıya Giden Yol",
    description:
      "Alanında uzman öğretmen kadrosu ve güçlü takip sistemiyle hedeflerine ulaş.",
    images: ["/og-image.jpg"],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let brandName = "Madalyon Akıl Treni";
  try {
    brandName = (await getSiteSettings()).brandName;
  } catch {
    // DB geçici olarak erişilemezse preloader varsayılan adla gösterilir.
  }

  return (
    <html lang="tr">
      <body>
        <Preloader brandName={brandName} />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
