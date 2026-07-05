export type LanguageCode = "en" | "fr" | "es" | "ar" | "pt" | "zh" | "hi" | "ha" | "sw" | "wo" | "yo";

export const LANGUAGES: { code: LanguageCode; label: string }[] = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
  { code: "ar", label: "العربية" },
  { code: "pt", label: "Português" },
  { code: "zh", label: "中文" },
  { code: "hi", label: "हिन्दी" },
  { code: "ha", label: "Hausa" },
  { code: "sw", label: "Kiswahili" },
  { code: "wo", label: "Wolof" },
  { code: "yo", label: "Yorùbá" },
];

type Dict = Record<string, Record<LanguageCode, string>>;

export const translations: Dict = {
  searchPlaceholder: {
    en: "Search posts or people",
    fr: "Rechercher des publications ou des personnes",
    es: "Buscar publicaciones o personas",
    ar: "ابحث عن منشورات أو أشخاص",
    pt: "Pesquisar publicações ou pessoas",
    zh: "搜索帖子或用户",
    hi: "पोस्ट या लोग खोजें",
    ha: "Nemo rubuce-rubuce ko mutane",
    sw: "Tafuta machapisho au watu",
    wo: "Seet ay bind wala nit",
    yo: "Wá àwọn ìfìwéránṣẹ́ tàbí àwọn ènìyàn",
  },
  peopleLabel: {
    en: "People", fr: "Personnes", es: "Personas", ar: "أشخاص", pt: "Pessoas", zh: "用户",
    hi: "लोग", ha: "Mutane", sw: "Watu", wo: "Nit", yo: "Ènìyàn",
  },
  scholarshipsLabel: {
    en: "Scholarships", fr: "Bourses", es: "Becas", ar: "المنح الدراسية", pt: "Bolsas de estudo", zh: "奖学金",
    hi: "छात्रवृत्तियाँ", ha: "Gurabu", sw: "Ufadhili wa masomo", wo: "Bursaar", yo: "Ìfunni Ẹ̀kọ́",
  },
  noResults: {
    en: "No results.", fr: "Aucun résultat.", es: "Sin resultados.", ar: "لا توجد نتائج.", pt: "Nenhum resultado.", zh: "没有结果。",
    hi: "कोई परिणाम नहीं।", ha: "Babu sakamako.", sw: "Hakuna matokeo.", wo: "Amul njeexital.", yo: "Kò sí àbájáde.",
  },
  network: {
    en: "Network", fr: "Réseau", es: "Red", ar: "الشبكة", pt: "Rede", zh: "人脉",
    hi: "नेटवर्क", ha: "Hanyar sadarwa", sw: "Mtandao", wo: "Rezo", yo: "Nẹ́tíwọ̀kì",
  },
  groups: {
    en: "Groups", fr: "Groupes", es: "Grupos", ar: "المجموعات", pt: "Grupos", zh: "群组",
    hi: "समूह", ha: "Kungiyoyi", sw: "Vikundi", wo: "Mbootaay", yo: "Àwùjọ",
  },
  messages: {
    en: "Messages", fr: "Messages", es: "Mensajes", ar: "الرسائل", pt: "Mensagens", zh: "消息",
    hi: "संदेश", ha: "Sakonni", sw: "Ujumbe", wo: "Bataaxal", yo: "Ìránṣẹ́",
  },
  saved: {
    en: "Saved", fr: "Enregistrés", es: "Guardados", ar: "المحفوظات", pt: "Salvos", zh: "已保存",
    hi: "सहेजे गए", ha: "An Ajiye", sw: "Vilivyohifadhiwa", wo: "Denc", yo: "Tí a Fi Pamọ́",
  },
  requirements: {
    en: "Requirements", fr: "Exigences", es: "Requisitos", ar: "المتطلبات", pt: "Requisitos", zh: "申请要求",
    hi: "आवश्यकताएँ", ha: "Bukatu", sw: "Mahitaji", wo: "Soxlawu yi", yo: "Àwọn Ohun Tó Yẹ",
  },
  profile: {
    en: "Profile", fr: "Profil", es: "Perfil", ar: "الملف الشخصي", pt: "Perfil", zh: "个人资料",
    hi: "प्रोफ़ाइल", ha: "Bayanan Martaba", sw: "Wasifu", wo: "Profil", yo: "Àkọsílẹ̀",
  },
  dashboard: {
    en: "Dashboard", fr: "Tableau de bord", es: "Panel", ar: "لوحة التحكم", pt: "Painel", zh: "仪表盘",
    hi: "डैशबोर्ड", ha: "Dashboard", sw: "Dashibodi", wo: "Dashboard", yo: "Pátákó Ìdarí",
  },
  settings: {
    en: "Settings", fr: "Paramètres", es: "Configuración", ar: "الإعدادات", pt: "Configurações", zh: "设置",
    hi: "सेटिंग्स", ha: "Saitunan", sw: "Mipangilio", wo: "Paramaan", yo: "Ètò",
  },
  signOut: {
    en: "Sign out", fr: "Déconnexion", es: "Cerrar sesión", ar: "تسجيل الخروج", pt: "Sair", zh: "退出登录",
    hi: "साइन आउट करें", ha: "Fita", sw: "Toka", wo: "Génn", yo: "Jáde",
  },
  following: {
    en: "Following", fr: "Abonnements", es: "Siguiendo", ar: "المتابَعون", pt: "Seguindo", zh: "关注",
    hi: "फॉलो हो रहे", ha: "Bibiya", sw: "Wanaofuatwa", wo: "Toppanteef", yo: "Títẹ̀lé",
  },
  followers: {
    en: "Followers", fr: "Abonnés", es: "Seguidores", ar: "المتابِعون", pt: "Seguidores", zh: "粉丝",
    hi: "फॉलोअर्स", ha: "Masu Bibiya", sw: "Wafuasi", wo: "Ñi koy toppi", yo: "Àwọn Olùtẹ̀lé",
  },
  darkMode: {
    en: "Dark mode", fr: "Mode sombre", es: "Modo oscuro", ar: "الوضع الداكن", pt: "Modo escuro", zh: "深色模式",
    hi: "डार्क मोड", ha: "Yanayin Duhu", sw: "Hali ya Giza", wo: "Mode ñuul", yo: "Ipò Òkùnkùn",
  },
  lightMode: {
    en: "Light mode", fr: "Mode clair", es: "Modo claro", ar: "الوضع الفاتح", pt: "Modo claro", zh: "浅色模式",
    hi: "लाइट मोड", ha: "Yanayin Haske", sw: "Hali ya Mwanga", wo: "Mode leer", yo: "Ipò Ìmọ́lẹ̀",
  },
};

export function t(key: keyof typeof translations, lang: LanguageCode): string {
  return translations[key]?.[lang] ?? translations[key]?.en ?? key;
}