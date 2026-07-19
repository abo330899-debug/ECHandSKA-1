import { useState, useEffect } from "react";
import { Link } from "wouter";
import { type Translations, type Lang } from "@/i18n/translations";
import TypewriterTitle from "@/components/TypewriterTitle";
import FarewellPassage from "@/components/FarewellPassage";
import OblivionScript from "@/components/OblivionScript";
import Footer from "@/components/Footer";
import PhotoBackdrop from "@/components/PhotoBackdrop";
import usePageAudio from "@/hooks/usePageAudio";
import { usePrivateContent, pickLangPages } from "@/hooks/usePrivateContent";
import {
  ArrowUpRight,
  Images,
  Music2,
  PenLine,
  Route as RouteIcon,
  Sparkles,
} from "lucide-react";

const START = new Date("2025-08-20T04:04:00");

function elapsed(now: Date) {
  let d = Math.floor((now.getTime() - START.getTime()) / 1000);
  if (d < 0) d = 0;
  const days = Math.floor(d / 86400);
  const hrs = Math.floor((d % 86400) / 3600);
  const mins = Math.floor((d % 3600) / 60);
  const secs = d % 60;
  return { days, hrs, mins, secs };
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
    const interval = setInterval(() => setEl(elapsed(new Date())), 1000);
    return () => clearInterval(interval);
  }, []);

  const heroImage = data?.mediaConfig?.heroImageUrl ?? "";

  useEffect(() => {
    if (!heroImage) return;
    if (document.head.querySelector(`link[data-hero-preload="1"]`)) return;
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = heroImage;
    link.setAttribute("fetchpriority", "high");
    link.setAttribute("data-hero-preload", "1");
    document.head.appendChild(link);
    const img = new Image();
    (img as HTMLImageElement & { fetchPriority?: string }).fetchPriority =
      "high";
    img.decoding = "async";
    img.src = heroImage;
    return () => {
      if (link.parentNode) link.parentNode.removeChild(link);
    };
  }, [heroImage]);

  const cards = [
    {
      href: "/journey",
      title: t.card_moments_title,
      text: p.card_moments_text,
      icon: RouteIcon,
    },
    {
      href: "/photos",
      title: t.card_photos_title,
      text: p.card_photos_text,
      icon: Images,
    },
    {
      href: "/songs",
      title: t.card_songs_title,
      text: p.card_songs_text,
      icon: Music2,
    },
    {
      href: "/writings",
      title: t.card_writings_title,
      text: p.card_writings_text,
      icon: PenLine,
    },
  ];

  return (
    <div className="page-content home-page-premium">
      <PhotoBackdrop />
      <section className="hero hero-premium">
        <div
          className="hero-bg"
          style={heroImage ? { backgroundImage: `url(${heroImage})` } : {}}
        />
        <div className="hero-overlay" />
        <div className="hero-orb hero-orb-one" aria-hidden="true" />
        <div className="hero-orb hero-orb-two" aria-hidden="true" />

        <div className="hero-body hero-panel">
          <div className="hero-kicker">
            <Sparkles size={15} strokeWidth={1.8} aria-hidden="true" />
            <span className="eyebrow">{t.hero_eyebrow}</span>
          </div>

          <TypewriterTitle text={t.hero_title} />

          {p.farewell_title && (
            <FarewellPassage
              title={p.farewell_title}
              paragraphs={[
                p.farewell_p1 ?? "",
                p.farewell_p2 ?? "",
                p.farewell_p3 ?? "",
                p.farewell_p4 ?? "",
              ].filter(Boolean)}
              silverAnchor={p.farewell_silver_anchor ?? ""}
              memoryPattern={p.farewell_memory_pattern ?? ""}
              dir={t.dir}
              lang={lang}
            />
          )}

          <div className="elapsed-counter elapsed-counter-premium">
            <span>
              <strong>{el.days}</strong>
              <small>{t.countdown_day}</small>
            </span>
            <span>
              <strong>{el.hrs}</strong>
              <small>{t.countdown_hour}</small>
            </span>
            <span>
              <strong>{el.mins}</strong>
              <small>{t.countdown_minute}</small>
            </span>
            <span>
              <strong>{el.secs}</strong>
              <small>{t.countdown_second}</small>
            </span>
          </div>

          <div className="hero-buttons hero-actions">
            <Link href="/journey" className="btn btn-primary premium-button">
              <RouteIcon size={18} strokeWidth={1.8} aria-hidden="true" />
              <span>{t.open_story}</span>
            </Link>
            <Link href="/writings" className="btn btn-outline premium-button">
              <PenLine size={18} strokeWidth={1.8} aria-hidden="true" />
              <span>{t.read_pain}</span>
            </Link>
          </div>
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

      <section className="cards-section premium-cards-section">
        <div className="section-intro-mark" aria-hidden="true">
          <Sparkles size={17} strokeWidth={1.8} />
        </div>
        <div className="cards-grid premium-cards-grid">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.href}
                href={card.href}
                className="card glass premium-card"
              >
                <span className="premium-card-icon" aria-hidden="true">
                  <Icon size={25} strokeWidth={1.7} />
                </span>
                <div className="premium-card-copy">
                  <h3>{card.title}</h3>
                  {card.text && <p>{card.text}</p>}
                </div>
                <span className="premium-card-arrow" aria-hidden="true">
                  <ArrowUpRight size={18} strokeWidth={1.8} />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {p.footer_text && <Footer text={p.footer_text} />}
    </div>
  );
}
