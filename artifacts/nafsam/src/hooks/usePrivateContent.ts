import { useEffect, useState } from "react";
import type { Lang } from "@/i18n/translations";
import { STATIC_MODE, R2_BASE } from "@/lib/r2";

export type Localized = string | Partial<Record<Lang, string>>;

export interface VideoItem {
  title: string;
  file: string;
  quote: Localized;
  caption: Localized;
}

export interface StoryCaption {
  title: string;
  text: string;
}

export interface WritingsBundle {
  w1?: string; w2?: string; w3?: string; w4?: string; w5?: string;
  w6?: string; w7?: string; w8?: string; w9?: string; w10?: string;
  farewell_title?: string;
  farewell_text?: string;
}

export interface MomentEntry {
  time: string;
  title: string;
  text: string;
  memory: string;
}

export interface SongItem {
  title: string;
  src: string;
}

export interface SpecialPhotoItem {
  file: string;
  featured?: boolean;
}

export interface JourneyEntry {
  file: string;
  title: Localized;
  quote: Localized;
}

export interface PrivatePages {
  hero_text?: string;
  quote_1?: string; quote_2?: string; quote_3?: string; quote_4?: string;
  card_moments_text?: string;
  card_photos_text?: string;
  card_songs_text?: string;
  card_writings_text?: string;
  footer_text?: string;
  moments_text?: string;
  moments_footer?: string;
  photos_text?: string;
  photos_header_sub?: string;
  photos_footer?: string;
  photo1_text?: string; photo2_text?: string; photo3_text?: string;
  photo4_text?: string; photo5_text?: string; photo6_text?: string;
  photo7_text?: string; photo7_sub?: string;
  photo8_text?: string; photo9_text?: string; photo10_text?: string;
  photo11_text?: string; photo12_text?: string; photo13_text?: string;
  photo14_text?: string; photo15_text?: string; photo16_text?: string;
  photo17_text?: string; photo18_text?: string; photo19_text?: string;
  photo20_text?: string; photo21_text?: string; photo22_text?: string;
  photo23_text?: string; photo24_text?: string; photo25_text?: string;
  photo26_text?: string; photo27_text?: string; photo28_text?: string;
  photo29_text?: string;
  songs_footer?: string;
  song1_text?: string; song2_text?: string; song3_text?: string; song4_text?: string;
  videos_text?: string;
  videos_footer?: string;
  video1_text?: string; video2_text?: string;
  writings_text?: string;
  writings_footer?: string;
  moment1_time?: string; moment1_title?: string; moment1_text?: string; moment1_memory?: string;
  moment2_time?: string; moment2_title?: string; moment2_text?: string; moment2_memory?: string;
  moment3_time?: string; moment3_title?: string; moment3_text?: string; moment3_memory?: string;
  moment4_time?: string; moment4_title?: string; moment4_text?: string; moment4_memory?: string;
  moment5_time?: string; moment5_title?: string; moment5_text?: string; moment5_memory?: string;
  moment6_time?: string; moment6_title?: string; moment6_text?: string; moment6_memory?: string;
  moment7_time?: string; moment7_title?: string; moment7_text?: string; moment7_memory?: string;
  moment8_time?: string; moment8_title?: string; moment8_text?: string; moment8_memory?: string;
  moment9_time?: string; moment9_title?: string; moment9_text?: string; moment9_memory?: string;
  farewell_title?: string;
  farewell_p1?: string;
  farewell_p2?: string;
  farewell_p3?: string;
  farewell_p4?: string;
  farewell_silver_anchor?: string;
  farewell_memory_pattern?: string;
  oblivion_name?: string;
  oblivion_hint?: string;
  oblivion_revealed?: string;
}

export interface MemoryFragment {
  label: string;
  body: string;
}

export interface FeelingsContent {
  memoryFragments?: MemoryFragment[];
  collapseLines?: string[];
  heroSub?: string;
  storyTitle?: string;
  storyParagraphs?: string[];
  memoriesTitle?: string;
  memoriesSub?: string;
  collapseTitle?: string;
  endingLine?: string;
}

export interface PageAudioMap {
  home?: string;
  moments?: string;
  photos?: string;
  writings?: string;
}

export interface MediaConfig {
  heroImageUrl?: string;
  photosDir?: string;
}

export interface PrivateContent {
  writings?: Partial<Record<Lang, WritingsBundle>>;
  captions?: Partial<Record<Lang, StoryCaption[]>>;
  pages?: Partial<Record<Lang, PrivatePages>>;
  videos?: VideoItem[];
  photos?: string[];
  songs?: SongItem[];
  specialPhotos?: SpecialPhotoItem[];
  journey?: JourneyEntry[];
  momentImages?: string[];
  feelings?: Partial<Record<Lang, FeelingsContent>>;
  pageAudio?: PageAudioMap;
  mediaConfig?: MediaConfig;
}

export function pickLangFeelings(
  data: PrivateContent | null,
  lang: Lang,
): FeelingsContent {
  if (!data?.feelings) return {};
  return data.feelings[lang] ?? data.feelings.tr ?? {};
}

export function pickLocalized(val: Localized | undefined, lang: Lang): string {
  if (val == null) return "";
  if (typeof val === "string") return val;
  return val[lang] ?? val.ar ?? val.tr ?? val.en ?? val.fa ?? "";
}

let cache: PrivateContent | null = null;
let inflight: Promise<PrivateContent | null> | null = null;
let generation = 0;
const subscribers = new Set<(c: PrivateContent | null) => void>();

let unauthorizedHandler: (() => void) | null = null;

export function getFallbackPrivateContent(): PrivateContent {
  return {
    videos: [
      {
        title: "Memory reel",
        file: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
        quote: { ar: "ذاكرة تُفتح ببطء", tr: "Hafıza yavaşça açılır", fa: "یادآوری به آرامی باز می‌شود", en: "A memory opens slowly" },
        caption: { ar: "لقطة من الحنين", tr: "Bir özlem anı", fa: "لحظه‌ای از دلتنگی", en: "A moment of longing" },
      },
    ],
    photos: ["/fallback/photo-1.svg", "/fallback/photo-2.svg", "/fallback/photo-3.svg"],
    songs: [
      {
        title: "Quiet light",
        src: "/fallback/soft-tone.wav",
      },
    ],
    specialPhotos: [
      { file: "/fallback/photo-1.svg", featured: true },
      { file: "/fallback/photo-2.svg" },
      { file: "/fallback/photo-3.svg" },
    ],
    journey: [
      {
        file: "/fallback/photo-2.svg",
        title: { ar: "المسار", tr: "Yol", fa: "راه", en: "The path" },
        quote: { ar: "كل خطوة تُذكر", tr: "Her adım hatırlanır", fa: "هر قدم به یاد می‌آید", en: "Every step is remembered" },
      },
    ],
    momentImages: ["/fallback/photo-1.svg", "/fallback/photo-2.svg", "/fallback/photo-3.svg"],
    pages: {
      ar: {
        hero_text: "أهلاً بكم في أرشيفنا", 
        photos_text: "صور مؤقتة لعرض التجربة عند غياب الخادم الخاص",
        songs_footer: "تمت إضافة محتوى احتياطي ليتاح العرض فوراً.",
        videos_text: "الفيديوهات تُعرض عبر رابط احتياطي حتى تتوفر الوسائط الأصلية.",
      },
      tr: {
        hero_text: "Arşivimize hoş geldiniz",
        photos_text: "Özel sunucu yokken deneyimi göstermek için geçici görseller",
        songs_footer: "Anında görünürlük için yedek içerik eklendi.",
        videos_text: "Orijinal medya erişilebilir olana kadar videolar yedek bağlantı ile gösterilir.",
      },
      fa: {
        hero_text: "به بایگانی ما خوش آمدید",
        photos_text: "تصاویر موقت برای نمایش تجربه در غیاب سرور خصوصی",
        songs_footer: "محتوای پشتیبان برای نمایش فوری اضافه شد.",
        videos_text: "ویدیوها تا در دسترس شدن رسانه اصلی با لینک پشتیبان نمایش داده می‌شوند.",
      },
      en: {
        hero_text: "Welcome to our archive",
        photos_text: "Temporary images to keep the experience visible without the private server",
        songs_footer: "Fallback content was added so the experience stays available immediately.",
        videos_text: "Videos use a fallback link until the original media is available.",
      },
    },
    captions: {
      ar: [
        { title: "أول خطوة", text: "تذكّرٌ يُفتح ببطء." },
        { title: "خطوة ثانية", text: "صوتٌ خافتٌ في الذاكرة." },
      ],
      tr: [
        { title: "İlk adım", text: "Yavaşça açılan bir hatıra." },
        { title: "İkinci adım", text: "Hafızada hafif bir ses." },
      ],
      fa: [
        { title: "اولین قدم", text: "یادآوری‌ای که آرام باز می‌شود." },
        { title: "قدم دوم", text: "صدایی کم‌جان در حافظه." },
      ],
      en: [
        { title: "First step", text: "A memory opening slowly." },
        { title: "Second step", text: "A faint sound in memory." },
      ],
    },
    feelings: {
      ar: {
        memoryFragments: [
          { label: "I", body: "بقايا ضوءٍ خافت." },
        ],
        collapseLines: ["الذاكرة تلمع ببطء."],
        heroSub: "الصفحة تعمل الآن حتى مع غياب الوسائط الأصلية.",
        storyTitle: "احتياطية", 
        storyParagraphs: ["إذا تعذر الوصول إلى الوسائط السرية، يظهر هذا المحتوى الاحتياطي."],
        memoriesTitle: "ذاكرة مؤقتة",
        memoriesSub: "محتوى بديل يثبت العرض.",
        collapseTitle: "استمرار",
        endingLine: "الواجهة ما زالت تعمل.",
      },
      tr: {
        memoryFragments: [{ label: "I", body: "Hafif bir ışığın izleri." }],
        collapseLines: ["Hafıza yavaşça parlar."],
        heroSub: "Orijinal medya erişilemediğinde sayfa hâlâ çalışır.",
        storyTitle: "Yedek mod",
        storyParagraphs: ["Gizli medya erişilemezse bu yedek içerik görünür."],
        memoriesTitle: "Geçici hafıza",
        memoriesSub: "Gösterimi koruyan alternatif içerik.",
        collapseTitle: "Devam",
        endingLine: "Arayüz hâlâ çalışıyor.",
      },
      fa: {
        memoryFragments: [{ label: "I", body: "ردی از روشنایی کم‌جان." }],
        collapseLines: ["حافظه آرام می‌درخشد."],
        heroSub: "اگر رسانه اصلی در دسترس نباشد، صفحه هنوز کار می‌کند.",
        storyTitle: "حالت پشتیبان",
        storyParagraphs: ["اگر رسانه خصوصی در دسترس نباشد، این محتوا جایگزین نمایش داده می‌شود."],
        memoriesTitle: "حافظه موقت",
        memoriesSub: "محتوای جایگزین برای حفظ نمایش.",
        collapseTitle: "ادامه",
        endingLine: "رابط هنوز کار می‌کند.",
      },
      en: {
        memoryFragments: [{ label: "I", body: "Traces of a faint light." }],
        collapseLines: ["Memory shines slowly."],
        heroSub: "The page still works when the original media is unavailable.",
        storyTitle: "Fallback mode",
        storyParagraphs: ["If private media cannot be reached, this backup content is shown instead."],
        memoriesTitle: "Temporary memory",
        memoriesSub: "Alternative content that keeps the experience alive.",
        collapseTitle: "Continuity",
        endingLine: "The interface still works.",
      },
    },
    mediaConfig: {
      heroImageUrl: "/fallback/hero.svg",
      photosDir: "",
    },
    pageAudio: {
      home: "/fallback/soft-tone.wav",
      moments: "/fallback/soft-tone.wav",
      photos: "/fallback/soft-tone.wav",
      writings: "/fallback/soft-tone.wav",
    },
  };
}

/**
 * Register a callback that fires when a private-content fetch returns 401.
 * App.tsx uses this to immediately evict auth state when a server-side
 * revocation or expiry is detected, without waiting for the next poll.
 */
export function setUnauthorizedHandler(cb: () => void): void {
  unauthorizedHandler = cb;
}

function mergeWithFallback(data: PrivateContent | null): PrivateContent {
  const fallback = getFallbackPrivateContent();
  if (!data) return fallback;
  return {
    ...fallback,
    ...data,
    videos: data.videos?.length ? data.videos : fallback.videos,
    photos: data.photos?.length ? data.photos : fallback.photos,
    songs: data.songs?.length ? data.songs : fallback.songs,
    specialPhotos: data.specialPhotos?.length ? data.specialPhotos : fallback.specialPhotos,
    journey: data.journey?.length ? data.journey : fallback.journey,
    momentImages: data.momentImages?.length ? data.momentImages : fallback.momentImages,
    pages: { ...fallback.pages, ...data.pages },
    captions: { ...fallback.captions, ...data.captions },
    feelings: { ...fallback.feelings, ...data.feelings },
    mediaConfig: {
      ...fallback.mediaConfig,
      ...data.mediaConfig,
      heroImageUrl: data.mediaConfig?.heroImageUrl || fallback.mediaConfig?.heroImageUrl,
    },
    pageAudio: {
      ...fallback.pageAudio,
      ...data.pageAudio,
    },
  };
}

async function loadPrivateContent(): Promise<PrivateContent | null> {
  if (cache) return cache;
  if (inflight) return inflight;
  const myGen = generation;

  const applyData = (data: PrivateContent | null) => {
    if (myGen !== generation) return null;
    const resolved = mergeWithFallback(data);
    cache = resolved;
    subscribers.forEach((cb) => cb(cache));
    return resolved;
  };

  if (STATIC_MODE) {
    inflight = fetch(`${R2_BASE}/content.json`, { cache: "no-store" })
      .then((r) => (r.ok ? (r.json() as Promise<PrivateContent>) : null))
      .then(applyData)
      .catch(() => {
        console.warn("[usePrivateContent] static content load failed, using fallback content");
        return applyData(null);
      })
      .finally(() => {
        inflight = null;
      });
    return inflight;
  }

  inflight = fetch("/api/private/content", { credentials: "same-origin", cache: "no-store" })
    .then((r) => {
      if (r.status === 401) {
        clearPrivateContentCache();
        unauthorizedHandler?.();
        return null;
      }
      return r.ok ? (r.json() as Promise<PrivateContent>) : null;
    })
    .then(applyData)
    .catch((err) => {
      console.warn("[usePrivateContent] api load failed, using fallback content", err);
      return applyData(null);
    })
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

export function clearPrivateContentCache(): void {
  generation += 1;
  cache = null;
  inflight = null;
  subscribers.forEach((cb) => cb(null));
}

/**
 * Probe /api/private/content with a no-store request, bypassing the module
 * cache, to detect server-side session revocation while the tab is open.
 *
 * Called by App.tsx on the same 60-second interval used for session polling so
 * that a 401 triggers immediate local eviction rather than waiting for the
 * session poll to catch the revocation separately.
 *
 * On success the cache is refreshed; on 401 unauthorizedHandler fires and the
 * cache is cleared.  Network errors are silently ignored.
 */
export async function revalidatePrivateContent(): Promise<void> {
  if (STATIC_MODE) return;
  try {
    const r = await fetch("/api/private/content", {
      credentials: "same-origin",
      cache: "no-store",
    });
    if (r.status === 401) {
      clearPrivateContentCache();
      unauthorizedHandler?.();
      return;
    }
    if (r.ok) {
      const data = (await r.json()) as PrivateContent;
      cache = data;
      subscribers.forEach((cb) => cb(cache));
    }
  } catch {
    // Network errors do not evict; the session poll will handle auth loss.
  }
}

export function usePrivateContent(): PrivateContent | null {
  const [data, setData] = useState<PrivateContent | null>(cache);

  useEffect(() => {
    let cancelled = false;
    if (!cache) {
      loadPrivateContent().then((d) => {
        if (!cancelled && d) setData(d);
      });
    }
    const cb = (c: PrivateContent | null) => {
      if (!cancelled) setData(c);
    };
    subscribers.add(cb);
    return () => {
      cancelled = true;
      subscribers.delete(cb);
    };
  }, []);

  return data;
}

export function pickLangPages(
  data: PrivateContent | null,
  lang: Lang,
): PrivatePages {
  if (!data?.pages) return {};
  return data.pages[lang] ?? data.pages.tr ?? {};
}
