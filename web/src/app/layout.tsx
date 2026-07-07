import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader/Preloader";

export const metadata: Metadata = {
  title: "Kayaalp Dershane | Başarıya Giden Yol",
  description:
    "Kayaalp Dershane; alanında uzman öğretmen kadrosu, güçlü sınav sistemi ve bireysel takip anlayışıyla öğrencileri hedeflerine ulaştırıyor.",
  keywords: "dershane, kpss, yks, tyt, ayt, özel ders, eğitim merkezi",
  openGraph: {
    title: "Kayaalp Dershane | Başarıya Giden Yol",
    description:
      "Alanında uzman öğretmen kadrosu ve güçlü takip sistemiyle hedeflerine ulaş.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>
        <Preloader />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
