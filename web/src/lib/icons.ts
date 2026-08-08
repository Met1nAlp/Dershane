import type { IconType } from "react-icons";
import {
  FaTrophy,
  FaUsers,
  FaBookOpen,
  FaChartLine,
  FaBullseye,
  FaHeart,
  FaLightbulb,
  FaCalculator,
  FaGlobe,
  FaFlask,
  FaScroll,
  FaPalette,
  FaClipboardCheck,
  FaArrowTrendUp,
  FaBell,
  FaCampground,
  FaFutbol,
  FaGraduationCap,
  FaMusic,
  FaInstagram,
  FaXTwitter,
  FaYoutube,
  FaFacebookF,
  FaWhatsapp,
} from "react-icons/fa6";

// Admin panelindeki içerik alanlarında ikon, bileşen yerine bu sabit
// anahtarlardan biri (string) olarak saklanır (DB'de React bileşeni tutulamaz).
export const ICON_MAP: Record<string, IconType> = {
  trophy: FaTrophy,
  users: FaUsers,
  book: FaBookOpen,
  "book-open": FaBookOpen,
  chart: FaChartLine,
  bullseye: FaBullseye,
  heart: FaHeart,
  lightbulb: FaLightbulb,
  calculator: FaCalculator,
  globe: FaGlobe,
  flask: FaFlask,
  scroll: FaScroll,
  palette: FaPalette,
  "clipboard-check": FaClipboardCheck,
  "trend-up": FaArrowTrendUp,
  bell: FaBell,
  campground: FaCampground,
  futbol: FaFutbol,
  "graduation-cap": FaGraduationCap,
  music: FaMusic,
  instagram: FaInstagram,
  twitter: FaXTwitter,
  youtube: FaYoutube,
  facebook: FaFacebookF,
  whatsapp: FaWhatsapp,
};

export const ICON_KEYS = Object.keys(ICON_MAP);

export function getIcon(key: string): IconType {
  return ICON_MAP[key] ?? FaBookOpen;
}
