import { type Lang } from "@/i18n/translations";

const flags: { lang: Lang; flag: string; title: string }[] = [
  { lang: "tr", flag: "\ud83c\uddf9\ud83c\uddf7", title: "T\u00fcrk\u00e7e" },
  { lang: "en", flag: "\ud83c\uddec\ud83c\udde7", title: "English" },
];

interface Props {
  lang: Lang;
  setLang: (l: Lang) => void;
  mini?: boolean;
}

export default function LanguageSwitcher({ lang, setLang, mini }: Props) {
  return (
    <div className={mini ? "lang-switcher flags-mini-vertical" : "lang-switcher flags-soft"}>
      {flags.map((f) => (
        <button
          key={f.lang}
          className={`lang-btn flag-btn${mini ? " mini" : ""}${
            lang === f.lang ? " active" : ""
          }`}
          onClick={() => setLang(f.lang)}
          title={f.title}
          aria-label={f.title}
        >
          {f.flag}
        </button>
      ))}
    </div>
  );
}
