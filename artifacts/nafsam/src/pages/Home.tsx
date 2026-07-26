import { useEffect, useState } from "react";
import { Link } from "wouter";
import { type Translations, type Lang } from "@/i18n/translations";
import FarewellPassage from "@/components/FarewellPassage";
import OblivionScript from "@/components/OblivionScript";
import Footer from "@/components/Footer";
import PhotoBackdrop from "@/components/PhotoBackdrop";
import usePageAudio from "@/hooks/usePageAudio";
import { usePrivateContent, pickLangPages } from "@/hooks/usePrivateContent";
import {
  ArrowUpRight,
  BookOpenText,
  Images,
  Music2,
  PenLine,
  Route as RouteIcon,
} from "lucide-react";

const START = new Date("2025-08-20T04:04:00");

function elapsed(now: Date) {
  let d = Math.floor((now.getTime() - START.getTime()) / 1000);
  if (d < 0) d = 0;
  return {
    days: Math.floor(d / 86400),
    hrs: Math.floor((d % 86400) / 3600),
    mins: Math.floor((d % 3600) / 60),
    secs: d % 60,
  };
}

interface Props {
  t: Translations;
  lang: Lang;
}

export default function Home({ t, lang }: Props) {
  const data = usePrivateContent();
  usePageAudio(data?.pageAudio?.home ?? "");
  const p = pickLangPages(data, lang);
  const [el, setEl] = useState(elapsed(new Date()));

  useEffect(() => {
    const interval = window.setInterval(() => setEl(elapsed(new Date())), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const heroImage = data?.mediaConfig?.heroImageUrl ?? "";

  useEffect(() => {
    if (!heroImage) return;
    if (document.head.querySelector('link[data-hero-preload="1"]')) return;
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = heroImage;
    link.setAttribute("fetchpriority", "high");
    link.setAttribute("data-hero-preload", "1");
    document.head.appendChild(link);
    return () => link.remove();
  }, [heroImage]);

  const chapters = [
    { href: "/journey", title: t.card_moments_title, text: p.card_moments_text, icon: RouteIcon, number: "01" },
    { href: "/photos", title: t.card_photos_title, text: p.card_photos_text, icon: Images, number: "02" },
    { href: "/songs", title: t.card_songs_title, text: p.card_songs_text, icon: Music2, number: "03" },
    { href: "/writings", title: t.card_writings_title, text: p.card_writings_text, icon: PenLine, number: "04" },
  ];

  return (
    <div className="page-content archive-home">
      <PhotoBackdrop />

      <section className="archive-cover">
        <div className="archive-cover-photo" style={heroImage ? { backgroundImage: `url(${heroImage})` } : {}} />
        <div className="archive-cover-shade" />
        <div className="archive-cover-grain" aria-hidden="true" />

        <div className="archive-cover-content">
          <div className="archive-volume">
            <BookOpenText size={16} strokeWidth={1.5} />
            <span>{t.hero_eyebrow}</span>
          </div>

          <h1 className="archive-title">{t.hero_title}</h1>

          {p.farewell_title && (
            <FarewellPassage
              title={p.farewell_title}
              paragraphs={[p.farewell_p1 ?? "", p.farewell_p2 ?? "", p.farewell_p3 ?? "", p.farewell_p4 ?? ""].filter(Boolean)}
              silverAnchor={p.farewell_silver_anchor ?? ""}
              memoryPattern={p.farewell_memory_pattern ?? ""}
              dir={t.dir}
              lang={lang}
            />
          )}

          <div className="archive-time" aria-label={t.elapsed_label}>
            <span><strong>{el.days}</strong><small>{t.countdown_day}</small></span>
            <i aria-hidden="true" />
            <span><strong>{String(el.hrs).padStart(2, "0")}</strong><small>{t.countdown_hour}</small></span>
            <span><strong>{String(el.mins).padStart(2, "0")}</strong><small>{t.countdown_minute}</small></span>
            <span><strong>{String(el.secs).padStart(2, "0")}</strong><small>{t.countdown_second}</small></span>
          </div>

          <div className="archive-cover-actions">
            <Link href="/journey" className="archive-primary-link">
              <span>{t.open_story}</span>
              <ArrowUpRight size={17} strokeWidth={1.7} />
            </Link>
            <Link href="/writings" className="archive-text-link">{t.read_pain}</Link>
          </div>
        </div>
      </section>

      <section className="archive-index">
        <header className="archive-index-header">
          <span className="archive-index-label">Memory archive</span>
          <div className="archive-index-rule" />
        </header>

        <div className="archive-chapters">
          {chapters.map((chapter) => {
            const Icon = chapter.icon;
            return (
              <Link key={chapter.href} href={chapter.href} className="archive-chapter">
                <span className="archive-chapter-number">{chapter.number}</span>
                <span className="archive-chapter-icon"><Icon size={21} strokeWidth={1.45} /></span>
                <span className="archive-chapter-copy">
                  <strong>{chapter.title}</strong>
                  {chapter.text && <small>{chapter.text}</small>}
                </span>
                <ArrowUpRight className="archive-chapter-arrow" size={18} strokeWidth={1.5} />
              </Link>
            );
          })}
        </div>
      </section>

      {p.oblivion_name && (
        <OblivionScript
          name={p.oblivion_name}
          hint={p.oblivion_hint ?? ""}
          revealed={p.oblivion_revealed ?? ""}
          dir={t.dir}
          lang={lang}
        />
      )}

      {p.footer_text && <Footer text={p.footer_text} />}
    </div>
  );
}
