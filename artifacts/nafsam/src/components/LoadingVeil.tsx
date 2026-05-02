import { useEffect, useState } from "react";

interface Props {
  brand?: string;
  minDuration?: number;
}

export default function LoadingVeil({ brand = "Nafsam", minDuration = 1100 }: Props) {
  const [hidden, setHidden] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("aria-busy", "true");
    const start = performance.now();
    let timeoutId: number | undefined;
    const finish = () => {
      const elapsed = performance.now() - start;
      const wait = Math.max(0, minDuration - elapsed);
      timeoutId = window.setTimeout(() => setHidden(true), wait);
    };
    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish, { once: true });
    }
    return () => {
      window.removeEventListener("load", finish);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [minDuration]);

  useEffect(() => {
    if (!hidden) return;
    document.documentElement.removeAttribute("aria-busy");
    const t = window.setTimeout(() => setRemoved(true), 900);
    return () => window.clearTimeout(t);
  }, [hidden]);

  if (removed) return null;

  return (
    <div
      className={`loading-veil${hidden ? " is-hidden" : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Yükleniyor"
      aria-hidden={hidden}
    >
      <div className="loading-veil-glow" />
      <div className="loading-veil-inner">
        <div className="loading-veil-brand">{brand}</div>
        <div className="loading-veil-line">
          <span />
        </div>
        <div className="loading-veil-sub">açılıyor…</div>
      </div>
    </div>
  );
}
