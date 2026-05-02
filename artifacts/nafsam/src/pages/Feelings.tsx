import { useEffect, useRef } from "react";
import EmberParticles from "@/components/EmberParticles";
import SmokeVeil from "@/components/SmokeVeil";
import { type Translations } from "@/i18n/translations";

interface Props {
  t: Translations;
}

interface MemoryFragment {
  label: string;
  body: string;
}

const MEMORY_FRAGMENTS: MemoryFragment[] = [
  {
    label: "I",
    body:
      "Bir gülüşün vardı… şimdi onu hatırladığımda içimde bir şey kapanıyor, bir kapı gibi, sessizce.",
  },
  {
    label: "II",
    body:
      "Sesini hâlâ duyabiliyorum, ama artık beni çağırmıyor. Sadece içimde bir oda boşaltıyor.",
  },
  {
    label: "III",
    body:
      "Bazı geceler nefes almak ağırlaşıyor, sanki yokluğun ciğerlerime yerleşmiş.",
  },
  {
    label: "IV",
    body:
      "Adını yazmaya çalıştım, kalem kırıldı. Hatıralar dilimde değil, parmaklarımda kanıyor.",
  },
  {
    label: "V",
    body:
      "Sevmek bittiğinde, geriye sevdiğin kişinin gölgesi değil; o gölgeye alışmış bir kalp kalıyor.",
  },
  {
    label: "VI",
    body:
      "Bir gün uyandım ve hiçbir şey acıtmadı. İşte o gün, içimde gerçekten bir şey öldüğünü anladım.",
  },
];

const COLLAPSE_LINES = [
  "Önce sesin sustu.",
  "Sonra ismin uzaklaştı.",
  "Sonra yüzün belirsizleşti.",
  "Sonra hatıran ağırlaştı.",
  "Sonra hatıran hafifledi.",
  "Sonra… hiçbir şey kalmadı.",
];

export default function Feelings({ t }: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const targets = root.querySelectorAll<HTMLElement>("[data-reveal]");
    const revealAll = () => targets.forEach((el) => el.classList.add("is-revealed"));
    if (typeof IntersectionObserver === "undefined") {
      revealAll();
      return;
    }
    try {
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              e.target.classList.add("is-revealed");
              io.unobserve(e.target);
            }
          }
        },
        { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
      );
      targets.forEach((el) => io.observe(el));
      return () => io.disconnect();
    } catch {
      revealAll();
      return;
    }
  }, []);

  useEffect(() => {
    const prevTitle = document.title;
    document.title = `Hisler Öldüğünde · ${t.brand}`;
    document.body.classList.add("ambient-mute");
    return () => {
      document.title = prevTitle;
      document.body.classList.remove("ambient-mute");
    };
  }, [t.brand]);

  return (
    <div className="feelings-page" ref={rootRef}>
      {/* ===== HERO ===== */}
      <section className="fl-hero">
        <SmokeVeil intensity="heavy" />
        <EmberParticles count={36} />
        <div className="fl-hero-vignette" />
        <div className="fl-hero-inner">
          <div className="fl-hero-eyebrow" data-reveal>
            <span className="fl-eyebrow-line" />
            <span>SESSİZLİĞİN BAŞLANGICI</span>
            <span className="fl-eyebrow-line" />
          </div>
          <h1 className="fl-hero-title" data-reveal>
            <span className="fl-hero-word">Hisler</span>
            <span className="fl-hero-word fl-hero-word-em">Öldüğünde</span>
          </h1>
          <p className="fl-hero-sub" data-reveal>
            Bir kalp ölmez, sadece konuşmayı bırakır.
            <br />
            Bu sayfa o sessizliği taşıyor.
          </p>
          <div className="fl-hero-scroll" data-reveal aria-hidden="true">
            <span>aşağı in</span>
            <span className="fl-hero-scroll-line" />
          </div>
        </div>
      </section>

      {/* ===== STORYTELLING ===== */}
      <section className="fl-section fl-story">
        <div className="fl-divider" aria-hidden="true">
          <span className="fl-divider-dot" />
          <span className="fl-divider-line" />
          <span className="fl-divider-dot" />
        </div>
        <div className="fl-section-inner">
          <h2 className="fl-section-title" data-reveal>
            Boğulma sessiz başlar
          </h2>
          <div className="fl-prose">
            <p data-reveal>
              Hisler bir gecede ölmez. Önce yorulur. Önce sustukları, söylediklerinden çoğalır.
              Önce baktıkları yerlere bakmaktan vazgeçerler. Sonra bir sabah uyanırsın ve
              içinde sadece eski bir oda kalmıştır; perdeleri çekili, ışıkları kapalı.
            </p>
            <p data-reveal>
              Seni en çok yoran şeyin onun gidişi olduğunu sanırsın. Oysa yoran şey, hâlâ
              dönmesini bekleyen o ufak, inatçı, çocuk kalbindir. Ona susmasını söylemek
              istersin ama sesin çıkmaz; çünkü ona ait olan tek şey, artık o sestir.
            </p>
            <p data-reveal>
              Bir insanı kaybetmek ölüm değildir. Kaybetmek, hâlâ o insanla yaşamayı
              sürdürmektir; ama onsuz. Her sabah aynı şehirde uyanırsın, aynı kapıdan
              çıkarsın, aynı sokaktan geçersin — sadece yanında biri eksiktir.
            </p>
          </div>
        </div>
      </section>

      {/* ===== MEMORIES ===== */}
      <section className="fl-section fl-memories">
        <div className="fl-divider" aria-hidden="true">
          <span className="fl-divider-dot" />
          <span className="fl-divider-line" />
          <span className="fl-divider-dot" />
        </div>
        <div className="fl-section-inner">
          <h2 className="fl-section-title" data-reveal>
            Kırık hatıralar
          </h2>
          <p className="fl-section-sub" data-reveal>
            Her biri bir cam kırığı. Sessizce kanatıyor.
          </p>
          <div className="fl-memory-grid">
            {MEMORY_FRAGMENTS.map((m) => (
              <article className="fl-memory-card" key={m.label} data-reveal>
                <div className="fl-memory-glow" aria-hidden="true" />
                <div className="fl-memory-label">{m.label}</div>
                <p className="fl-memory-text">{m.body}</p>
                <div className="fl-memory-fade" aria-hidden="true" />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===== COLLAPSE ===== */}
      <section className="fl-section fl-collapse">
        <SmokeVeil intensity="heavy" className="fl-collapse-smoke" />
        <div className="fl-collapse-inner">
          <h2 className="fl-collapse-title" data-reveal>
            Çöküş
          </h2>
          <div className="fl-collapse-stack">
            {COLLAPSE_LINES.map((line, i) => (
              <p
                key={i}
                className="fl-collapse-line"
                data-reveal
                style={{ ["--fl-step" as string]: `${i}` }}
              >
                {line}
              </p>
            ))}
          </div>
        </div>
        <div className="fl-collapse-darken" aria-hidden="true" />
      </section>

      {/* ===== ENDING ===== */}
      <section className="fl-section fl-ending">
        <EmberParticles count={14} className="fl-ending-embers" />
        <div className="fl-ending-inner" data-reveal>
          <p className="fl-ending-line">
            Bazı isimler ölmez,
            <br />
            sadece içinde gizlice fısıldamaya başlar.
          </p>
          <div className="fl-ending-signature" aria-hidden="true">
            <span />
            <span>·</span>
            <span />
          </div>
          <p className="fl-ending-sign">— Nafsam</p>
        </div>
        <div className="fl-ending-fade" aria-hidden="true" />
      </section>
    </div>
  );
}
