import { useEffect, useRef, useState } from "react";

const ARABIC_TEXT =
  "واجهتُ العالم، وأهلي، وعاداتي وتقاليدي لأجلكِ.. وضعتكِ في كفة والدنيا في كفة، فكنتِ أنتِ أول وأهم اهتماماتي. نفذتُ ما طلبتِ وما لم تطلبي، وقابلتُ أذاكِ دائمًا بحبٍ أكبر.. لكن الموقف الأخير كان فظيعاً؛ أن أرى أثرَ غيري على جسدكِ وتنظرين إليّ باستفزاز وحقارة.. هو موقفٌ لا يُنسى ولا يُغتفر. أشعرُ بغثيانٍ كلما تذكرتُ تلك العلامة وتعاملكِ الدنيء. لقد كنتِ الصفحة الأغلى، والآن أنتِ السطر الذي سأمحوه للأبد.";

interface Props {
  text?: string;
  startDelayMs?: number;
}

export default function FarewellPassage({ text, startDelayMs = 1400 }: Props) {
  const passage = text ?? ARABIC_TEXT;
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const ref = useRef<HTMLParagraphElement | null>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    setCount(0);
    setDone(false);
    setStarted(false);
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(passage.length);
      setDone(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [passage]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    let timer: number;
    const tick = () => {
      i += 1;
      setCount(i);
      if (i >= passage.length) {
        setDone(true);
        return;
      }
      const ch = passage.charAt(i - 1);
      const isLongPause = /[\.؟!]/.test(ch);
      const isMidPause = /[،؛:\-—…]/.test(ch);
      const isComma = /[,]/.test(ch);
      const isSpace = ch === " ";
      const jitter = 30 + Math.random() * 60;
      let delay = 70 + jitter;
      if (isLongPause) delay = 720;
      else if (isMidPause) delay = 420;
      else if (isComma) delay = 320;
      else if (isSpace) delay = 55;
      timer = window.setTimeout(tick, delay);
    };
    timer = window.setTimeout(tick, startDelayMs);
    return () => window.clearTimeout(timer);
  }, [started, passage, startDelayMs]);

  return (
    <p
      ref={ref}
      className={`farewell-passage ${done ? "is-done" : ""} ${started ? "has-started" : ""}`}
      lang="ar"
      dir="rtl"
    >
      <span className="fp-text">{passage.slice(0, count)}</span>
      <span className="fp-caret" aria-hidden="true" />
    </p>
  );
}
