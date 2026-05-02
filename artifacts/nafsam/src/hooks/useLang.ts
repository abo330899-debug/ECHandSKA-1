import { useEffect } from "react";
import { type Lang, translations } from "@/i18n/translations";

export function useLang() {
  const lang: Lang = "tr";
  const t = translations[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = t.dir;
    try {
      localStorage.setItem("site_lang", lang);
    } catch {
      /* storage blocked */
    }
  }, [lang, t.dir]);

  const setLang = (_l: Lang) => {
    /* single-language site */
  };

  return { lang, setLang, t };
}
